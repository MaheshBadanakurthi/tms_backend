import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterSchema } from './schemas/register.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
            signOptions: { 
                expiresIn: '24h',
                algorithm: 'HS256'
            },
        }),
        inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Register', schema: RegisterSchema }]),
],


  exports: [JwtModule]
})
export class AuthModule { }
