import { Inject, Injectable } from '@nestjs/common';
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
    console.log('/health is called');
    const user = await this.userRepository.findOne({
      where: { email: 'faridmurshed11@gmail.com' },
    });

    return { message: `Hello, ${user?.email}` };
  }
}
