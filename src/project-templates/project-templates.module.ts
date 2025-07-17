import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTemplate } from './entities/project-template.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTemplate, User])],
  providers: [],
  controllers: [],
  exports: [],
})
export class ProjectTemplatesModule {}
