import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { Project } from 'src/projects/entites/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, Project])],
  providers: [],
  controllers: [],
  exports: [],
})
export class SprintsModule {}