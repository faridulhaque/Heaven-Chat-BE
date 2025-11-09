import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService) {}
  getDbConnectionUrl() {
    return this.configService.get<string>('DB_CONNECTION_URL');
  }

  getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpiry() {
    return this.configService.get<string>('JWT_EXPIRY');
  }
  getXApiKey() {
    return this.configService.get<string>('X_API_KEY');
  }
}
