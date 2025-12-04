import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EnvironmentConfigService, ServiceLevelLogger } from './infrastructure';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { TLoggers } from './services/enums';

@Injectable()
export class AppService {
  constructor(
    @Inject(TLoggers.app)
    private logger: ServiceLevelLogger,
    private readonly envConfig: EnvironmentConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getHello() {
    try {
      this.logger.verbose('health is called');
      const user = await this.userRepository.findOne({
        where: { email: 'faridmurshed11@gmail.com' },
      });
      if (user) return { message: `Hello, ${user?.email}` };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        error?.message || 'Something went wrong',
        HttpStatus?.NOT_FOUND,
      );
    }
  }
}
