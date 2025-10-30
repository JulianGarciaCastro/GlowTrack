import { Entity, Column, ChildEntity, OneToMany } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Entry } from './entry.entity';
import { Authorization } from './authorization.entity';

@ChildEntity(UserRole.PATIENT)
export class Patient extends User {
  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'profile_picture', nullable: true })
  profilePicture?: string;

  // Relations
  @OneToMany(() => Entry, (entry) => entry.patient)
  entries: Entry[];

  @OneToMany(() => Authorization, (authorization) => authorization.patient)
  authorizations: Authorization[];
}
