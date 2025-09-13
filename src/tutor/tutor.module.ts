import { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from './tutor.entity';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor])],
  providers: [TutorService],
  controllers: [TutorController],
})
export class TutorModule implements OnModuleInit {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepo: Repository<Tutor>,
  ) {}

  async onModuleInit() {
    const count = await this.tutorRepo.count();
    if (count === 0) {
      await this.tutorRepo.save([
        this.tutorRepo.create({ name: 'Math teacher' }),
        this.tutorRepo.create({ name: 'English teacher' }),
        this.tutorRepo.create({ name: 'Physics teacher' }),
      ]);
    }
  }
}
