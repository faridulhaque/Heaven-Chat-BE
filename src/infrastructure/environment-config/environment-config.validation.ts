import { plainToClass } from '@nestjs/class-transformer';
import { IsString, validateSync } from '@nestjs/class-validator';

class EnvironmentVariables {
  @IsString()
  DB_CONNECTION_URL: string;
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
