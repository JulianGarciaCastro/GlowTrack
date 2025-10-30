import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Entry } from './entry.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entry_id' })
  entryId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  manufacturer: string;

  @Column()
  model: string;

  @Column({ name: 'serial_number', nullable: true })
  serialNumber?: string;

  @Column({ type: 'jsonb', nullable: true })
  settings?: {
    power?: string;
    frequency?: string;
    intensity?: string;
    temperature?: string;
    pulses?: number;
    [key: string]: any;
  };

  @Column({ name: 'operated_by' })
  operatedBy: string;

  @Column({ nullable: true })
  duration?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Entry, (entry) => entry.devices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entry_id' })
  entry: Entry;
}
