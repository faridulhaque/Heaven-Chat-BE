import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from './infrastructure';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly envConfig: EnvironmentConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getHello() {
    const user = await this.userRepository.findOne({
      where: { email: 'faridmurshed11@gmail.com' },
    });

    return { message: `Hello, ${user?.email}` };
  }
}
