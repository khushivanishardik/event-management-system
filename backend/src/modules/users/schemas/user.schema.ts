// Location: backend/src/modules/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Role } from '../../../common/constants/roles.constant';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    enum: Role,
    default: Role.USER,
  })
  role: Role;
}

export const UserSchema =
  SchemaFactory.createForClass(User);