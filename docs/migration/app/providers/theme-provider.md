# ThemeProvider

## Обзор

`ThemeProvider` - провайдер для управления темой приложения (светлая, темная, системная).

## Статус миграции

| Компонент     | Прогресс | Статус                  |
|---------------|----------|-------------------------|
| ThemeProvider | 100%     | ✅ Завершено           |
| useAppTheme   | 100%     | ✅ Завершено           |

## Компоненты

### app/providers/theme/ThemeProvider.tsx
- ✅ `ThemeProvider`: Основной компонент провайдера темы
- ✅ `useAppTheme`: Хук для доступа к теме в компонентах

```typescript
// Пример использования
import { useAppTheme } from '@/app/providers/theme';

const MyComponent = () => {
  const { theme, setTheme, isDarkTheme } = useAppTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Переключить тему
    </button>
  );
};
```

## Интеграция

ThemeProvider интегрирован с:
- next-themes для управления темой в Next.js
- Настройками пользователя (будет реализовано)

## Дальнейшие задачи

1. ⬜ Интеграция с настройками пользователя
2. ⬜ Добавление поддержки пользовательских тем 