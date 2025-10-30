import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';
import { EntryType } from '../../../database/entities/entry.entity';

export class CreateEntryDto {
  @ApiProperty({ enum: EntryType })
  @IsEnum(EntryType)
  type: EntryType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  scheduledDate: Date;

  @ApiProperty()
  @IsString()
  professionalId: string;

  @ApiProperty()
  @IsString()
  centerId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  followUpDate?: Date;
}
