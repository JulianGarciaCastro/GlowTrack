import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import {
  Authorization,
  AuthorizationType,
  AuthorizationStatus,
} from '../../database/entities/authorization.entity';
import { Patient } from '../../database/entities/patient.entity';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { ValidateAuthorizationDto } from './dto/validate-authorization.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../../database/entities/audit-log.entity';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class AuthorizationsService {
  constructor(
    @InjectRepository(Authorization)
    private authorizationsRepository: Repository<Authorization>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(
    patientId: string,
    createAuthorizationDto: CreateAuthorizationDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<Authorization> {
    const patient = await this.patientsRepository.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Generate unique token
    const prefix = process.env.GRANT_TOKEN_PREFIX || 'glowtrack_grant_';
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const token = `${prefix}${randomBytes}`;

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + createAuthorizationDto.expiresInHours);

    // Generate 2FA code if required
    let twoFactorCode: string | undefined;
    if (createAuthorizationDto.requires2FA) {
      twoFactorCode = this.generateTwoFactorCode();
    }

    const authorization = this.authorizationsRepository.create({
      patientId,
      type: createAuthorizationDto.type,
      status: AuthorizationStatus.ACTIVE,
      token,
      expiresAt,
      maxUses: createAuthorizationDto.maxUses,
      usedCount: 0,
      professionalId: createAuthorizationDto.professionalId,
      centerId: createAuthorizationDto.centerId,
      requires2FA: createAuthorizationDto.requires2FA || false,
      twoFactorCode,
      permissions: createAuthorizationDto.permissions,
    });

    const saved = await this.authorizationsRepository.save(authorization);

    // Audit log
    await this.auditLogsService.log({
      action: AuditAction.AUTHORIZATION_CREATED,
      userId: patientId,
      userRole: UserRole.PATIENT,
      targetResourceId: saved.id,
      targetResourceType: 'Authorization',
      ipAddress,
      userAgent,
      details: {
        type: saved.type,
        expiresAt: saved.expiresAt,
        requires2FA: saved.requires2FA,
      },
    });

    return saved;
  }

  async findAllByPatient(patientId: string): Promise<Authorization[]> {
    return this.authorizationsRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async validate(
    validateDto: ValidateAuthorizationDto,
    ipAddress: string,
    userAgent: string,
  ): Promise<{ valid: boolean; authorization?: Authorization; patient?: Patient }> {
    const authorization = await this.authorizationsRepository.findOne({
      where: { token: validateDto.token },
      relations: ['patient'],
    });

    if (!authorization) {
      await this.auditLogsService.log({
        action: AuditAction.INVALID_TOKEN,
        userId: 'unknown',
        userRole: UserRole.PROFESSIONAL,
        ipAddress,
        userAgent,
        success: false,
        errorCode: 'AUTHORIZATION_NOT_FOUND',
      });

      return { valid: false };
    }

    // Check status
    if (authorization.status !== AuthorizationStatus.ACTIVE) {
      return { valid: false };
    }

    // Check expiration
    if (new Date() > authorization.expiresAt) {
      authorization.status = AuthorizationStatus.EXPIRED;
      await this.authorizationsRepository.save(authorization);
      return { valid: false };
    }

    // Check max uses
    if (authorization.usedCount >= authorization.maxUses) {
      authorization.status = AuthorizationStatus.USED;
      await this.authorizationsRepository.save(authorization);
      return { valid: false };
    }

    // Check 2FA if required
    if (authorization.requires2FA) {
      if (!validateDto.twoFactorCode) {
        return {
          valid: false,
          authorization: {
            ...authorization,
            twoFactorCode: undefined, // Don't expose the code
          } as Authorization,
        };
      }

      if (validateDto.twoFactorCode !== authorization.twoFactorCode) {
        await this.auditLogsService.log({
          action: AuditAction.TWO_FACTOR_FAILED,
          userId: authorization.patientId,
          userRole: UserRole.PATIENT,
          targetResourceId: authorization.id,
          ipAddress,
          userAgent,
          success: false,
          errorCode: 'INVALID_2FA_CODE',
        });

        return { valid: false };
      }

      // Mark 2FA as verified
      authorization.twoFactorVerifiedAt = new Date();
      await this.authorizationsRepository.save(authorization);
    }

    // Audit successful validation
    await this.auditLogsService.log({
      action: AuditAction.AUTHORIZATION_USED,
      userId: authorization.patientId,
      userRole: UserRole.PATIENT,
      targetResourceId: authorization.id,
      targetResourceType: 'Authorization',
      grantId: authorization.id,
      ipAddress,
      userAgent,
    });

    return {
      valid: true,
      authorization,
      patient: authorization.patient,
    };
  }

  async use(token: string): Promise<void> {
    const authorization = await this.authorizationsRepository.findOne({
      where: { token },
    });

    if (!authorization) {
      throw new NotFoundException('Authorization not found');
    }

    if (authorization.status !== AuthorizationStatus.ACTIVE) {
      throw new ForbiddenException('Authorization is not active');
    }

    // Increment used count
    authorization.usedCount += 1;
    authorization.usedAt = new Date();

    // Mark as used if reached max uses
    if (authorization.usedCount >= authorization.maxUses) {
      authorization.status = AuthorizationStatus.USED;
    }

    await this.authorizationsRepository.save(authorization);
  }

  async revoke(
    authorizationId: string,
    patientId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<Authorization> {
    const authorization = await this.authorizationsRepository.findOne({
      where: { id: authorizationId, patientId },
    });

    if (!authorization) {
      throw new NotFoundException('Authorization not found');
    }

    authorization.status = AuthorizationStatus.REVOKED;
    authorization.revokedAt = new Date();

    const revoked = await this.authorizationsRepository.save(authorization);

    // Audit log
    await this.auditLogsService.log({
      action: AuditAction.AUTHORIZATION_REVOKED,
      userId: patientId,
      userRole: UserRole.PATIENT,
      targetResourceId: authorizationId,
      targetResourceType: 'Authorization',
      ipAddress,
      userAgent,
    });

    return revoked;
  }

  private generateTwoFactorCode(): string {
    const length = parseInt(process.env.TWO_FACTOR_CODE_LENGTH || '6');
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }
}
