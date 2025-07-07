import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Portoflio {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  image: string;
  @Prop({ required: true })
  image_public_id: string;
  @Prop({ required: true })
  logo: string;
  @Prop({ required: true })
  logo_public_id: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'project' }] })
  projects: Types.ObjectId[];
}

export const PortoflioSchema = SchemaFactory.createForClass(Portoflio);
