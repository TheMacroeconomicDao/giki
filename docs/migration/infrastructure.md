# Инфраструктура и конфигурация

## Подготовка инфраструктуры для миграции

### Настройка директорий и конфигурации
- ✅ Создание базовой структуры директорий FSD в `/src`
- ⬜ Обновление tsconfig.json с поддержкой новых путей:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"],
        "@shared/*": ["./src/shared/*"],
        "@entities/*": ["./src/entities/*"],
        "@features/*": ["./src/features/*"],
        "@widgets/*": ["./src/widgets/*"],
        "@pages/*": ["./src/pages/*"],
        "@app/*": ["./src/app/*"]
      }
    }
  }
  ```
- ⬜ Создание src/app/index.tsx с ре-экспортом провайдеров

### Настройка зависимостей и инструментов
- ✅ Установка Zustand для управления состоянием
- ✅ Установка React Query для работы с сервером
- ✅ Установка Zod для валидации данных
- ⬜ Создание утилит для тестирования FSD-модулей
- ⬜ Обновление ESLint для поддержки слоевой архитектуры

## Последующие шаги

После завершения настройки инфраструктуры необходимо:

1. Завершить конфигурацию путей импорта в tsconfig.json
2. Создать базовые типы и константы для проекта
3. Разработать соглашения по именованию и структуре модулей
4. Создать примеры и шаблоны для каждого слоя FSD

## Ответственные

- Конфигурация TypeScript: @tech-lead
- Настройка тестового окружения: @test-engineer
- Обновление ESLint: @frontend-developer 