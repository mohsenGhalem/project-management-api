// src/auth/dto/register.dto.ts
import { IsString, IsEmail, IsEnum, IsOptional, IsArray, IsInt, IsDateString, MaxLength, Min, Max, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department, UserRole } from '../../common/enums';

export class RegisterDto {
  @ApiProperty({ description: 'User full name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  password: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'Department', enum: Department })
  @IsEnum(Department)
  department: Department;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User timezone', default: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Working hours',
    type: 'object',
    additionalProperties: false,
    properties: {
      start: { type: 'string' },
      end: { type: 'string' }
    }
  })
  @IsOptional()
  workingHours?: {
    start: string;
    end: string;
  };

  @ApiPropertyOptional({ description: 'User skills/technologies', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiPropertyOptional({ description: 'Current workload hours', minimum: 0, maximum: 60 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  workload?: number;

  @ApiPropertyOptional({ description: 'Weekly capacity hours', minimum: 10, maximum: 60 })
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(60)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Employment start date' })
  @IsOptional()
  @IsDateString()
  joinDate?: Date;

  @ApiPropertyOptional({ description: 'User biography', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}



