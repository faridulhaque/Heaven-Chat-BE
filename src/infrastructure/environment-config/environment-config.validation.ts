import { plainToClass } from '@nestjs/class-transformer';
import { IsString, IsEnum, validateSync } from '@nestjs/class-validator';

enum Environment {
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
  Local = 'local',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  DB_CONNECTION_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRY: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
