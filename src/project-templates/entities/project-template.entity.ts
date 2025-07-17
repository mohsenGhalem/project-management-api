import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TemplateCategory, TemplateComplexity } from 'src/common/enums';



@Entity('project_templates')
export class ProjectTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TemplateCategory,
  })
  category: TemplateCategory;

  @Column({ type: 'json', nullable: true })
  tasks: {
    title: string;
    description: string;
    estimatedHours: number;
    priority: string;
    tags: string[];
  }[];

  @Column({ type: 'int'})
  @Check('duration > 0 AND duration <= 365')
  duration: number;

  @Column({
    type: 'enum',
    enum: TemplateComplexity,
  })
  complexity: TemplateComplexity;

  @Column({ type: 'int', default: 0})
  usageCount: number;

  @ManyToOne(() => User)
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}