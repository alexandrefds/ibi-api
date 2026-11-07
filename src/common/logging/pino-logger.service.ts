import { Injectable, LoggerService } from '@nestjs/common';
import pino, { Logger } from 'pino';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private readonly logger: Logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
  });
  log(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.info({ optionalParams }, String(message));
  }
  error(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.error({ optionalParams }, String(message));
  }
  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.warn({ optionalParams }, String(message));
  }
  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.debug({ optionalParams }, String(message));
  }
  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.logger.trace({ optionalParams }, String(message));
  }
  http(
    method: string,
    path: string,
    statusCode: number,
    durationMs: number,
  ): void {
    this.logger.info(
      { method, path, statusCode, durationMs },
      'HTTP request completed',
    );
  }
}
