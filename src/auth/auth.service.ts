/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { registerDataTypes } from './dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Register } from './schemas/register.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Register') private userModel: Model<Register>,
        private jwtService: JwtService
    ) { }

    async generateToken(user: any) {
        console.log(user, "auth service, USERR");
        const payload = {
            userId: user._id,
            email: user.email
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    // Register User
    async postRegisterUsers(userData: registerDataTypes): Promise<any> {
        const { email, password } = userData;

        // Check if the user already exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const newUser = new this.userModel({
            ...userData,
            password: hashedPassword,
        });
        await newUser.save();
        return { message: 'User registered successfully' };
    }

    // Login User
    async loginUser(email: string, password: string): Promise<any> {
        // Check if user exists
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        // Generate JWT
        const payload = { userId: user._id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token, role: user.role };
    }


}
