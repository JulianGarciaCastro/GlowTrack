import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../database/entities/patient.entity';
import { Entry, EntryType, EntryStatus } from '../../database/entities/entry.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
  ) {}

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, updateData: Partial<Patient>): Promise<Patient> {
    await this.patientsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async getEntries(
    patientId: string,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      type?: EntryType;
      status?: EntryStatus;
    },
  ): Promise<Entry[]> {
    const query = this.entriesRepository
      .createQueryBuilder('entry')
      .where('entry.patientId = :patientId', { patientId })
      .leftJoinAndSelect('entry.professional', 'professional')
      .leftJoinAndSelect('entry.center', 'center')
      .leftJoinAndSelect('entry.medications', 'medications')
      .leftJoinAndSelect('entry.devices', 'devices');

    if (filters?.startDate) {
      query.andWhere('entry.scheduledDate >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('entry.scheduledDate <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters?.type) {
      query.andWhere('entry.type = :type', { type: filters.type });
    }

    if (filters?.status) {
      query.andWhere('entry.status = :status', { status: filters.status });
    }

    query.orderBy('entry.scheduledDate', 'DESC');

    return query.getMany();
  }
}
