import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const { tutorId, date, startTime, endTime } = createBookingDto;

    // Check for overlapping bookings for the same tutor on the same date
    const overlappingBooking = await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.tutor', 'tutor')
      .where('tutor.id = :tutorId', { tutorId })
      .andWhere('booking.date = :date', { date })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime },
      )
      .getOne();

    if (overlappingBooking) {
      throw new BadRequestException(
        'Tutor is not available during this time period. Booking conflicts with existing booking.',
      );
    }

    const booking = this.bookingRepo.create({
      tutor: { id: tutorId },
      user: { id: userId },
      date,
      startTime,
      endTime,
    });

    return await this.bookingRepo.save(booking);
  }

  async findAll(userId: number) {
    return await this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'tutor'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async remove(id: number, userId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.bookingRepo.remove(booking);

    return { message: 'Booking deleted successfully' };
  }
}
