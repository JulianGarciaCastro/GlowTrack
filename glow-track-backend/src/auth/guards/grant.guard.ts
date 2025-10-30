import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Authorization, AuthorizationStatus } from '../../database/entities/authorization.entity';
import { IS_GRANT_REQUIRED_KEY } from '../decorators/grant-required.decorator';

@Injectable()
export class GrantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Authorization)
    private authorizationsRepository: Repository<Authorization>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGrantRequired = this.reflector.getAllAndOverride<boolean>(IS_GRANT_REQUIRED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isGrantRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const grantToken = request.headers['x-grant-id'];

    if (!grantToken) {
      throw new UnauthorizedException('Grant token is required for this operation');
    }

    // Find and validate authorization
    const authorization = await this.authorizationsRepository.findOne({
      where: { token: grantToken },
      relations: ['patient'],
    });

    if (!authorization) {
      throw new UnauthorizedException('Invalid grant token');
    }

    // Check status
    if (authorization.status !== AuthorizationStatus.ACTIVE) {
      throw new ForbiddenException(`Authorization is ${authorization.status.toLowerCase()}`);
    }

    // Check expiration
    if (new Date() > authorization.expiresAt) {
      authorization.status = AuthorizationStatus.EXPIRED;
      await this.authorizationsRepository.save(authorization);
      throw new ForbiddenException('Authorization has expired');
    }

    // Check max uses
    if (authorization.usedCount >= authorization.maxUses) {
      authorization.status = AuthorizationStatus.USED;
      await this.authorizationsRepository.save(authorization);
      throw new ForbiddenException('Authorization has reached maximum uses');
    }

    // Check 2FA if required
    if (authorization.requires2FA && !authorization.twoFactorVerifiedAt) {
      throw new ForbiddenException('2FA verification required');
    }

    // Attach authorization to request for later use
    request.grant = authorization;

    return true;
  }
}
