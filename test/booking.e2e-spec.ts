import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from '../src/config/test-app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Tutor } from '../src/tutor/tutor.entity';
import { Booking } from '../src/booking/booking.entity';

describe('BookingController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let tutorRepository: Repository<Tutor>;
  let bookingRepository: Repository<Booking>;
  let authToken: string;
  let testUser: User;
  let testTutor: Tutor;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    tutorRepository = moduleFixture.get<Repository<Tutor>>(
      getRepositoryToken(Tutor),
    );
    bookingRepository = moduleFixture.get<Repository<Booking>>(
      getRepositoryToken(Booking),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await bookingRepository.clear();
    await tutorRepository.clear();
    await userRepository.clear();

    // Create test user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'user@test.com',
        password: 'password123',
        name: 'Test User',
      })
      .expect(201);

    // Get the created user from database
    testUser = await userRepository.findOne({
      where: { email: 'user@test.com' },
    });
    if (!testUser) {
      throw new Error('Test user not created');
    }

    // Create test tutor
    testTutor = await tutorRepository.save({
      email: 'tutor@test.com',
      password: 'password123',
      name: 'Test Tutor',
      subject: 'Math',
      hourlyRate: 50,
    });

    // Get auth token
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'password123',
      })
      .expect(201);

    authToken = response.body.access_token;
  });

  describe('POST /booking', () => {
    it('should create a new booking', async () => {
      const bookingData = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '11:00',
      };

      const response = await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.date).toBe(bookingData.date);
      expect(response.body.startTime).toBe(bookingData.startTime);
      expect(response.body.endTime).toBe(bookingData.endTime);
      expect(response.body.user).toHaveProperty('id', testUser.id);
      expect(response.body.tutor).toHaveProperty('id', testTutor.id);
    });

    it('should return 400 for invalid booking data', async () => {
      const invalidBookingData = {
        tutorId: testTutor.id,
        // Missing required fields
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidBookingData)
        .expect(400);
    });

    it('should return 401 without auth token', async () => {
      const bookingData = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '11:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .send(bookingData)
        .expect(401);
    });

    it('should return 400 when tutor has overlapping booking', async () => {
      // Create first booking
      const firstBooking = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '12:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(firstBooking)
        .expect(201);

      // Try to create overlapping booking (same tutor, same date, overlapping time)
      const overlappingBooking = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '11:00', // Overlaps with first booking (10:00-12:00)
        endTime: '13:00',
      };

      const response = await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(overlappingBooking)
        .expect(400);

      expect(response.body.message).toContain('Tutor is not available');
    });

    it('should allow booking same tutor on different date', async () => {
      // Create first booking
      const firstBooking = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '12:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(firstBooking)
        .expect(201);

      // Create booking on different date (should succeed)
      const differentDateBooking = {
        tutorId: testTutor.id,
        date: '2024-12-26', // Different date
        startTime: '10:00',
        endTime: '12:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(differentDateBooking)
        .expect(201);
    });

    it('should allow booking same tutor on same date but non-overlapping time', async () => {
      // Create first booking
      const firstBooking = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '12:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(firstBooking)
        .expect(201);

      // Create non-overlapping booking (same date, but different time slot)
      const nonOverlappingBooking = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '14:00', // Non-overlapping time
        endTime: '16:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(nonOverlappingBooking)
        .expect(201);
    });

    it('should return 400 when user has overlapping booking with themselves', async () => {
      // Create first booking for user
      const firstBooking = {
        tutorId: testTutor.id,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '12:00',
      };

      await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(firstBooking)
        .expect(201);

      // Create another tutor
      const secondTutor = await tutorRepository.save({
        email: 'tutor2@test.com',
        password: 'password123',
        name: 'Second Tutor',
        subject: 'Physics',
        hourlyRate: 60,
      });

      // Try to create overlapping booking with different tutor (should fail because user is busy)
      const overlappingUserBooking = {
        tutorId: secondTutor.id, // Different tutor
        date: '2024-12-25', // Same date
        startTime: '11:00', // Overlaps with first booking (10:00-12:00)
        endTime: '13:00',
      };

      const response = await request(app.getHttpServer())
        .post('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .send(overlappingUserBooking)
        .expect(400);

      expect(response.body.message).toContain(
        'You already have a lesson scheduled at this time',
      );
    });
  });

  describe('GET /booking', () => {
    it('should return all bookings for authenticated user', async () => {
      // Create a booking
      const booking = await bookingRepository.save({
        user: testUser,
        tutor: testTutor,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '11:00',
      });

      const response = await request(app.getHttpServer())
        .get('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('id', booking.id);
      expect(response.body[0]).toHaveProperty('user');
      expect(response.body[0]).toHaveProperty('tutor');
    });

    it('should return empty array when no bookings exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/booking')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer()).get('/booking').expect(401);
    });
  });

  describe('DELETE /booking/:id', () => {
    it('should delete a booking', async () => {
      // Create a booking
      const booking = await bookingRepository.save({
        user: testUser,
        tutor: testTutor,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '11:00',
      });

      await request(app.getHttpServer())
        .delete(`/booking/${booking.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify booking is deleted
      const deletedBooking = await bookingRepository.findOne({
        where: { id: booking.id },
      });
      expect(deletedBooking).toBeNull();
    });

    it('should return 404 for non-existent booking', async () => {
      await request(app.getHttpServer())
        .delete('/booking/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 401 without auth token', async () => {
      await request(app.getHttpServer()).delete('/booking/1').expect(401);
    });
  });
});
