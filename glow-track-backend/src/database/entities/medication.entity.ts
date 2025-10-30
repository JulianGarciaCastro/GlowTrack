import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Entry } from './entry.entity';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'entry_id' })
  entryId: string;

  @Column()
  name: string;

  @Column({ name: 'active_ingredient', nullable: true })
  activeIngredient?: string;

  @Column({ name: 'brand_name', nullable: true })
  brandName?: string;

  @Column()
  dose: string;

  @Column()
  unit: string;

  @Column({ nullable: true })
  manufacturer?: string;

  @Column({ name: 'batch_number', nullable: true })
  batchNumber?: string;

  @Column({ name: 'expiration_date', type: 'date', nullable: true })
  expirationDate?: Date;

  @Column({ name: 'administration_route' })
  administrationRoute: string;

  @Column({ name: 'administered_by' })
  administeredBy: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Entry, (entry) => entry.medications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entry_id' })
  entry: Entry;
}
