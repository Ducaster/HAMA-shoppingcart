import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shoppingcart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  // ✅ 장바구니에 상품 추가
  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addToCart(@Body() product: any, @Req() req) {
    const googleId = req.user.userId; // JWT에서 Google ID 추출
    console.log('googleId', googleId);
    return this.shoppingCartService.addToCart(googleId, product);
  }

  // ✅ 장바구니 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req) {
    const googleId = req.user.userId;
    return this.shoppingCartService.getCart(googleId);
  }

  // ✅ 장바구니 비우기
  @Delete('clear')
  @UseGuards(JwtAuthGuard)
  async clearCart(@Req() req) {
    const googleId = req.user.userId;
    return this.shoppingCartService.clearCart(googleId);
  }

  // ✅ 장바구니에서 특정 상품 삭제
  @Delete('remove/:uid')
  @UseGuards(JwtAuthGuard)
  async removeFromCart(@Param('uid') uid: string, @Req() req) {
    const googleId = req.user.userId;
    return this.shoppingCartService.removeFromCart(googleId, uid);
  }
}
