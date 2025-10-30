import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../../database/entities/audit-log.entity';
import { UserRole } from '../../database/entities/user.entity';

export interface CreateAuditLogDto {
  action: AuditAction;
  userId: string;
  userRole: UserRole;
  targetUserId?: string;
  targetResourceId?: string;
  targetResourceType?: string;
  details?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  grantId?: string;
  success?: boolean;
  errorCode?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async log(data: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create({
      ...data,
      success: data.success !== undefined ? data.success : true,
    });

    return this.auditLogsRepository.save(auditLog);
  }

  async findAll(filters?: {
    userId?: string;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLog[]> {
    const query = this.auditLogsRepository.createQueryBuilder('audit_log');

    if (filters?.userId) {
      query.andWhere('audit_log.userId = :userId', { userId: filters.userId });
    }

    if (filters?.action) {
      query.andWhere('audit_log.action = :action', { action: filters.action });
    }

    if (filters?.startDate) {
      query.andWhere('audit_log.createdAt >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere('audit_log.createdAt <= :endDate', { endDate: filters.endDate });
    }

    query.orderBy('audit_log.createdAt', 'DESC');
    query.take(100); // Limit results

    return query.getMany();
  }
}
