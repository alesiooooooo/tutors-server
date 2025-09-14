import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TutorService } from './tutor.service';

@ApiTags('Tutors')
@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tutors' })
  @ApiResponse({ status: 200, description: 'List of all tutors' })
  async findAll() {
    return this.tutorService.findAll();
  }
}
