import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, finalize } from 'rxjs';
import { PinoLoggerService } from '../logging/pino-logger.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<{ method: string; originalUrl: string }>();
    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();
    const startedAt = performance.now();
    return next
      .handle()
      .pipe(
        finalize(() =>
          this.logger.http(
            request.method,
            request.originalUrl,
            response.statusCode,
            Math.round(performance.now() - startedAt),
          ),
        ),
      );
  }
}
