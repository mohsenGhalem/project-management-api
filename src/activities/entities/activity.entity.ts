import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityType, EntityType } from 'src/common/enums';



@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ActivityType,
  })
  type: ActivityType;

  @Column({ length: 50 })
  action: string;

  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entity: EntityType;

  @Column()
  entityId: number;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @Column({ length: 100 })
  userName: string;

  @Column({ nullable: true })
  userAvatar: string;

  @Column({ nullable: true })
  projectId: number;

  @Column({ length: 255 })
  description: string;

  @Column({ type: 'json', nullable: true })
  metadata: {
    oldValue?: string;
    newValue?: string;
    field?: string;
  };

  @CreateDateColumn()
  timestamp: Date;
}