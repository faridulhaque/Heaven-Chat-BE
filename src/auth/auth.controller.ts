import {
  Body,
  Controller,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/RegisterDto';
import { LoginDto } from 'src/dto/LoginDto';
import type { RequestWithUser } from 'src/services/types';
import { UserEntity } from 'src/entities/user.entity';
import { AuthGuard } from 'src/infrastructure/guards/authGuard';

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

  @UseGuards(AuthGuard)
  @Post('/validate')
  validateAuth(@Req() request: RequestWithUser): UserEntity {
    return request.user;
  }
}
