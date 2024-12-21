import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from '../role/role.model';

export type PermissionDocument = Permission & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Permission {
  @Prop({ length: 255, nullable: true })
  code: string;

  @Prop({ length: 255, nullable: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Role[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
