import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { BookingModule } from '../booking/booking.module';
import { UserModule } from '../user/user.module';
import { TutorModule } from '../tutor/tutor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    BookingModule,
    UserModule,
    TutorModule,
  ],
})
export class TestAppModule {}
