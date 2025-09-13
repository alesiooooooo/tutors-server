import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tutor')
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
