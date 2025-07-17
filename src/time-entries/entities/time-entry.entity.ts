import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Check } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('time_entries')
export class TimeEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Task, (task) => task.timeEntries)
  task: Task;

  @ManyToOne(() => User, (user) => user.timeEntries)
  user: User;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ type: 'int'})
  @Check(`"hours" > 0 AND "hours" <= 24`)
  hours: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string;

  @Column({ type: 'time', nullable: true })
  endTime: string;

  @Column({ default: true })
  billable: boolean;

  @CreateDateColumn()
  createdAt: Date;
}