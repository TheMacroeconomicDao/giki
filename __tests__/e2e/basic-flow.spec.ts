import { test, expect } from '@playwright/test';

test.describe('Базовый поток использования', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на домашнюю страницу
    await page.goto('/');
  });

  test('должен отображать домашнюю страницу и главные компоненты', async ({ page }) => {
    // Проверяем заголовок страницы
    await expect(page).toHaveTitle(/Giki/);
    
    // Проверяем наличие основных компонентов
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByRole('heading', { name: /recent pages/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /popular pages/i })).toBeVisible();
  });

  test('должен открывать страницу создания и создавать новую страницу', async ({ page }) => {
    // Аутентификация (в тестовом окружении может быть упрощенная)
    await page.locator('button:has-text("Connect Wallet")').click();
    await page.locator('button:has-text("Test Wallet")').click(); // Предполагаем наличие тестового кошелька
    
    // Переходим на страницу создания
    await page.getByRole('link', { name: /create page/i }).click();
    
    // Проверяем, что мы на странице создания
    await expect(page.url()).toContain('/create');
    
    // Заполняем форму
    await page.getByLabel('Title').fill('Тестовая E2E страница');
    
    // Переключаемся на вкладку редактора и вводим содержимое
    await page.locator('div[role="tablist"]').getByRole('tab', { name: /write/i }).click();
    await page.locator('textarea').fill('# Заголовок тестовой страницы\n\nЭто содержимое тестовой страницы, созданной через E2E тест.');
    
    // Проверяем предпросмотр
    await page.locator('div[role="tablist"]').getByRole('tab', { name: /preview/i }).click();
    await expect(page.getByRole('heading', { name: 'Заголовок тестовой страницы' })).toBeVisible();
    
    // Устанавливаем видимость и сохраняем
    await page.locator('select').selectOption('public');
    await page.getByRole('button', { name: /save/i }).click();
    
    // Проверяем, что страница создана и мы перенаправлены на нее
    await expect(page.url()).toMatch(/\/pages\/[a-zA-Z0-9-]+/);
    await expect(page.getByRole('heading', { name: 'Тестовая E2E страница' })).toBeVisible();
  });

  test('должен искать страницы и открывать результаты', async ({ page }) => {
    // Вводим текст в поле поиска
    await page.getByPlaceholder(/search/i).fill('тестовая');
    await page.keyboard.press('Enter');
    
    // Проверяем, что мы на странице результатов поиска
    await expect(page.url()).toContain('/search');
    
    // Должен показать результаты
    await expect(page.getByText(/search results/i)).toBeVisible();
    
    // Кликаем на первый результат
    await page.locator('.search-results a').first().click();
    
    // Проверяем, что открылась страница
    await expect(page.url()).toMatch(/\/pages\/[a-zA-Z0-9-]+/);
  });

  test('должен корректно отображать страницу и навигацию по истории версий', async ({ page }) => {
    // Предполагаем, что у нас есть страница с историей версий
    // Переходим на существующую страницу (например, созданную в предыдущем тесте)
    await page.goto('/pages');
    await page.locator('.pages-list a').first().click();
    
    // Проверяем основные элементы страницы
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('.page-content')).toBeVisible();
    
    // Проверяем информацию об авторе
    await expect(page.locator('.page-metadata')).toContainText(/created by/i);
    
    // Проверяем наличие кнопки истории версий и нажимаем на нее
    await page.getByRole('button', { name: /history/i }).click();
    
    // Проверяем, что отображается история версий
    await expect(page.locator('.version-history')).toBeVisible();
    
    // Выбираем первую версию из истории
    await page.locator('.version-item').first().click();
    
    // Должна отобразиться выбранная версия
    await expect(page.locator('.version-preview')).toBeVisible();
  });

  test('должен обновлять страницу и проверять изменения', async ({ page }) => {
    // Переходим на страницу и авторизуемся
    await page.goto('/pages');
    await page.locator('.pages-list a').first().click();
    
    if (!await page.getByText(/edit/i).isVisible()) {
      // Если кнопка Edit не видна, нужно авторизоваться
      await page.getByRole('button', { name: /connect wallet/i }).click();
      await page.getByRole('button', { name: /test wallet/i }).click();
    }
    
    // Нажимаем на кнопку редактирования
    await page.getByRole('button', { name: /edit/i }).click();
    
    // Изменяем заголовок
    await page.getByLabel('Title').fill('Обновленная E2E страница');
    
    // Изменяем содержимое
    await page.locator('div[role="tablist"]').getByRole('tab', { name: /write/i }).click();
    const currentContent = await page.locator('textarea').inputValue();
    await page.locator('textarea').fill(currentContent + '\n\nДобавлено через E2E тест.');
    
    // Сохраняем изменения
    await page.getByRole('button', { name: /save/i }).click();
    
    // Проверяем, что изменения сохранены
    await expect(page.getByRole('heading', { name: 'Обновленная E2E страница' })).toBeVisible();
    await expect(page.locator('.page-content')).toContainText('Добавлено через E2E тест');
  });
}); 