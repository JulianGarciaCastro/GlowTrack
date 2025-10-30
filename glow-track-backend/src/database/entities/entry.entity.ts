import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Professional } from './professional.entity';
import { Center } from './center.entity';
import { Medication } from './medication.entity';
import { Device } from './device.entity';

export enum EntryType {
  TREATMENT = 'TREATMENT',
  INTERVENTION = 'INTERVENTION',
  SURGERY = 'SURGERY',
}

export enum EntryStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
}

@Entity('entries')
export class Entry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'patient_id' })
  patientId: string;

  @Column({
    type: 'enum',
    enum: EntryType,
  })
  type: EntryType;

  @Column({
    type: 'enum',
    enum: EntryStatus,
    default: EntryStatus.SCHEDULED,
  })
  status: EntryStatus;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'scheduled_date', type: 'timestamp' })
  scheduledDate: Date;

  @Column({ name: 'completed_date', type: 'timestamp', nullable: true })
  completedDate?: Date;

  @Column({ nullable: true })
  duration?: number;

  @Column({ name: 'professional_id' })
  professionalId: string;

  @Column({ name: 'center_id' })
  centerId: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'follow_up_date', type: 'timestamp', nullable: true })
  followUpDate?: Date;

  @Column({ name: 'before_photos', type: 'json', nullable: true })
  beforePhotos?: string[];

  @Column({ name: 'after_photos', type: 'json', nullable: true })
  afterPhotos?: string[];

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.entries)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Professional, (professional) => professional.entries)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @ManyToOne(() => Center, (center) => center.entries)
  @JoinColumn({ name: 'center_id' })
  center: Center;

  @OneToMany(() => Medication, (medication) => medication.entry, { cascade: true })
  medications: Medication[];

  @OneToMany(() => Device, (device) => device.entry, { cascade: true })
  devices: Device[];
}
