// Location: backend/src/modules/events/dto/create-event.dto.ts
// Purpose: Validates the request body for POST /api/events.
//          Ensures required fields are present and properly typed.

import {
  IsString,
  IsDateString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory } from '../schemas/event.schema';

export class CreateEventDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(20, { message: 'Description must be at least 20 characters' })
  description: string;

  @IsDateString()
  date: string;

  @IsDateString()
  endDate: string;

  @IsString()
  venue: string;

  @IsString()
  city: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be negative' })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(1, { message: 'Capacity must be at least 1' })
  @Type(() => Number)
  totalCapacity: number;

  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  bannerImage?: string;
}