import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/roles.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get roles from @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get request user with proper typing
    interface RequestWithUser extends Request {
      user?: { role: Role };
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    // No user found
    if (!user) {
      throw new ForbiddenException('No user in request');
    }

    // Check if user role matches required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    // If role not allowed
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required role(s): ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
