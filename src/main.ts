import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApplication } from './app.factory.js';
import { PinoLoggerService } from './common/logging/pino-logger.service.js';

async function bootstrap() {
  const app = configureApplication(await NestFactory.create(AppModule));
  app.useLogger(app.get(PinoLoggerService));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
