// Location: backend/src/modules/events/events.controller.ts
// Purpose: REST controller for event management.
//   GET    /api/events              - Public: list events (with filters)
//   GET    /api/events/my-events    - Organizer: own events
//   GET    /api/events/:id          - Public: single event
//   POST   /api/events              - Organizer: create event
//   PATCH  /api/events/:id          - Organizer: update event
//   DELETE /api/events/:id          - Organizer/Admin: delete event

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constant';
import { successResponse } from '../../common/utils/response';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /** Public: Browse all events */
  @Get()
  async findAll(@Query() query: any) {
    const data = await this.eventsService.findAll(query);
    return successResponse(data, 'Events fetched');
  }

  /** Organizer: Get own events (must be before :id to avoid conflict) */
  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  async myEvents(@Request() req) {
    const events = await this.eventsService.myEvents(req.user._id);
    return successResponse(events, 'Your events fetched');
  }

  /** Public: Single event */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    return successResponse(event, 'Event fetched');
  }

  /** Organizer/Admin: Create event */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async create(@Body() dto: CreateEventDto, @Request() req) {
    const event = await this.eventsService.create(dto, req.user._id);
    return successResponse(event, 'Event created successfully');
  }

  /** Organizer/Admin: Update event */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Request() req,
  ) {
    const event = await this.eventsService.update(
      id,
      dto,
      req.user._id,
      req.user.role,
    );
    return successResponse(event, 'Event updated successfully');
  }

  /** Organizer/Admin: Delete event */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.eventsService.remove(
      id,
      req.user._id,
      req.user.role,
    );
    return successResponse(result, 'Event deleted');
  }
}