import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { registerDataTypes } from './dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Register API
  @Post('/register')
  async userRegister(@Body(new ValidationPipe()) registerPayload: registerDataTypes) {
    return this.authService.postRegisterUsers(registerPayload);
  }

  // Login API
  @Post('/login')
  async userLogin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.loginUser(email, password);
  }
}
