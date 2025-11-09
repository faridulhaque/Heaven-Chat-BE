import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config';

@Injectable()
export class BasicGuard implements CanActivate {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const apiKey = request.headers['x-api-key'] as string;
      const storedApiKey = this.environmentConfigService.getXApiKey();
      if (!apiKey) {
        throw new HttpException(
          'No authorization header provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // check validity here
      return storedApiKey === apiKey;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
