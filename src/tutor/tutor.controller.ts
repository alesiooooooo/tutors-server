import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tutors')
@Controller('tutor')
export class TutorController {}
