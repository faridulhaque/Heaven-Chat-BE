import { SetMetadata } from '@nestjs/common';

export const SetResponseCode = (code: string) =>
  SetMetadata('statusCode', code);
