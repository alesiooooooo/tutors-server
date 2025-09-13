import { Module } from '@nestjs/common';
import { AppController, AppService } from '../';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user';
import { BookingModule } from '../booking';
import { TutorModule } from '../tutor';
import { AuthModule } from '../auth';
import { TestDatabaseModule } from './test-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TestDatabaseModule,
    UserModule,
    BookingModule,
    TutorModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule {}
