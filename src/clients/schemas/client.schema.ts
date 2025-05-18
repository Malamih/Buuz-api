import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum Services {
  VIDEO_PRODUCTION = 'video-production',
  TVC_COMMERCIAL = 'tvc-commercial',
  CREATIVE_CONCEPTS = 'creative-concepts',
  MARKETING_CAMPAIGNS = 'marketing-campaigns',
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
