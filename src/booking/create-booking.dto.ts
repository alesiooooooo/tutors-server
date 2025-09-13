import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID of the tutor to book',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  tutorId: number;

  @ApiProperty({
    description: 'Date of the booking',
    example: '2024-12-25',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Start time of the booking',
    example: '10:00',
  })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'End time of the booking',
    example: '11:00',
  })
  @IsString()
  @IsNotEmpty()
  endTime: string;
}
