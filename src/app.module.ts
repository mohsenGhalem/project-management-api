import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { CommentsModule } from './comments/comments.module';
import { SprintsModule } from './sprints/sprints.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MediaModule } from './media/media.module';
import { ProjectTemplatesModule } from './project-templates/project-templates.module';
import { ActivitiesModule } from './activities/activities.module';
import { TimeEntriesModule } from './time-entries/times-entries.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ProjectsModule,
    TasksModule,
    UsersModule,
    TeamsModule,
    CommentsModule,
    TimeEntriesModule,
    SprintsModule,
    AnalyticsModule,
    NotificationsModule,
    MediaModule,
    ProjectTemplatesModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

  ],
})
export class AppModule {}