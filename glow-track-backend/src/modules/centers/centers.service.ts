import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Center } from '../../database/entities/center.entity';

@Injectable()
export class CentersService {
  constructor(
    @InjectRepository(Center)
    private centersRepository: Repository<Center>,
  ) {}

  async create(createData: Partial<Center>): Promise<Center> {
    const center = this.centersRepository.create(createData);
    return this.centersRepository.save(center);
  }

  async findOne(id: string): Promise<Center> {
    const center = await this.centersRepository.findOne({ where: { id } });
    if (!center) {
      throw new NotFoundException('Center not found');
    }
    return center;
  }

  async update(id: string, updateData: Partial<Center>): Promise<Center> {
    await this.centersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async findAll(): Promise<Center[]> {
    return this.centersRepository.find();
  }
}
