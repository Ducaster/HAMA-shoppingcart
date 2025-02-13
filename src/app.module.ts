import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ShoppingCartModule } from './shoppingcart/shoppingcart.module';

console.log('📌 MONGODB_URI (Before ConfigModule):', process.env.MONGODB_URI);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ 모든 모듈에서 환경 변수 접근 가능하게 설정
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/nest', // 기본값 추가
    ),
    ShoppingCartModule,
  ],
})
export class AppModule {}
