import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const apiKey = request.headers['x-api-key'] as string;
      if (!apiKey) {
        throw new HttpException(
          'No authorization header provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = request.headers['authorization'];
      console.log('token', token);
      const { id } = await this.validateJWT(token);

      const user = await this.userRepository.findOne({
        where: {
          userId: id,
        },
      });

      if (!user)
        throw new HttpException('Invalid user', HttpStatus.NOT_ACCEPTABLE);

      request.user = user;
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  validateJWT(token: string): any {
    try {
      const jwtOptions = {
        secret: this.environmentConfigService.getJwtSecret(),
      };
      const decode = this.jwtService.verify(token, jwtOptions);
      return decode;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to verify token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
