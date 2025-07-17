import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

import { NotificationType, RelatedType, NotificationPriority } from '../../common/enums';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 255 })
  message: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @Column({ nullable: true })
  relatedId: number;

  @Column({
    type: 'enum',
    enum: RelatedType,
  })
  relatedType: RelatedType;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
  })
  priority: NotificationPriority;

  @CreateDateColumn()
  createdAt: Date;
}