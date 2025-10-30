import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProfessionalsService } from './professionals.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Professionals')
@Controller('professionals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get professional by ID' })
  async findOne(@Param('id') id: string) {
    return this.professionalsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update professional profile' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.professionalsService.update(id, updateData);
  }

  @Get(':id/entries')
  @ApiOperation({ summary: 'Get professional entries' })
  async getEntries(@Param('id') id: string) {
    return this.professionalsService.getEntries(id);
  }
}
