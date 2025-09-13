import { Tutor } from 'src/tutor/tutor.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Tutor, (tutor) => tutor.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutorId' })
  tutor: Tutor;
}
