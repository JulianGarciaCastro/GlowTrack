import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

export enum AuthorizationType {
  QR_CODE = 'QR_CODE',
  LINK = 'LINK',
}

export enum AuthorizationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

@Entity('authorizations')
export class Authorization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({
    type: 'enum',
    enum: AuthorizationType,
  })
  type: AuthorizationType;

  @Column({
    type: 'enum',
    enum: AuthorizationStatus,
    default: AuthorizationStatus.PENDING,
  })
  status: AuthorizationStatus;

  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'max_uses', default: 1 })
  maxUses: number;

  @Column({ name: 'used_count', default: 0 })
  usedCount: number;

  @Column({ name: 'professional_id', nullable: true })
  professionalId?: string;

  @Column({ name: 'center_id', nullable: true })
  centerId?: string;

  @Column({ name: 'requires_2fa', default: false })
  requires2FA: boolean;

  @Column({ name: 'two_factor_code', nullable: true })
  twoFactorCode?: string;

  @Column({ name: 'two_factor_verified_at', type: 'timestamp', nullable: true })
  twoFactorVerifiedAt?: Date;

  @Column({ type: 'jsonb' })
  permissions: {
    canCreateEntry: boolean;
    canViewHistory: boolean;
    canUploadPhotos: boolean;
    entryTypes: string[];
  };

  @Column({ name: 'used_at', type: 'timestamp', nullable: true })
  usedAt?: Date;

  @Column({ name: 'revoked_at', type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.authorizations)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
