import { test, expect } from '@playwright/test';

test.describe('Процесс аутентификации', () => {
  test.beforeEach(async ({ page }) => {
    // Переходим на домашнюю страницу
    await page.goto('/');
  });

  test('должен отображать различные опции кошельков', async ({ page }) => {
    // Нажимаем на кнопку Connect Wallet
    await page.getByRole('button', { name: /connect wallet/i }).click();
    
    // Проверяем, что отображается модальное окно с опциями кошельков
    await expect(page.locator('.wallet-modal')).toBeVisible();
    
    // Проверяем наличие нескольких опций кошельков
    await expect(page.locator('.wallet-option')).toHaveCount({ gte: 2 });
    
    // Должны быть как минимум тестовый кошелек
    await expect(page.getByText(/test wallet/i)).toBeVisible();
  });

  test('должен успешно авторизоваться с тестовым кошельком', async ({ page }) => {
    // Нажимаем на кнопку Connect Wallet
    await page.getByRole('button', { name: /connect wallet/i }).click();
    
    // Выбираем тестовый кошелек
    await page.getByRole('button', { name: /test wallet/i }).click();
    
    // Должно произойти подключение
    await expect(page.locator('.user-profile')).toBeVisible();
    
    // Должен отображаться адрес кошелька (сокращенный)
    await expect(page.locator('.wallet-address')).toContainText(/0x/);
    
    // Должны появиться дополнительные опции для авторизованных пользователей
    await expect(page.getByRole('link', { name: /create page/i })).toBeVisible();
  });

  test('должен корректно обрабатывать отклоненную авторизацию', async ({ page }) => {
    // Нажимаем на кнопку Connect Wallet
    await page.getByRole('button', { name: /connect wallet/i }).click();
    
    // Выбираем опцию "Reject" (отказ от подключения)
    await page.getByRole('button', { name: /reject wallet/i }).click();
    
    // Должно отобразиться сообщение об ошибке
    await expect(page.locator('.error-toast')).toBeVisible();
    await expect(page.locator('.error-toast')).toContainText(/connection rejected/i);
    
    // Мы должны остаться не авторизованными
    await expect(page.getByRole('button', { name: /connect wallet/i })).toBeVisible();
  });

  test('должен успешно отключать кошелек', async ({ page }) => {
    // Сначала подключаемся
    await page.getByRole('button', { name: /connect wallet/i }).click();
    await page.getByRole('button', { name: /test wallet/i }).click();
    
    // Проверяем, что подключение прошло успешно
    await expect(page.locator('.user-profile')).toBeVisible();
    
    // Открываем меню пользователя
    await page.locator('.user-profile').click();
    
    // Нажимаем на опцию Disconnect
    await page.getByRole('menuitem', { name: /disconnect/i }).click();
    
    // Мы должны увидеть кнопку подключения кошелька снова
    await expect(page.getByRole('button', { name: /connect wallet/i })).toBeVisible();
  });

  test('должен блокировать доступ к страницам только для авторизованных пользователей', async ({ page }) => {
    // Пытаемся перейти на страницу создания без авторизации
    await page.goto('/create');
    
    // Должны увидеть сообщение о необходимости авторизации
    await expect(page.getByText(/please connect your wallet/i)).toBeVisible();
    
    // Теперь авторизуемся
    await page.getByRole('button', { name: /connect wallet/i }).click();
    await page.getByRole('button', { name: /test wallet/i }).click();
    
    // После авторизации должны увидеть форму создания страницы
    await expect(page.getByLabel('Title')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('должен сохранять состояние авторизации между страницами', async ({ page }) => {
    // Авторизуемся
    await page.getByRole('button', { name: /connect wallet/i }).click();
    await page.getByRole('button', { name: /test wallet/i }).click();
    
    // Проверяем авторизацию
    await expect(page.locator('.user-profile')).toBeVisible();
    
    // Переходим на другую страницу
    await page.goto('/pages');
    
    // Должны остаться авторизованными
    await expect(page.locator('.user-profile')).toBeVisible();
    
    // Перезагружаем страницу
    await page.reload();
    
    // Все еще должны быть авторизованы (в тестовом окружении)
    await expect(page.locator('.user-profile')).toBeVisible();
  });
}); 