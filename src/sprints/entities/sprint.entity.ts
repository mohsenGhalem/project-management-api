import { SprintStatus } from 'src/common/enums';
import { Project } from 'src/projects/entites/project.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';


@Entity('sprints')
export class Sprint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @ManyToOne(() => Project, (project) => project.sprints)
    project: Project;

    @Column({
        type: 'enum',
        enum: SprintStatus,
        default: SprintStatus.PLANNED,
    })
    status: SprintStatus;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column({ length: 500, nullable: true })
    goal: string;

    @Column({ type: 'int', array: true, default: [] })
    tasks: number[];

    @Column({ type: 'int' })
    @Check(`"capacity" >= 40 AND "capacity" <= 200`)
    capacity: number;

    @Column({ type: 'int' })
    @Check(`"committed" >= 0 AND "committed" <= 150`)
    committed: number;

    @Column({ type: 'int' })
    @Check(`"completed" >= 0 AND "completed" <= 150`)
    completed: number;

    @Column({ type: 'int', default: 0 })
    velocity: number;

    @Column({ type: 'json', nullable: true })
    burndownData: {
        date: Date;
        remaining: number;
        ideal: number;
    }[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}