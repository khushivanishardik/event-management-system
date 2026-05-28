// Location: backend/src/common/decorators/roles.decorator.ts
// Purpose: Custom decorator that attaches required Role(s) to a route handler.
//          Read by RolesGuard to perform authorization checks.
//
// Usage:
//   @Roles(Role.ORGANIZER)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Post('events')
//   createEvent(...) { ... }

import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
