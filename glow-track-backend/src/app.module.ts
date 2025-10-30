import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

// Modules
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { ProfessionalsModule } from './modules/professionals/professionals.module';
import { CentersModule } from './modules/centers/centers.module';
import { EntriesModule } from './modules/entries/entries.module';
import { AuthorizationsModule } from './modules/authorizations/authorizations.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRoot(typeOrmConfig),

    // Feature modules
    AuthModule,
    PatientsModule,
    ProfessionalsModule,
    CentersModule,
    EntriesModule,
    AuthorizationsModule,
    AuditLogsModule,
  ],
})
export class AppModule {}
