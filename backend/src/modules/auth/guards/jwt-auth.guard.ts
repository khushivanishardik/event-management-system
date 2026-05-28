// Location: backend/src/modules/auth/guards/jwt-auth.guard.ts
// Purpose: Route guard that triggers the JWT Passport strategy. Apply to any
//          controller method or class that requires an authenticated user.
//
// Usage:
//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Request() req) { return req.user; }

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
