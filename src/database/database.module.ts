import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Team } from '../teams/entities/team.entity';
import { Comment } from '../comments/entities/comment.entity';
import { TimeEntry } from '../time-entries/entities/time-entry.entity';
import { Sprint } from '../sprints/entities/sprint.entity';
import { Analytics } from '../analytics/entities/analytics.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { ProjectTemplate } from '../project-templates/entities/project-template.entity';
import { Activity } from '../activities/entities/activity.entity';
import { Project } from 'src/projects/entites/project.entity';
import { Media } from 'src/media/entites/media.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') ?? '5432', 10),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          Project,
          Task,
          User,
          Team,
          Comment,
          TimeEntry,
          Sprint,
          Analytics,
          Notification,
          Media,
          ProjectTemplate,
          Activity,
        ],
        synchronize: true,
        logging:false,
        ssl: true,
      }),
    }),
  ],
})
export class DatabaseModule {}