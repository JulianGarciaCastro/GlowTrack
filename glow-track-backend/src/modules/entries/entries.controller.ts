import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GrantGuard } from '../../auth/guards/grant.guard';
import { GrantRequired } from '../../auth/decorators/grant-required.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Entries')
@Controller('entries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  @UseGuards(GrantGuard)
  @GrantRequired()
  @ApiOperation({ summary: 'Create new entry (requires grant)' })
  @ApiHeader({ name: 'X-Grant-Id', required: true })
  async create(
    @Body() createDto: CreateEntryDto,
    @Headers('x-grant-id') grantToken: string,
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.entriesService.create(createDto, grantToken, user.id, ipAddress, userAgent);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get entry by ID' })
  async findOne(@Param('id') id: string) {
    return this.entriesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update entry' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.entriesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete entry' })
  async delete(@Param('id') id: string) {
    await this.entriesService.delete(id);
    return { message: 'Entry deleted successfully' };
  }

  @Post(':id/medications')
  @ApiOperation({ summary: 'Add medication to entry' })
  async addMedication(@Param('id') id: string, @Body() medicationData: any) {
    return this.entriesService.addMedication(id, medicationData);
  }

  @Post(':id/devices')
  @ApiOperation({ summary: 'Add device to entry' })
  async addDevice(@Param('id') id: string, @Body() deviceData: any) {
    return this.entriesService.addDevice(id, deviceData);
  }
}
