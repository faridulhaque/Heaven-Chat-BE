import { Injectable } from '@nestjs/common';
import { EnvironmentConfigService } from './infrastructure';

@Injectable()
export class AppService {
  constructor(private readonly envConfig: EnvironmentConfigService) {}
  getHello(): any {
    return { status: 'ok' };
  }
}
