import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly environmentConfigService: EnvironmentConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const apiKey = request.headers['x-api-key'] as string;
      if (!apiKey) {
        throw new HttpException(
          'No authorization header provided',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // check validity here
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
