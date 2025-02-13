import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShoppingCartDocument = ShoppingCart & Document;

@Schema({ timestamps: true })
export class ShoppingCart {
  @Prop({ required: true })
  googleId: string; // ✅ JWT에서 가져온 Google ID

  @Prop({ type: Array, default: [] })
  products: {
    site: string;
    category: string;
    link: string;
    uid: string;
    name: string;
    brand: string;
    sale_price: string;
    img: string;
    quantity: number;
  }[];
}

export const ShoppingCartSchema = SchemaFactory.createForClass(ShoppingCart);
