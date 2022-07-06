import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type DiscussionDocument = Discussion & Document;

@Schema()
export class Discussion {
  @Prop()
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

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
