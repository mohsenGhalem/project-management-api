import { Project } from 'src/projects/entites/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check } from 'typeorm';

@Entity('analytics')
export class Analytics {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    date: Date;

    @ManyToOne(() => Project, (project) => project.analytics)
    project: Project;

    @Column({ type: 'int', default: 0 })
    @Check(`"tasksCreated" >= 0 AND "tasksCreated" <= 100`)
    tasksCreated: number;

    @Column({ type: 'int', default: 0 })
    @Check(`"tasksCompleted" >= 0 AND "tasksCompleted" <= 100`)
    tasksCompleted: number;

    @Column({ type: 'int', default: 0 })
    @Check(`"hoursLogged" >= 0 AND "hoursLogged" <= 200`)
    hoursLogged: number;

    @Column({ type: 'int', default: 0 })
    @Check(`"teamProductivity" >= 0 AND "teamProductivity" <= 100`)
    teamProductivity: number;

    @Column({ type: 'int', default: 0 })
    @Check(`"burndownRemaining" >= 0 AND "bugCount" <= 100`)
    burndownRemaining: number;

    @Column({ type: 'int', default: 0 })
    velocity: number;

    @Column({ type: 'int', default: 0 })
    @Check(`"bugCount" >= 0 AND "bugCount" <= 50`)
    bugCount: number;

    @Column({ type: 'int', default: 0 })
    @Check(`"codeReviews" >= 0 AND "codeReviews" <= 20`)
    codeReviews: number;
}