import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shoppingcart.service';
import { ShoppingCartController } from './shoppingcart.controller';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService, JwtAuthGuard],
})
export class ShoppingCartModule {}
