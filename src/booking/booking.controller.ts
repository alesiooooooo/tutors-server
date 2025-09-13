import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Bookings')
@ApiBearerAuth('JWT-auth')
@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({
    status: 201,
    description: 'Booking successfully created',
    schema: {
      example: {
        id: 1,
        date: '2024-12-25',
        startTime: '10:00',
        endTime: '11:00',
        user: { id: 1, email: 'user@example.com' },
        tutor: { id: 2, name: 'Math Tutor' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid booking data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: any,
  ) {
    return this.bookingService.create(createBookingDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'List of user bookings',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        example: {
          id: 1,
          date: '2024-12-25',
          startTime: '10:00',
          endTime: '11:00',
          user: { id: 1, email: 'user@example.com' },
          tutor: { id: 2, name: 'Math Tutor' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req: any) {
    return this.bookingService.findAll(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Booking successfully deleted',
    schema: {
      example: {
        message: 'Booking deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.bookingService.remove(+id, req.user.userId);
  }
}
