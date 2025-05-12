# Индекс миграции на Feature-Sliced Design

Этот файл содержит ссылки на все разделы документации по миграции проекта на архитектуру Feature-Sliced Design.

## Основная документация
- [Обзор и стратегия миграции](./README.md)
- [Детальный план (архив)](./LEGACY_PLAN.md)

## Инфраструктура
- [Настройка и конфигурация](./infrastructure.md)

## Слои архитектуры

### Shared
- [Обзор слоя shared](./shared/README.md)
- [Библиотеки и утилиты](./shared/libraries.md)
- [UI-компоненты](./shared/ui-components.md)

### Entities
- [Обзор слоя entities](./entities/README.md)
- [Сущность User](./entities/user.md)
- [Сущность Page](./entities/page.md)
- [Сущность Page-Version](./entities/page-version.md)
- [Сущность Translation](./entities/translation.md)
- [Сущность Settings](./entities/settings.md)

### Features
- [Обзор слоя features](./features/README.md)
- [Аутентификация и авторизация](./features/auth.md)
- [Работа со страницами](./features/page.md)
- [Поиск](./features/search.md)

### Widgets
- [Обзор слоя widgets](./widgets/README.md)

### Pages
- [Обзор слоя pages](./pages/README.md)

### App
- [Обзор слоя app](./app/README.md)

## Интеграция и внедрение
- [API роуты](./integration/api-routes.md)
- [Тестирование](./testing/README.md)
- [Внедрение и переключение](./integration/deployment.md)

## Обновление статуса миграции

Для обновления статуса миграции внесите изменения в соответствующий файл раздела, а затем обновите [общий прогресс](./README.md).

Для создания новых задач или изменения статуса используйте следующие маркеры:
- ⬜ Не начато
- 🔄 В процессе
- ✅ Завершено 