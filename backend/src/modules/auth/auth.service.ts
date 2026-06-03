//backend/src/modules/auth/auth.service.ts

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

import {
  User,
  UserDocument,
} from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
  ) {}

  async register(body: any) {
    const existingUser =
      await this.userModel.findOne({
        email: body.email,
      });

    if (existingUser) {
      throw new BadRequestException(
        'Email already registered',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        body.password,
        10,
      );

    const user =
      await this.userModel.create({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role || 'user',
        phone: body.phone || '',
      });

    const token =
      this.jwtService.sign({
        sub: user._id,
        email: user.email,
        role: user.role,
      });

    return {
      success: true,
      message: 'Signup successful',
      data: {
        user,
        token,
      },
    };
  }

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.userModel.findOne({
        email,
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const token =
      this.jwtService.sign({
        sub: user._id,
        email: user.email,
        role: user.role,
      });

    return {
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    };
  }
}