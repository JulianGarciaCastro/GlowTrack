import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'glowtrack',
  password: process.env.DB_PASSWORD || 'glowtrack_password',
  database: process.env.DB_DATABASE || 'glowtrack_db',
  autoLoadEntities: true,
  synchronize: true, // Auto-create tables in development
  logging: process.env.NODE_ENV === 'development',
};
