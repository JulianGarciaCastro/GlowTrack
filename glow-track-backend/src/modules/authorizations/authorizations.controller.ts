import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthorizationsService } from './authorizations.service';
import { CreateAuthorizationDto } from './dto/create-authorization.dto';
import { ValidateAuthorizationDto } from './dto/validate-authorization.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('Authorizations')
@Controller('authorizations')
export class AuthorizationsController {
  constructor(private readonly authorizationsService: AuthorizationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('patients/:patientId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create new authorization for patient' })
  @ApiResponse({ status: 201, description: 'Authorization created' })
  async create(
    @Param('patientId') patientId: string,
    @Body() createAuthorizationDto: CreateAuthorizationDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authorizationsService.create(
      patientId,
      createAuthorizationDto,
      ipAddress,
      userAgent,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('patients/:patientId')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all authorizations for patient' })
  async findAllByPatient(@Param('patientId') patientId: string) {
    return this.authorizationsService.findAllByPatient(patientId);
  }

  @Public()
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate authorization token' })
  @ApiResponse({ status: 200, description: 'Validation result' })
  async validate(@Body() validateDto: ValidateAuthorizationDto, @Req() req: Request) {
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authorizationsService.validate(validateDto, ipAddress, userAgent);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Revoke authorization' })
  @ApiResponse({ status: 200, description: 'Authorization revoked' })
  async revoke(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authorizationsService.revoke(id, user.id, ipAddress, userAgent);
  }
}
