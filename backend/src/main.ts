import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * Application entry point.
 * - Creates Nest app
 * - Enables global DTO validation
 * - Starts HTTP server
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow frontend apps (running on a different origin) to call this API.
  // You can override allowed origins with CORS_ORIGIN in .env, e.g.
  // CORS_ORIGIN=http://localhost:6001,http://localhost:5173
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:6001')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation for every incoming request body/query/params.
  // whitelist: strips unknown fields not defined in DTOs.
  // forbidNonWhitelisted: throws error when unknown fields are sent.
  // transform: converts payloads into DTO class instances.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Default server port (can be overridden using PORT env variable).
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
