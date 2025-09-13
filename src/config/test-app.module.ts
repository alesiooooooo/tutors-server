import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { BookingModule } from '../booking/booking.module';
import { TutorModule } from '../tutor/tutor.module';
import { AuthModule } from '../auth/auth.module';
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
