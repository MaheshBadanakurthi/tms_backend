import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { LoginDto, registerDataTypes } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
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
}
