import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../../database/entities/professional.entity';
import { Entry } from '../../database/entities/entry.entity';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectRepository(Professional)
    private professionalsRepository: Repository<Professional>,
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
  ) {}

  async findOne(id: string): Promise<Professional> {
    const professional = await this.professionalsRepository.findOne({
      where: { id },
      relations: ['center'],
    });
    if (!professional) {
      throw new NotFoundException('Professional not found');
    }
    return professional;
  }

  async update(id: string, updateData: Partial<Professional>): Promise<Professional> {
    await this.professionalsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async getEntries(professionalId: string): Promise<Entry[]> {
    return this.entriesRepository.find({
      where: { professionalId },
      relations: ['patient', 'center', 'medications', 'devices'],
      order: { scheduledDate: 'DESC' },
    });
  }
}
