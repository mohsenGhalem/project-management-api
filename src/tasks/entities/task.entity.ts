import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { TimeEntry } from '../../time-entries/entities/time-entry.entity';
import { Project } from 'src/projects/entites/project.entity';

import { TaskStatus, TaskPriority } from '../../common/enums';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 2000, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignee: User;

  @ManyToOne(() => User, (user) => user.reportedTasks)
  reporter: User;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true })
  parentTask: Task;

  @OneToMany(() => Task, (task) => task.parentTask)
  subtasks: Task[];

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'int', nullable: true})
  @Check(`"estimatedHours" > 0 AND "estimatedHours" <= 200`)
  estimatedHours: number;

  @Column({ type: 'int', default: 0})
  @Check(`"loggedHours" >= 0 AND "loggedHours" <= 500`)
  loggedHours: number;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'int', array: true, default: [] })
  dependencies: number[];

  @Column({ type: 'int', nullable: true })
  storyPoints: number;

  @Column({ type: 'json', nullable: true })
  attachments: {
    id: number;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.task)
  timeEntries: TimeEntry[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}