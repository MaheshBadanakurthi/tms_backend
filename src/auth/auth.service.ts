/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { registerDataTypes } from './dtos/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Register } from './schemas/register.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dtos/user-update.dto';
import { error } from 'console';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel('Register') private userModel: Model<Register>,
        private jwtService: JwtService
    ) { }

    async generateToken(user: any) {
        const payload = {
            userId: user._id,
            email: user.email
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    // Register User
    async postRegisterUsers(userData: registerDataTypes): Promise<{ message: string }> {
        const { email, password } = userData;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) { throw new BadRequestException('Email already in use'); }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            ...userData,
            password: hashedPassword,
        });
        await newUser.save();
        return { message: 'User registered successfully' };
    }
    // Login User
    async loginUser(email: string, password: string): Promise<{ token: string, role: string, userid: string }> {
        const user = await this.userModel.findOne({ email });
        if (!user) { throw new UnauthorizedException('Invalid credentials'); }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) { throw new UnauthorizedException('Invalid credentials'); }
        // Generate JWT
        const payload = { userId: user._id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token, role: user.role, userid: user.id };
    }

    //get user details by id
    public async getUserDetails(userId: string): Promise<{ data: { name: string, email: string, profile: string | null, mobile: number, userid: string } }> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) { throw new NotFoundException('User details not found'); }
            return { data: { email: user.email, name: user.name, mobile: user.mobile, profile: user.profile, userid: user.id } };
        } catch (error) {
            throw error;
        }
    }

    // Update the User data
    public async updateUserDetails(userId: string, updateData: UpdateUserDto): Promise<{ message: string, data: any }> {
        try {
            if (!userId) { throw new BadRequestException("User ID is required") }
            if (!Object.keys(updateData).length) { throw new BadRequestException("No update data provided") }
            const userData = await this.userModel.findById(userId)
            if (!userData) { throw new NotFoundException('User not found') }
            const updatedUser = this.userModel.findByIdAndUpdate(userId, updateData,
                {
                    new: true,      // Return the modified document
                    runValidators: true, // Run model validations
                    context: 'query' // Ensure context for validation
                })
            const userResponse = (await updatedUser).toObject(); //Used toObject() to convert the Mongoose document to a plain JavaScript object
            if (!updatedUser) { throw new InternalServerErrorException("Failed to update the user") }
            return { message: "User data updated successfully", data: userResponse }
        } catch (error) {
            if (error instanceof mongoose.Error.ValidationError) { throw new BadRequestException('Invalid update data'); }
            throw error
        }
    }
    // Delete the user account
    public async deleteUserAccount(id: string): Promise<{ message: string }> {
        try {
            if (!id) { throw new BadRequestException('User ID is required') }
            const user = await this.userModel.findById(id);
            if (!user) { throw new NotFoundException('User not found'); }
            await this.userModel.findByIdAndDelete(id);  // Use await to ensure the deletion is completed
            return { message: "Account deleted successfully" };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) { throw error; }
            throw new InternalServerErrorException('Failed to delete user account');
        }
    }
}
