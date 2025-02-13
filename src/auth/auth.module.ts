import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key', // ✅ 환경 변수에서 시크릿 키 사용
      signOptions: { expiresIn: '1h' }, // ✅ 토큰 만료 시간 설정
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule], // ✅ JwtModule도 exports 해줘야 함
})
export class AuthModule {}
