import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Services {
  COMMERCIAL = 'commercial',
  FILMS = 'films',
  SHORT_FILMS = 'short-films',
  SERIES = 'series',
  TV_PROGRAM = 'tv-program',
  VIDEO_CLIP = 'video-clip',
  SKETCH = 'sketch',
}

@Schema({
  timestamps: true,
})
export class Client {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  phone_number: string;
  @Prop({ required: true })
  message: string;
  @Prop({ required: true })
  services: Services[];
}

export const clientSchema = SchemaFactory.createForClass(Client);
