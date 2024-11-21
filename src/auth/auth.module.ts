import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegisterSchema } from './schemas/register.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    ConfigModule, // Import ConfigModule here
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule], // Ensure ConfigModule is imported here
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secret: config.get('JWT_SECRET'),
    //     signOptions: { expiresIn: config.get('JWT_EXPIRES') },
    //   }),
    // }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey', // Set your secret key here
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    MongooseModule.forFeature([{ name: 'Register', schema: RegisterSchema }]),
  ],
})
export class AuthModule {}
