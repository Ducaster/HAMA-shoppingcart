import { Injectable, NotFoundException } from '@nestjs/common';
import { getDynamoDBClient } from '../config/dynamodb.config';
import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ShoppingCartItem } from './types/shoppingcart.types';

@Injectable()
export class ShoppingCartService {
  private readonly docClient = getDynamoDBClient();
  private readonly tableName = process.env.DYNAMODB_TABLE_NAME;

  // ✅ 장바구니에 상품 추가 또는 업데이트
  async addToCart(googleId: string, product: ShoppingCartItem['products'][0]) {
    // 기존 장바구니 조회
    const { Item: cart } = (await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { googleId },
      }),
    )) as unknown as { Item: ShoppingCartItem };

    let products: ShoppingCartItem['products'] = [];
    if (cart) {
      products = cart.products;
      const existingProductIndex = products.findIndex(
        (p) => p.uid === product.uid,
      );

      if (existingProductIndex !== -1) {
        products[existingProductIndex] = {
          ...products[existingProductIndex],
          ...product,
          quantity: product.quantity || 1,
        };
      } else {
        products.push({ ...product, quantity: product.quantity || 1 });
      }
    } else {
      products = [{ ...product, quantity: product.quantity || 1 }];
    }

    const timestamp = new Date().toISOString();

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          googleId,
          products,
          updatedAt: timestamp,
          createdAt: cart?.createdAt || timestamp,
        },
      }),
    );

    return {
      message: 'Product added/updated in cart',
      cart: { googleId, products },
    };
  }

  // ✅ 장바구니 조회
  async getCart(googleId: string) {
    const { Item: cart } = (await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { googleId },
      }),
    )) as unknown as { Item: ShoppingCartItem };

    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }

    return cart;
  }

  // ✅ 장바구니에서 특정 상품 삭제
  async removeFromCart(googleId: string, uid: string) {
    const { Item: cart } = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { googleId },
      }),
    );

    if (!cart) {
      throw new NotFoundException('Shopping cart not found');
    }

    const updatedProducts = cart.products.filter(
      (product) => product.uid !== uid,
    );

    await this.docClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { googleId },
        UpdateExpression: 'SET products = :products, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':products': updatedProducts,
          ':updatedAt': new Date().toISOString(),
        },
      }),
    );

    return {
      message: 'Product removed from cart',
      cart: { googleId, products: updatedProducts },
    };
  }

  // ✅ 장바구니 비우기
  async clearCart(googleId: string) {
    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { googleId },
      }),
    );

    return { message: 'Shopping cart cleared' };
  }
}
