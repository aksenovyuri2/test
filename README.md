# Product Metrics Learning Platform

Интерактивная платформа для изучения продукт-маркетинговых метрик с практическими примерами и тестами.

## Описание

Платформа предоставляет:
- Интерактивные дашборды с реальными данными
- Подробные описания метрик и их применения
- Систему тестирования знаний
- Фильтрацию и анализ данных
- Систему авторизации пользователей

## Установка

```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
```

## Использование

```bash
# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

## Функциональность

- Авторизация и управление пользователями
- Интерактивные дашборды с годовыми данными
- Система фильтрации и анализа данных
- Тестирование знаний по метрикам
- Адаптивный дизайн
- Темная/светлая тема

## Технологии

- React.js
- Next.js
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL
- NextAuth.js
- Chart.js
- Jest (тестирование)

## Структура проекта

```
src/
├── components/     # React компоненты
├── pages/         # Страницы приложения
├── styles/        # Стили
├── lib/           # Утилиты и хелперы
├── prisma/        # Схема базы данных
└── tests/         # Тесты
```

## Экспорт заметок из Granola

Скрипт `scripts/granola-export.mjs` выгружает все заметки из Granola через
официальный Public API (`https://public-api.granola.ai/v1`). Нужен API-токен
вида `grn_...` (Settings → Workspace → API access в Granola, тариф Business+).

```bash
# токен берётся из переменной окружения (см. .env.example)
export GRANOLA_API_TOKEN="grn_..."

# выгрузка всех заметок + транскриптов в ./granola-export/
node scripts/granola-export.mjs

# опции
node scripts/granola-export.mjs --out ./dump --no-transcripts --no-markdown
```

Результат: `granola-export/notes.json` (полный дамп) и по `.md`-файлу на каждую
заметку. Каталог `granola-export/` добавлен в `.gitignore` — заметки приватные.
API возвращает только заметки с готовым AI-саммари и транскриптом.

## Лицензия

MIT

## Автор

Ваше имя