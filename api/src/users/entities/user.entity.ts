import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({
  versionKey: false,
  toJSON: {
    transform(_, ret) {
      delete ret._id;
    },
  },
})
export class User {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
    index: {
      unique: true,
    },
    unique: true,
  })
  id: string;

  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  password: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
