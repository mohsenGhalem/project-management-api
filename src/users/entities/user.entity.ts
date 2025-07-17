import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Team } from '../../teams/entities/team.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { TimeEntry } from '../../time-entries/entities/time-entry.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Activity } from '../../activities/entities/activity.entity';
import { Project } from 'src/projects/entites/project.entity';
import { Media } from 'src/media/entites/media.entity';
import { UserRole, Department } from '../../common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ default: 'America/New_York' })
  timezone: string;

  @Column({ type: 'json', nullable: true })
  workingHours: {
    start: string;
    end: string;
  };

  @Column({ type: 'text', array: true, default: [] })
  skills: string[];

  @Column({ type: 'int', array: true, default: [] })
  currentTasks: number[];

  @Column({ type: 'int', default: 0, name: 'workload' })
  workload: number;

  @Column({ type: 'int', default: 40 })
  capacity: number;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: Department,
  })
  department: Department;

  @Column({ type: 'date', nullable: true })
  joinDate: Date;

  @Column({ nullable: true, length: 500 })
  bio: string;

  @OneToMany(() => Project, (project) => project.owner)
  ownedProjects: Project[];

  @ManyToMany(() => Project, (project) => project.team)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks: Task[];

  @OneToMany(() => Task, (task) => task.reporter)
  reportedTasks: Task[];

  @ManyToMany(() => Team, (team) => team.members)
  teams: Team[];

  @OneToMany(() => Team, (team) => team.lead)
  leadTeams: Team[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.user)
  timeEntries: TimeEntry[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Media, (media) => media.uploadedBy)
  uploadedMedia: Media[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}