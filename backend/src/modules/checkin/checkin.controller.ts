// Location: backend/src/modules/checkin/checkin.controller.ts
// Purpose: REST controller for QR-based venue check-in.
//   POST /api/checkin/scan         - Scan QR code and mark attendance
//   GET  /api/checkin/stats/:id    - Get check-in stats for an event

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constant';
import { successResponse } from '../../common/utils/response';

@Controller('checkin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ORGANIZER, Role.ADMIN)
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  /** POST /api/checkin/scan — scan a QR code payload */
  @Post('scan')
  async scan(@Body('qrData') qrData: string) {
    const result = await this.checkinService.processCheckin(qrData);
    const message = result.alreadyCheckedIn
      ? 'Already checked in'
      : 'Check-in successful ✅';
    return successResponse(result, message);
  }

  /** GET /api/checkin/stats/:eventId */
  @Get('stats/:eventId')
  async stats(@Param('eventId') eventId: string) {
    const stats = await this.checkinService.getCheckinStats(eventId);
    return successResponse(stats, 'Stats fetched');
  }
}