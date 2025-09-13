import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { TestDatabaseModule } from 'src/config/test-database.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestDatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should signup a new user', async () => {
    const uniqueEmail = `newuser-${Date.now()}@mail.com`;
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: uniqueEmail, password: '123456' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'User created successfully' });
  });

  it('should not signup a user with existing email', async () => {
    const uniqueEmail = `duplicate-${Date.now()}@mail.com`;

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: uniqueEmail, password: '123456' })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: uniqueEmail, password: '654321' })
      .expect(400);

    expect(res.body).toEqual({
      message: 'Email already taken',
      error: 'Bad Request',
      statusCode: 400,
    });
  });
});
