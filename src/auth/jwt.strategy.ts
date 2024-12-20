import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PayloadDto } from './dtos/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @InjectModel('Register') private userModel: Model<any>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
        });
    }

    async validate(payload: PayloadDto) {
        if (!payload || !payload.userId || !payload.email) {
            throw new UnauthorizedException('Invalid token payload');
        }
        try {
            const user = await this.userModel.findById(payload.userId).select('-password');
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            return {
                userId: user._id,
                email: user.email
            };
        } catch (error) {
            throw new UnauthorizedException('Unable to validate user');
        }
    }
}