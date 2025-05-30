# Миграция слоя features

## Обзор

Слой `features` содержит функциональности приложения, которые реализуют пользовательские сценарии.
Каждая фича может использовать любое количество сущностей (`entities`) и компонентов из `shared`, но не может зависеть от других слоев.

## Прогресс миграции

| Функциональность | Прогресс | Статус                                  |
|------------------|----------|------------------------------------------|
| Auth             | 100%     | ✅ Завершено                              |
| Page (Create)    | 0%       | ⬜ Не начато                             |
| Page (Edit)      | 0%       | ⬜ Не начато                             |
| Page (Delete)    | 0%       | ⬜ Не начато                             |
| Page (Translate) | 0%       | ⬜ Не начато                             |
| Search           | 0%       | ⬜ Не начато                             |

## Содержимое слоя

### features/auth
- ✅ [Аутентификация и авторизация](./auth.md)
  - ✅ Модель (types.ts, store.ts)
  - ✅ API (authApi.ts)
  - ✅ UI-компоненты (Web3Connect, SignMessage, AuthStatus)

### features/page
- ⬜ [Работа со страницами](./page.md)
  - ⬜ Создание страниц (`features/page/create`)
  - ⬜ Редактирование страниц (`features/page/edit`)
  - ⬜ Удаление страниц (`features/page/delete`)
  - ⬜ Перевод страниц (`features/page/translate`)

### features/search
- ⬜ [Поиск](./search.md)
  - ⬜ Модель (types.ts, store.ts)
  - ⬜ UI-компоненты (SearchForm, SearchFilters, SearchSuggestions)

## Принципы реализации

1. Каждая функциональность находится в отдельной директории
2. Состояние управляется с помощью Zustand
3. Бизнес-логика отделена от UI-компонентов
4. Взаимодействие с API выполняется через React Query
5. Фичи используют сущности из слоя `entities`, но не зависят от них структурно

## Дальнейшие задачи

- ✅ Завершить миграцию компонентов аутентификации
- ⬜ Начать миграцию функциональности создания и редактирования страниц
- ⬜ Реализовать базовый поисковый функционал 