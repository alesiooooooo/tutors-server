import { TypeOrmModule } from '@nestjs/typeorm';

export const TestDatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
});
