# Миграция слоя entities

## Обзор

Слой `entities` содержит бизнес-сущности приложения, их модели данных, API для работы с ними и связанные UI компоненты.
Данный слой зависит только от слоя `shared` и не имеет зависимостей от других слоев.

## Прогресс миграции

| Сущность | Прогресс | Статус                                  |
|----------|----------|------------------------------------------|
| User     | 100%     | ✅ Все компоненты реализованы             |
| Page     | 100%     | ✅ Все компоненты реализованы             |
| Version  | 100%     | ✅ Все компоненты реализованы             |
| Translation | 100%  | ✅ Все компоненты реализованы             |
| Settings | 100%     | ✅ Все компоненты реализованы             |

## Содержимое слоя

### entities/user
- ✅ [Компоненты пользователя](./user.md)
  - ✅ Модель (types.ts, store.ts)
  - ✅ API (userApi.ts)
  - ✅ UI-компоненты (UserAvatar, UserInfo, UserBadge, UserCard, UserList)

### entities/page
- ✅ [Компоненты страницы](./page.md)
  - ✅ Модель (types.ts, store.ts)
  - ✅ API (pageApi.ts)
  - ✅ UI-компоненты (PageCard, PageInfo, PageContent, PageTitle, PageStats)

### entities/version
- ✅ [Компоненты версии страницы](./page-version.md)
  - ✅ Модель (types.ts, store.ts)
  - ✅ API (versionApi.ts)
  - ✅ UI-компоненты (VersionCard, VersionDiff, VersionInfo)

### entities/translation
- ✅ [Компоненты перевода](./translation.md)
  - ✅ Модель (types.ts, store.ts)
  - ✅ API (translationApi.ts)
  - ✅ UI-компоненты (TranslationSelector, TranslationBadge)

### entities/settings
- ✅ [Компоненты настроек](./settings.md)
  - ✅ Модель (types.ts, store.ts)
  - ✅ API (settingsApi.ts)
  - ✅ UI-компоненты (SettingsCard, SettingsSection)

## Принципы реализации

1. Каждая сущность находится в отдельной директории
2. Состояние сущностей управляется с помощью Zustand
3. API-клиенты используют React Query для кеширования и управления состоянием запросов
4. UI-компоненты представляют данные сущности без бизнес-логики

## Дальнейшие задачи

- ✅ Завершить перенос сущности User
- ✅ Реализовать сущность Page полностью
- ✅ Реализовать сущность Version полностью
- ✅ Реализовать сущность Translation полностью
- ✅ Реализовать сущность Settings
- ⬜ Обеспечить связь между сущностями через модели 