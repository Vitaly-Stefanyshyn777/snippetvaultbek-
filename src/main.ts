import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // дозволити всі origins
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ?? 4000;
  Logger.log(`MONGO_URI: ${process.env.MONGO_URI ? '✓ set' : '✗ NOT SET (потрібно для Railway!)'}`);
  // '0.0.0.0' потрібно для Railway/Docker — інакше не приймаються зовнішні запити
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Snippet Vault API available at http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('❌ Startup failed:', err?.message ?? err);
  console.error('Tip: Переконайтеся що MONGO_URI встановлено на Railway і MongoDB Atlas дозволяє з\'єднання з 0.0.0.0/0');
  process.exit(1);
});
