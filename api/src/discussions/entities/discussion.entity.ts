import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
  toJSON: {
    transform(_, ret) {
      delete ret._id;
    },
  },
})
export class Discussion {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  id: string;

  @Prop()
  system: string;

  @Prop()
  label: string;

  @Prop()
  description: string;

  @Prop({ type: SchemaTypes.Map, of: SchemaTypes.Mixed })
  extra: {
    [key: string]: any;
  };
}

export type DiscussionDocument = Discussion & Document;
export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
