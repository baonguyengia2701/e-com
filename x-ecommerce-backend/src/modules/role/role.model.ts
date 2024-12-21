import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';

export type RoleDocument = Role & Document;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Role {
  @Prop({ length: 255, nullable: true })
  name: string;

  @Prop({ length: 255, nullable: true })
  description: string;
  @Prop({ length: 255, nullable: true })
  code: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: User[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
