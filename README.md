# Mini Snippet Vault — Backend

**Опис:** NestJS API для збереження коротких фрагментів (посилання/нотатки/команди) з тегами, пошуком, пагінацією та типами (`link`, `note`, `command`). API зберігає `createdAt`/`updatedAt`, має DTO-валидацію, текстовий індекс, обробку 400/404 та відповідає on acceptance criteria.

## Стек
- NestJS + Mongoose + class-validator
- MongoDB з text-індексом по `title`/`content`
- TypeScript (strict)

## Локальний запуск
```bash
cp .env.example .env
pnpm install
pnpm run start:dev
```
- Сервер слухає `PORT` (за замовчуванням 4000) і ставить глобальний префікс `/api`.
- Валидні DTO через `ValidationPipe`, заборона невідомих полів (`forbidNonWhitelisted`).

### Продукційний режим
```bash
pnpm run build
PORT=4000 pnpm run start:prod
```

## Змінні оточення
| Змінна | Опис |
| --- | --- |
| `PORT` | Порт для прослуховування (за замовчуванням 4000) |
| `MONGO_URI` | URI MongoDB (використовується також для text-index). **Обов'язково для Railway!** |
| `CORS_ORIGIN` | Опційно: дозволені origins через кому, напр. `https://minisnippetvaultfront-epqy.vercel.app` |

## Railway (502 / CORS)

Якщо API повертає **502 Bad Gateway** і CORS-помилки:
1. **MONGO_URI** — обов'язково встановіть в Railway → Variables. Формат: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
2. **MongoDB Atlas** — Network Access → Add IP → `0.0.0.0/0` (дозволити з будь-якого IP, потрібно для Railway)
3. **Логи** — Railway → Deployments → View Logs. Шукайте `❌ Startup failed` або `MONGO_URI: ✗ NOT SET`
4. **Health check** — `GET /api/health` або `GET /api` має повертати OK, якщо сервер запущений

## API приклади
- **GET** `/api/snippets?page=1&limit=10&q=tailwind&tag=frontend` — список зі пошуком по `title`/`content`, фільтрація по тегу, пагінація.
- **POST** `/api/snippets` — створення, тіло:
  ```json
  {
    "title": "Useful curl",
    "content": "curl http://example",
    "type": "command",
    "tags": ["http", "curl"]
  }
  ```
- **GET** `/api/snippets/:id` — деталі з `createdAt`/`updatedAt`.
- **PATCH** `/api/snippets/:id` — оновлення (можна змінити `tags`, `type`, `title`, `content`).
- **DELETE** `/api/snippets/:id` — видалення.

### Приклад curl для перевірки
```bash
curl -X POST http://localhost:4000/api/snippets \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"Test","type":"note"}'

curl http://localhost:4000/api/snippets?q=note
```

## Перевірка
1. Створити шматок через POST і переконатися, що він повертається в GET `/api/snippets`.
2. Викликати `/api/snippets?q=...` і `/api/snippets?tag=...` — переконатися, що обидва параметри працюють.
3. Оновити і видалити через PATCH/DELETE — переконайтеся, що сервіс повертає 404 для неіснуючого `id`.

## UX фронтенду (інша репозиторія)
Докладні вимоги до Next.js + Tailwind UI описані у `FRONTEND.md`. Фронтенд має використовувати `NEXT_PUBLIC_API_URL` для звернень до цього API, реалізувати пошук/фільтрацію/пагінацію, сторінку деталей, форми з базовою валідацією та стани loading/empty/error.
