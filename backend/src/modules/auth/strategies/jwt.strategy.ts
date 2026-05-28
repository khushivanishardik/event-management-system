// Location: backend/src/modules/auth/strategies/jwt.strategy.ts
// Purpose: Passport JWT strategy. Extracts and validates the Bearer token from
//          the Authorization header and attaches the decoded payload to req.user.

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

export interface JwtPayload {
  sub: string;  // User MongoDB _id
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  /**
   * Called after token signature is verified. Returns the user object
   * or throws UnauthorizedException if user is not found / inactive.
   */
  async validate(payload: JwtPayload) {
    const user = await this.userModel.findById(payload.sub).lean();

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or account deactivated');
    }

    return user; // Attached as req.user
  }
}
