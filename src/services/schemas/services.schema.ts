import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Service {
  @Prop({ required: true, unique: true })
  name: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
