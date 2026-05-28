// Location: backend/src/modules/users/users.service.ts
// Purpose: Business logic for user profile management.
//          - findAll:      Admin — list all users with pagination
//          - findById:     Get single user profile
//          - updateProfile: Update name/phone/avatar for self
//          - updateRole:   Admin-only — change a user's role
//          - deactivate:   Admin-only — soft-delete user

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /** Admin: list all users */
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).lean(),
      this.userModel.countDocuments(),
    ]);
    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  /** Get a user by ID */
  async findById(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Update own profile (name, phone, avatar) */
  async updateProfile(
    userId: string,
    updates: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>,
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updates, { new: true })
      .lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Admin: change user role */
  async updateRole(targetId: string, role: string) {
    const user = await this.userModel
      .findByIdAndUpdate(targetId, { role }, { new: true })
      .lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Admin: deactivate account */
  async deactivate(targetId: string) {
    await this.userModel.findByIdAndUpdate(targetId, { isActive: false });
    return { message: 'User deactivated' };
  }
}