import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  description: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
