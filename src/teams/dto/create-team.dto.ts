import { IsString, IsOptional, IsEnum, IsArray, IsInt, MaxLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department } from 'src/common/enums';

export class CreateTeamDto {
  @ApiProperty({ description: 'Team name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Team description', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'Team member user IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  memberIds?: string[];

  @ApiPropertyOptional({ description: 'Team lead user ID' })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiProperty({ description: 'Department', enum: Department })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({ description: 'Project IDs assigned to team', type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  projectIds?: number[];

  @ApiPropertyOptional({ description: 'Team budget' })
  @IsOptional()
  @IsInt()
  budget?: number;

  @ApiPropertyOptional({ description: 'Number of team members', minimum: 1, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  headcount?: number;
}