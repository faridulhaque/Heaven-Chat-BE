import { Logger, Injectable } from '@nestjs/common';

@Injectable()
export class ServiceLevelLogger extends Logger {
  constructor(context: string) {
    super();
    this.context = context;
  }
}
