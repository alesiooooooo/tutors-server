import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from './tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor])],
  providers: [TutorService],
  controllers: [TutorController],
})
export class TutorModule {}
