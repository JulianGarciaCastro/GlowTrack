import { Entity, Column, ChildEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Center } from './center.entity';
import { Entry } from './entry.entity';

@ChildEntity(UserRole.PROFESSIONAL)
export class Professional extends User {
  @Column()
  specialty: string;

  @Column({ name: 'license_number' })
  licenseNumber: string;

  @Column({ name: 'license_authority' })
  licenseAuthority: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture?: string;

  @Column({ name: 'center_id', nullable: true })
  centerId?: string;

  // Relations
  @ManyToOne(() => Center, (center) => center.professionals, { nullable: true })
  @JoinColumn({ name: 'center_id' })
  center?: Center;

  @OneToMany(() => Entry, (entry) => entry.professional)
  entries: Entry[];
}
