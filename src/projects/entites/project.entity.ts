import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Team } from '../../teams/entities/team.entity';
import { Sprint } from '../../sprints/entities/sprint.entity';
import { Analytics } from '../../analytics/entities/analytics.entity';

import { ProjectStatus, ProjectPriority } from '../../common/enums';


@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 2000, nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @Column({
    type: 'enum',
    enum: ProjectPriority,
    default: ProjectPriority.MEDIUM,
  })
  priority: ProjectPriority;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'int', default: 0})
  @Check(`"progress" >= 0 AND "progress" <= 100`)
  progress: number;

  @Column({ type: 'int', nullable: true })
  budget: number;

  @Column({ type: 'int', default: 0 })
  spent: number;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  milestones: {
    id: number;
    name: string;
    date: Date;
    completed: boolean;
    description: string;
  }[];

  @ManyToOne(() => User, (user) => user.ownedProjects)
  owner: User;

  @ManyToMany(() => User, (user) => user.projects)
  @JoinTable({
    name: 'project_team_members',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  team: User[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @ManyToMany(() => Team, (team) => team.projects)
  teams: Team[];

  @OneToMany(() => Sprint, (sprint) => sprint.project)
  sprints: Sprint[];

  @OneToMany(() => Analytics, (analytics) => analytics.project)
  analytics: Analytics[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}