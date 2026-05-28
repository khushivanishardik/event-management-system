// Location: backend/src/modules/users/users.controller.ts
// Purpose: REST controller for user management.
//   GET    /api/users          - Admin: list all users
//   GET    /api/users/:id      - Get user by ID
//   PATCH  /api/users/profile  - Update own profile
//   PATCH  /api/users/:id/role - Admin: update role
//   DELETE /api/users/:id      - Admin: deactivate user

import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constant';
import { successResponse } from '../../common/utils/response';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const data = await this.usersService.findAll(+page || 1, +limit || 20);
    return successResponse(data, 'Users fetched');
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return successResponse(user, 'User fetched');
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    const user = await this.usersService.updateProfile(req.user._id, body);
    return successResponse(user, 'Profile updated');
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    const user = await this.usersService.updateRole(id, role);
    return successResponse(user, 'Role updated');
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async deactivate(@Param('id') id: string) {
    const result = await this.usersService.deactivate(id);
    return successResponse(result, 'User deactivated');
  }
}