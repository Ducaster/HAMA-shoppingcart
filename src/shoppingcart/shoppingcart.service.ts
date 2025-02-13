import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ShoppingCart,
  ShoppingCartDocument,
} from './schemas/shoppingcart.schema';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart.name)
    private shoppingCartModel: Model<ShoppingCartDocument>,
  ) {}

  // ✅ 장바구니에 상품 추가 또는 업데이트
  async addToCart(googleId: string, product: any) {
    let cart = await this.shoppingCartModel.findOne({ googleId }).exec();

    // ✅ 장바구니가 없으면 새로 생성
    if (!cart) {
      cart = new this.shoppingCartModel({ googleId, products: [] });
    }

    // ✅ 같은 UID의 상품이 이미 존재하는지 확인
    const existingProductIndex = cart.products.findIndex(
      (p) => p.uid === product.uid,
    );

    if (existingProductIndex !== -1) {
      // ✅ 기존 상품 업데이트 (새로운 데이터로 교체)
      cart.products[existingProductIndex] = {
        ...cart.products[existingProductIndex], // 기존 데이터 유지
        ...product, // 새로운 데이터 덮어쓰기
        quantity: product.quantity || 1, // 수량 업데이트
      };
    } else {
      // ✅ 새로운 상품 추가
      cart.products = [
        ...cart.products,
        { ...product, quantity: product.quantity || 1 },
      ];
    }

    // ✅ 장바구니 저장
    await cart.save();
    return { message: 'Product added/updated in cart', cart };
  }

  // ✅ 장바구니 조회
  async getCart(googleId: string) {
    const cart = await this.shoppingCartModel.findOne({ googleId }).exec();
    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }
    return cart;
  }

  // ✅ 장바구니에서 특정 상품 삭제
  async removeFromCart(googleId: string, uid: string) {
    const cart = await this.shoppingCartModel.findOne({ googleId }).exec();
    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }

    cart.products = cart.products.filter((product) => product.uid !== uid);
    await cart.save();

    return { message: 'Product removed from cart', cart };
  }

  // ✅ 장바구니 비우기
  async clearCart(googleId: string) {
    const cart = await this.shoppingCartModel
      .findOneAndDelete({ googleId })
      .exec();
    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }
    return { message: 'Shopping cart cleared' };
  }
}
