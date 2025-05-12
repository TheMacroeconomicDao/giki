# AppProvider

## Обзор

`AppProvider` - композитный провайдер, объединяющий все провайдеры приложения в одну точку входа.

## Статус миграции

| Компонент     | Прогресс | Статус                  |
|---------------|----------|-------------------------|
| AppProvider   | 50%      | 🔄 В процессе          |

## Компоненты

### app/providers/AppProvider.tsx
- ✅ `AppProvider`: Основной компонент композитного провайдера
- 🔄 Интеграция с ThemeProvider
- ⬜ Интеграция с AuthProvider
- ⬜ Интеграция с SettingsProvider
- ⬜ Интеграция с QueryProvider
- ⬜ Интеграция с ToastProvider

```typescript
// Пример использования
import { AppProvider } from '@/app/providers';

const RootLayout = ({ children }) => {
  return (
    <html lang="ru">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
};
```

## Интеграция

AppProvider интегрирован с:
- ThemeProvider для управления темой
- (Будущие интеграции с другими провайдерами)

## Дальнейшие задачи

1. ⬜ Интеграция с AuthProvider
2. ⬜ Интеграция с SettingsProvider
3. ⬜ Интеграция с QueryProvider
4. ⬜ Интеграция с ToastProvider 