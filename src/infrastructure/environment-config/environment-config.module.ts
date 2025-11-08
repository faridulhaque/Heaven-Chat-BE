import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';
import { validate } from './environment-config.validation';
import * as dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'local';
console.log('Environment: ', environment);

const getEnvFilePath = () => {
  switch (environment) {
    case 'production':
      return './env/.prod.env';
    case 'staging':
      return './env/.staging.env';
    case 'local':
      return './env/.local.env';
    default:
      return './env/.local.env';
  }
};

const envFilePath = getEnvFilePath();
console.log('Using env file:', envFilePath);
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validate,
    }),
  ],
  providers: [EnvironmentConfigService],
  exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
