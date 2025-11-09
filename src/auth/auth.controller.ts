import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from 'src/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/onboard')
  @SetMetadata('statusCode', 201)
  async onboardUser(@Body() dto: AuthDto) {
    return await this.authService.onBoardUser(dto);
  }
}
