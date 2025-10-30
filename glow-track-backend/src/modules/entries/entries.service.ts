import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry, EntryStatus } from '../../database/entities/entry.entity';
import { Medication } from '../../database/entities/medication.entity';
import { Device } from '../../database/entities/device.entity';
import { Authorization } from '../../database/entities/authorization.entity';
import { CreateEntryDto } from './dto/create-entry.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuthorizationsService } from '../authorizations/authorizations.service';
import { AuditAction } from '../../database/entities/audit-log.entity';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private entriesRepository: Repository<Entry>,
    @InjectRepository(Medication)
    private medicationsRepository: Repository<Medication>,
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    @InjectRepository(Authorization)
    private authorizationsRepository: Repository<Authorization>,
    private auditLogsService: AuditLogsService,
    private authorizationsService: AuthorizationsService,
  ) {}

  async create(
    createDto: CreateEntryDto,
    grantToken: string,
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<Entry> {
    // Find and validate authorization
    const authorization = await this.authorizationsRepository.findOne({
      where: { token: grantToken },
    });

    if (!authorization) {
      throw new ForbiddenException('Invalid authorization token');
    }

    // Check permissions
    if (!authorization.permissions.canCreateEntry) {
      throw new ForbiddenException('Authorization does not allow creating entries');
    }

    if (!authorization.permissions.entryTypes.includes(createDto.type)) {
      throw new ForbiddenException(`Authorization does not allow creating ${createDto.type} entries`);
    }

    // Create entry
    const entry = this.entriesRepository.create({
      ...createDto,
      patientId: authorization.patientId,
      status: EntryStatus.SCHEDULED,
      createdBy: userId,
    });

    const saved = await this.entriesRepository.save(entry);

    // Use the authorization
    await this.authorizationsService.use(grantToken);

    // Audit log
    await this.auditLogsService.log({
      action: AuditAction.ENTRY_CREATED,
      userId,
      userRole: 'PROFESSIONAL' as any,
      targetUserId: authorization.patientId,
      targetResourceId: saved.id,
      targetResourceType: 'Entry',
      grantId: authorization.id,
      ipAddress,
      userAgent,
      details: {
        type: saved.type,
        title: saved.title,
      },
    });

    return saved;
  }

  async findOne(id: string): Promise<Entry> {
    const entry = await this.entriesRepository.findOne({
      where: { id },
      relations: ['patient', 'professional', 'center', 'medications', 'devices'],
    });

    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    return entry;
  }

  async update(id: string, updateData: Partial<Entry>): Promise<Entry> {
    await this.entriesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.entriesRepository.delete(id);
  }

  async addMedication(entryId: string, medicationData: Partial<Medication>): Promise<Medication> {
    const entry = await this.entriesRepository.findOne({ where: { id: entryId } });
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    const medication = this.medicationsRepository.create({
      ...medicationData,
      entryId,
    });

    return this.medicationsRepository.save(medication);
  }

  async addDevice(entryId: string, deviceData: Partial<Device>): Promise<Device> {
    const entry = await this.entriesRepository.findOne({ where: { id: entryId } });
    if (!entry) {
      throw new NotFoundException('Entry not found');
    }

    const device = this.devicesRepository.create({
      ...deviceData,
      entryId,
    });

    return this.devicesRepository.save(device);
  }
}
