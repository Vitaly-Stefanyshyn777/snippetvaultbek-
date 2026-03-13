import { Controller, Get } from '@nestjs/common';

/**
 * Root routes без /api prefix — для Railway health check.
 * Railway за замовчуванням перевіряє GET /; якщо отримує 404 → 502.
 */
@Controller()
export class RootController {
  @Get()
  root(): { status: string } {
    return { status: 'ok' };
  }
}
