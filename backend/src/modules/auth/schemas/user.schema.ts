// Location: backend/src/modules/auth/schemas/user.schema.ts
// Purpose: Mongoose schema definition for the User collection. Stores auth
//          credentials, profile info, and role. Password is stored as a bcrypt hash.

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/constants/roles.constant';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string; // bcrypt hash — never store plain text

  @Prop({ enum: Role, default: Role.USER })
  role: Role;

  @Prop({ default: '' })
  avatar: string; // Cloudinary URL

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Exclude password from toJSON output for security
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
