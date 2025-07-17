import { IsString, IsOptional, IsInt, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Comment content', maxLength: 2000 })
  @IsString()
  @MaxLength(2000)
  content: string;

  @ApiProperty({ description: 'Author user ID' })
  @IsString()
  authorId: string;

  @ApiProperty({ description: 'Task ID this comment belongs to' })
  @IsInt()
  taskId: number;

  @ApiPropertyOptional({ description: 'Parent comment ID for replies' })
  @IsOptional()
  @IsInt()
  parentCommentId?: number;

  @ApiPropertyOptional({ description: 'Mentioned user names', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];

  @ApiPropertyOptional({
    description: 'Comment reactions',
    type: 'object',
    additionalProperties: true
  })
  @IsOptional()
  reactions?: Record<string, string[]>;
}