# Миграция провайдеров приложения

## Обзор

Слой `app/providers` содержит провайдеры контекста для приложения, обеспечивающие глобальный доступ к состоянию, настройкам и API.

## Прогресс миграции

| Провайдер      | Прогресс | Статус            |
|----------------|----------|-------------------|
| ThemeProvider  | 100%     | ✅ Завершено      |
| AuthProvider   | 100%     | ✅ Завершено      |
| AppProvider    | 50%      | 🔄 В процессе     |
| SettingsProvider | 0%     | ⬜ Не начато      |
| QueryProvider  | 0%       | ⬜ Не начато      |
| ToastProvider  | 0%       | ⬜ Не начато      |

## Содержимое слоя

### app/providers/theme
- ✅ [ThemeProvider](./theme-provider.md)
  - ✅ Управление темой (светлая/темная/системная)
  - ✅ Хук useAppTheme для доступа к теме

### app/providers/auth
- ✅ [AuthProvider](./auth-provider.md)
  - ✅ Управление аутентификацией
  - ✅ Интеграция с Web3

### app/providers/AppProvider
- 🔄 [Композитный провайдер](./app-provider.md)
  - 🔄 Объединение всех провайдеров
  - ⬜ Полная интеграция всех провайдеров

### app/providers/settings
- ⬜ [SettingsProvider](./settings-provider.md)
  - ⬜ Управление настройками пользователя и системы

### app/providers/query
- ⬜ [QueryProvider](./query-provider.md)
  - ⬜ Управление запросами (React Query)

### app/providers/toast
- ⬜ [ToastProvider](./toast-provider.md)
  - ⬜ Система уведомлений

## Принципы реализации

1. Провайдеры предоставляют данные и API через контексты React
2. Провайдеры создают абстракцию над внешними сервисами
3. Каждый провайдер имеет соответствующий хук для удобного доступа
4. Композитный провайдер объединяет все провайдеры в одну точку входа

## Дальнейшие задачи

- ✅ Реализовать ThemeProvider
- ✅ Реализовать AuthProvider
- 🔄 Доработать AppProvider
- ⬜ Реализовать SettingsProvider
- ⬜ Реализовать QueryProvider
- ⬜ Реализовать ToastProvider 