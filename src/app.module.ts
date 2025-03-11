import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShoppingCartModule } from './shoppingcart/shoppingcart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ShoppingCartModule,
  ],
})
export class AppModule {}
