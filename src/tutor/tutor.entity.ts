import { Booking } from 'src/booking/booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('tutor')
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Booking, (booking) => booking.tutor)
  bookings: Booking[];
}
