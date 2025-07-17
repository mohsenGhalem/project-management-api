import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analytics } from './entities/analytics.entity';
import { Project } from 'src/projects/entites/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Analytics, Project])],
  providers: [],
  controllers: [],
  exports: [],
})
export class AnalyticsModule {}