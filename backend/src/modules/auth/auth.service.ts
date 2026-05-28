import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login() {
    return {
      message: 'Login route working',
    };
  }

  async register() {
    return {
      message: 'Register route working',
    };
  }
}