import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Email already taken' })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
