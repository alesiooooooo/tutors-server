import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Tutor } from 'src/tutor/tutor.entity';
import { Booking } from 'src/booking/booking.entity';

export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [User, Tutor, Booking],
  synchronize: true,
  logging: false,
});
