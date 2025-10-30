import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'glowtrack_db',
  autoLoadEntities: true,
  synchronize: true, // Auto-create tables in development
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
};
