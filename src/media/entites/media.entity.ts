import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Check } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MediaType } from 'src/common/enums';


@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: MediaType,
  })
  type: MediaType;

  @Column()
  mimeType: string;

  @Column({ type: 'int' })
  @Check('size > 0')
  size: number;

  @ManyToOne(() => User, (user) => user.uploadedMedia)
  uploadedBy: User;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];
  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  alt: string;
}