import { Injectable } from '@nestjs/common';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  login(dto: AuthDto) {
    throw new Error('Method not implemented.');
  }

  signup(dto: AuthDto) {
    throw new Error('Method not implemented.');
  }
}
