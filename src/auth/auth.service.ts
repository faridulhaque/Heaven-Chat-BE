import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import {
  EnvironmentConfigService,
  ServiceLevelLogger,
} from 'src/infrastructure';
import { TLoggers } from 'src/services/enums';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dto/RegisterDto';
import { LoginDto } from 'src/dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TLoggers.auth)
    private logger: ServiceLevelLogger,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly envConfig: EnvironmentConfigService,
  ) {}

  async registerUser(dto: RegisterDto): Promise<{ token: string }> {
    this.logger.verbose('Started onboarding user');
    const savedUser = await this.userRepository.save({
      name: dto.name,
      avatar: dto.avatar,
      email: dto.email,
    });

    if (!savedUser)
      throw new HttpException(
        'Failed to create new user',
        HttpStatus.NOT_FOUND,
      );
    this.logger.log('New user created');
    const token = this.generateJWT(savedUser.userId);
    return {
      token,
    };
  }

  async loginUser(dto: LoginDto): Promise<{ token: string }> {
    this.logger.verbose('Started onboarding user');

    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!existingUser) {
      this.logger.warn(`User not found for email ${dto.email}`);
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    this.logger.log(`User authenticated: ${existingUser.userId}`);

    const token = this.generateJWT(existingUser.userId);
    return { token };
  }

  private generateJWT(id: string): string {
    try {
      this.logger.debug('Json web token is generating');
      const token = this.jwtService.sign(
        { id: id },
        {
          secret: this.envConfig.getJwtSecret() as string,
          expiresIn: this.envConfig.getJwtExpiry() as any,
        },
      );
      this.logger.log('Token generated successfully');
      return token;
    } catch (error) {
      this.logger.error('Failed to generate JWT', error.stack);
      throw new HttpException(
        'Failed to generate token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
