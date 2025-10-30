import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthorizationType } from '../../../database/entities/authorization.entity';
import { EntryType } from '../../../database/entities/entry.entity';

class AuthorizationPermissionsDto {
  @ApiProperty()
  @IsBoolean()
  canCreateEntry: boolean;

  @ApiProperty()
  @IsBoolean()
  canViewHistory: boolean;

  @ApiProperty()
  @IsBoolean()
  canUploadPhotos: boolean;

  @ApiProperty({ enum: EntryType, isArray: true })
  @IsEnum(EntryType, { each: true })
  entryTypes: EntryType[];
}

export class CreateAuthorizationDto {
  @ApiProperty({ enum: AuthorizationType })
  @IsEnum(AuthorizationType)
  type: AuthorizationType;

  @ApiProperty({ example: 24, description: 'Hours until expiration' })
  @IsNumber()
  expiresInHours: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  maxUses: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  professionalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  centerId?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  requires2FA: boolean;

  @ApiProperty({ type: AuthorizationPermissionsDto })
  @ValidateNested()
  @Type(() => AuthorizationPermissionsDto)
  permissions: AuthorizationPermissionsDto;
}
