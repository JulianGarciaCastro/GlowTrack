import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from '../../database/entities/entry.entity';
import { Medication } from '../../database/entities/medication.entity';
import { Device } from '../../database/entities/device.entity';
import { Authorization } from '../../database/entities/authorization.entity';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { AuthorizationsModule } from '../authorizations/authorizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry, Medication, Device, Authorization]),
    AuditLogsModule,
    AuthorizationsModule,
  ],
  providers: [EntriesService],
  controllers: [EntriesController],
  exports: [EntriesService],
})
export class EntriesModule {}
