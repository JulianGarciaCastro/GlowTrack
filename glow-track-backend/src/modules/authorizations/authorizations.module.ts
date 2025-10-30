import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authorization } from '../../database/entities/authorization.entity';
import { Patient } from '../../database/entities/patient.entity';
import { AuthorizationsService } from './authorizations.service';
import { AuthorizationsController } from './authorizations.controller';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Authorization, Patient]),
    AuditLogsModule,
  ],
  providers: [AuthorizationsService],
  controllers: [AuthorizationsController],
  exports: [AuthorizationsService],
})
export class AuthorizationsModule {}
