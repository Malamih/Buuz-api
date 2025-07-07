import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Employee {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  position: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  image_public_id: string;
}

export const employeeSchema = SchemaFactory.createForClass(Employee);
