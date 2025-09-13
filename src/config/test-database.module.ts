import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user';
import { Tutor } from '../tutor';
import { Booking } from '../booking';

export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [User, Tutor, Booking],
  synchronize: true,
  logging: false,
});
