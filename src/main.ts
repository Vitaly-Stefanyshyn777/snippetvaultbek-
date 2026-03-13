import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // same-origin
      const allowed = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
      if (!allowed?.length) return cb(null, true); // dev: allow all
      if (allowed.includes(origin)) return cb(null, true);
      // Vercel: *.vercel.app та піддомени (наприклад xxx-yyy.vercel.app)
      if (/^https:\/\/[^.]+\.vercel\.app$/.test(origin)) return cb(null, true);
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
      cb(null, false);
    },
  });
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
  // '0.0.0.0' потрібно для Railway/Docker — інакше не приймаються зовнішні запити
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Snippet Vault API available at http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('❌ Startup failed:', err);
  process.exit(1);
});
