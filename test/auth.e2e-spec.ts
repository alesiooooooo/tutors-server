import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestAppModule } from '../src/config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should signup a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@mail.com', password: '123456' })
        .expect(201);

      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user).toHaveProperty('email', 'test@mail.com');
    });

    it('should not signup user with existing email', async () => {
      // First signup
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@mail.com', password: '123456' })
        .expect(201);

      // Try to signup with same email
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@mail.com', password: '123456' })
        .expect(400);

      expect(res.body.message).toBe('Email already taken');
    });

    it('should not signup user with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'invalid-email', password: '123456' })
        .expect(400);
    });

    it('should not signup user with short password', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@mail.com', password: '123' })
        .expect(400);
    });

    it('should login existing user', async () => {
      // First signup
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@mail.com', password: '123456' })
        .expect(201);

      // Then login
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@mail.com', password: '123456' })
        .expect(201);

      expect(res.body).toHaveProperty('access_token');
      expect(typeof res.body.access_token).toBe('string');
    });

    it('should not login with wrong email', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'nonexistent@mail.com', password: '123456' })
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should not login with wrong password', async () => {
      // First signup
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ email: 'test@mail.com', password: '123456' })
        .expect(201);

      // Try login with wrong password
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test@mail.com', password: 'wrongpassword' })
        .expect(401);

      expect(res.body.message).toBe('Invalid credentials');
    });
  });
});
