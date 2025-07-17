import { IsString, IsOptional, IsInt, IsDateString, IsBoolean, MaxLength, Min, Max, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTimeEntryDto {
  @ApiProperty({ description: 'Task ID' })
  @IsInt()
  taskId: number;

  @ApiProperty({ description: 'User ID who logged the time' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'Work description', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ description: 'Hours worked', minimum: 1, maximum: 24 })
  @IsInt()
  @Min(1)
  @Max(24)
  hours: number;

  @ApiProperty({ description: 'Work date', example: '2025-01-15' })
  @IsDateString()
  date: Date;

  @ApiPropertyOptional({ description: 'Work start time in HH:mm format', example: '09:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format (24-hour)',
  })
  startTime?: string;

  @ApiPropertyOptional({ description: 'Work end time in HH:mm format', example: '17:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format (24-hour)',
  })
  endTime?: string;

  @ApiPropertyOptional({ description: 'Whether hours are billable', default: true })
  @IsOptional()
  @IsBoolean()
  billable?: boolean;
}