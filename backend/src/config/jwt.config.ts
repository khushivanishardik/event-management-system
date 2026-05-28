// Location: backend/src/config/jwt.config.ts
// Purpose: Exposes JWT secret and token expiration settings as a typed
//          config namespace consumed by JwtModule and JwtStrategy.

import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
}));
