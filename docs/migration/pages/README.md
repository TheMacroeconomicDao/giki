# Миграция слоя pages

## Обзор

Слой `pages` содержит компоненты страниц приложения, которые композиционно объединяют виджеты, сущности и функциональности в полноценные страницы.

## Прогресс миграции

| Страница       | Прогресс | Статус            |
|----------------|----------|-------------------|
| home-page      | 0%       | ⬜ Не начато      |
| page-view      | 0%       | ⬜ Не начато      |
| page-edit      | 0%       | ⬜ Не начато      |
| user-profile   | 0%       | ⬜ Не начато      |
| settings-page  | 0%       | ⬜ Не начато      |

## Содержимое слоя

### pages/home-page
- ⬜ [Главная страница](./home-page.md)
  - ⬜ Композиция виджетов
  - ⬜ Состояние страницы
  - ⬜ Загрузка данных

### pages/page-view
- ⬜ [Страница просмотра](./page-view.md)
  - ⬜ Композиция виджетов
  - ⬜ Интеграция с entities/page, version, translation

### pages/page-edit
- ⬜ [Страница редактирования](./page-edit.md)
  - ⬜ Композиция виджетов
  - ⬜ Интеграция с функциональностями редактирования

### pages/user-profile
- ⬜ [Профиль пользователя](./user-profile.md)
  - ⬜ Композиция виджетов
  - ⬜ Интеграция с entities/user

### pages/settings-page
- ⬜ [Страница настроек](./settings-page.md)
  - ⬜ Композиция виджетов
  - ⬜ Интеграция с entities/settings

## Принципы реализации

1. Страницы компонуются из виджетов и функциональностей
2. Страницы отвечают за загрузку необходимых данных
3. Страницы маршрутизируются через Next.js App Router
4. Бизнес-логика выносится в соответствующие сущности и функциональности

## Дальнейшие задачи

- ⬜ Реализация home-page
- ⬜ Реализация page-view
- ⬜ Реализация page-edit
- ⬜ Реализация user-profile
- ⬜ Реализация settings-page 