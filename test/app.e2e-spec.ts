import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestAppModule } from 'src/config/test-app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
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

  it('should login with valid credentials', async () => {
    const uniqueEmail = `login-${Date.now()}@mail.com`;
    const password = '123456';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: uniqueEmail, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: uniqueEmail, password })
      .expect(201);

    expect(res.body).toHaveProperty('access_token');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(typeof res.body.access_token).toBe('string');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'nonexistent@mail.com', password: '123456' })
      .expect(401);

    expect(res.body).toEqual({
      message: 'Invalid credentials',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });
});
