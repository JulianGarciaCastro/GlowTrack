import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professional } from '../../database/entities/professional.entity';
import { Entry } from '../../database/entities/entry.entity';
import { ProfessionalsService } from './professionals.service';
import { ProfessionalsController } from './professionals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Professional, Entry])],
  providers: [ProfessionalsService],
  controllers: [ProfessionalsController],
  exports: [ProfessionalsService],
})
export class ProfessionalsModule {}
