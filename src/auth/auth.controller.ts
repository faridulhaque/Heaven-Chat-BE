import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/RegisterDto';
import { LoginDto } from 'src/dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @SetMetadata('statusCode', 201)
  async register(@Body() dto: RegisterDto) {
    return await this.authService.registerUser(dto);
  }

  @Post('/login')
  @SetMetadata('statusCode', 201)
  async login(@Body() dto: LoginDto) {
    return await this.authService.loginUser(dto);
  }
}
