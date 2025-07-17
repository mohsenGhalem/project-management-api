import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Media } from './entites/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, User])],
  providers: [],
  controllers: [],
  exports: [],
})
export class MediaModule {}