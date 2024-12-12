import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { LoginDto, registerDataTypes } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/user-update.dto';

@Controller('user')
export class AuthController {
  constructor(private authService: AuthService) { }

  // Register API
  @Post('/register')
  @ApiOperation({ summary: "Create account" })
  @ApiBody({ description: "Register payload", type: registerDataTypes })
  @ApiResponse({ status: 200, description: "Register successfully" })
  async userRegister(@Body(new ValidationPipe()) registerPayload: registerDataTypes) {
    return this.authService.postRegisterUsers(registerPayload);
  }

  // Login API
  @Post()
  @ApiOperation({ summary: "Login to application" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Login successfully" })
  async userLogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.loginUser(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: 'Get user profile data by ID' })
  @ApiResponse({ status: 200, description: "User profile data fetched successfully" })
  @ApiResponse({ status: 500, description: "Internal server error" })
  @Get(':id')
  async getUserProfileDetails(@Param('id') id: string) {
    return this.authService.getUserDetails(id)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ description: "Update the user data" })
  @Put(":id")
  async updateUserData(@Param('id') id: string, @Body(new ValidationPipe()) updateUserProfileData: UpdateUserDto) {
    return this.authService.updateUserDetails(id, updateUserProfileData)
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({description:"Delete user account"})
  @Delete(":id")
  async deleteAccount(@Param('id') id:string){
    return this.authService.deleteUserAccount(id)
  }
}
