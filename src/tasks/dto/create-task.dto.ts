import { IsString, IsOptional, IsEnum, IsInt, IsDateString, IsArray, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from 'src/common/enums';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Task description', maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus, default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Task priority', enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Assignee user ID' })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiProperty({ description: 'Reporter user ID' })
  @IsString()
  reporterId: string;

  @ApiProperty({ description: 'Project ID' })
  @IsInt()
  projectId: number;

  @ApiPropertyOptional({ description: 'Parent task ID for subtasks' })
  @IsOptional()
  @IsInt()
  parentTaskId?: number;

  @ApiPropertyOptional({ description: 'Task due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'Estimated work hours', minimum: 1, maximum: 200 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  estimatedHours?: number;

  @ApiPropertyOptional({ description: 'Task tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Dependent task IDs', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  dependencies?: number[];

  @ApiPropertyOptional({ description: 'Story points' })
  @IsOptional()
  @IsInt()
  storyPoints?: number;

  @ApiPropertyOptional({ description: 'File attachments' })
  @IsOptional()
  attachments?: {
    id: number;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Date;
  }[];
}
