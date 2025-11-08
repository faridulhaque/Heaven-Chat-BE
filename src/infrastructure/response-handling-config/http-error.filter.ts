import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status: any = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const _response = exception.getResponse();
    const custom_code =
      _response['code'] == null ? exception['cause'] : _response['code'];

    const logErrorResponse = {
      status: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        _response['errorMessage'] == null
          ? exception['response']
          : _response['errorMessage'],
    };

    const errorResponse = {
      status: status,
      code: custom_code,
      errorMessage:
        _response['errorMessage'] == null
          ? exception['response']
          : _response['errorMessage'],
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(
        `${request.method} ${request.url}`,
        exception.stack,
        'ExceptionFilter',
      );
    } else {
      Logger.error(
        `${request.method} ${request.url}`,
        JSON.stringify(logErrorResponse),
        'ExceptionFilter',
      );
    }

    response.status(status).json(errorResponse);
  }
}
