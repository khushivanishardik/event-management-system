// Location: backend/src/modules/events/dto/update-event.dto.ts
// Purpose: Partial version of CreateEventDto for PATCH /api/events/:id.
//          All fields are optional; only provided fields are updated.

import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from '../schemas/event.schema';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}