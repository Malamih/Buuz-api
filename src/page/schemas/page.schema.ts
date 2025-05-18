import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { project } from 'src/project/schemas/project.schema';

@Schema({
  timestamps: true,
})
export class page {
  @Prop({ required: true, unique: true })
  name: string;
}

export const pageSchema = SchemaFactory.createForClass(page);

pageSchema.virtual('projects', {
  ref: 'project',
  localField: '_id',
  foreignField: 'page'
})
pageSchema.virtual('values', {
  ref: 'Value',
  localField: '_id',
  foreignField: 'page'
})
pageSchema.set('toObject', { virtuals: true })
pageSchema.set('toJSON', { virtuals: true })