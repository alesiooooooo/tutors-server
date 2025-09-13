import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('booking')
export class BookingController {}
