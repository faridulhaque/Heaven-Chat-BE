import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}
  getDbConnectionUrl() {
    return this.configService.get<string>('DB_CONNECTION_URL');
  }
}
