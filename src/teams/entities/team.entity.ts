import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from 'src/projects/entites/project.entity';
import { Department } from 'src/common/enums';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable({
    name: 'team_members',
    joinColumn: { name: 'teamId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  members: User[];

  @ManyToOne(() => User, (user) => user.leadTeams, { nullable: true })
  lead: User;

  @Column({
    type: 'enum',
    enum: Department,
    enumName: 'department_enum',
  })
  department: Department;

  @ManyToMany(() => Project, (project) => project.teams)
  @JoinTable({
    name: 'team_projects',
    joinColumn: { name: 'teamId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'projectId', referencedColumnName: 'id' },
  })
  projects: Project[];

  @Column({ type: 'int', nullable: true })
  budget: number;
  @Column({ type: 'int', default: 1 })
  @Check(`"headcount" > 0 AND "headcount" <= 100`)
  headcount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}