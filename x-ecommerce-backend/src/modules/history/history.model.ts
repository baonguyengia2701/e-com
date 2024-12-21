import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HistoryType } from './history.constants';

export type HistoryDocument = HydratedDocument<History>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class History {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  userId: string;

  @Prop({ enum: HistoryType })
  type: HistoryType;

  @Prop({ type: Object, required: false })
  detail: object;
}

export const HistorySchema = SchemaFactory.createForClass(History);
