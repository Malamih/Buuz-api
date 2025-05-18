import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId, Types } from "mongoose";

@Schema({ timestamps: true })

export class Value {
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    description: string;
    @Prop({ type: Types.ObjectId, ref: 'page' })
    page: Types.ObjectId;
}

export const valueSchema = SchemaFactory.createForClass(Value)