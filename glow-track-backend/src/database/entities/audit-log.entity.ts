import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from './user.entity';

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',

  // Authorizations
  AUTHORIZATION_CREATED = 'AUTHORIZATION_CREATED',
  AUTHORIZATION_USED = 'AUTHORIZATION_USED',
  AUTHORIZATION_REVOKED = 'AUTHORIZATION_REVOKED',
  AUTHORIZATION_EXPIRED = 'AUTHORIZATION_EXPIRED',

  // Entries
  ENTRY_CREATED = 'ENTRY_CREATED',
  ENTRY_UPDATED = 'ENTRY_UPDATED',
  ENTRY_DELETED = 'ENTRY_DELETED',
  ENTRY_VIEWED = 'ENTRY_VIEWED',

  // Sensitive data
  PHOTO_UPLOADED = 'PHOTO_UPLOADED',
  PHOTO_VIEWED = 'PHOTO_VIEWED',
  HISTORY_EXPORTED = 'HISTORY_EXPORTED',

  // Security
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TWO_FACTOR_FAILED = 'TWO_FACTOR_FAILED',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  userRole: UserRole;

  @Column({ name: 'target_user_id', nullable: true })
  targetUserId?: string;

  @Column({ name: 'target_resource_id', nullable: true })
  targetResourceId?: string;

  @Column({ name: 'target_resource_type', nullable: true })
  targetResourceType?: string;

  @Column({ type: 'json', nullable: true })
  details?: Record<string, any>;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ name: 'grant_id', nullable: true })
  grantId?: string;

  @Column({ default: true })
  success: boolean;

  @Column({ name: 'error_code', nullable: true })
  errorCode?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
