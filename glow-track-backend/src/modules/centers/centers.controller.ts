import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CentersService } from './centers.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Centers')
@Controller('centers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new center' })
  async create(@Body() createData: any) {
    return this.centersService.create(createData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all centers' })
  async findAll() {
    return this.centersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get center by ID' })
  async findOne(@Param('id') id: string) {
    return this.centersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update center' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.centersService.update(id, updateData);
  }
}
