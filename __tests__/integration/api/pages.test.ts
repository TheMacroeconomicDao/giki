import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fetch from 'node-fetch';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000/api';
let authToken: string;

describe('Pages API интеграционный тест', () => {
  // ID тестовой страницы для использования в тестах
  let testPageId: string;

  beforeAll(async () => {
    // Очищаем тестовую БД перед запуском тестов
    await db.execute(sql`TRUNCATE TABLE pages CASCADE`);
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);

    // Создаем тестового пользователя и получаем токен
    const userResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: '0xTestAddress123',
        name: 'Test User',
        signature: 'test_signature', // В тестовом окружении можно использовать фиктивную подпись
      }),
    });

    const userData = await userResponse.json();
    authToken = userData.data.token;
  });

  afterAll(async () => {
    // Очищаем данные после завершения тестов
    await db.execute(sql`TRUNCATE TABLE pages CASCADE`);
    await db.execute(sql`TRUNCATE TABLE users CASCADE`);
  });

  it('должен создавать новую страницу', async () => {
    const response = await fetch(`${API_URL}/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'Тестовая страница',
        content: '# Тестовый контент\n\nЭто тестовая страница.',
        visibility: 'public',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.page).toHaveProperty('id');
    expect(data.data.page.title).toBe('Тестовая страница');

    // Сохраняем ID страницы для последующих тестов
    testPageId = data.data.page.id;
  });

  it('должен получать список страниц', async () => {
    const response = await fetch(`${API_URL}/pages`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('pages');
    expect(Array.isArray(data.data.pages)).toBe(true);
    expect(data.data.pages.length).toBeGreaterThan(0);
  });

  it('должен получать страницу по ID', async () => {
    const response = await fetch(`${API_URL}/pages/${testPageId}`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('page');
    expect(data.data.page.id).toBe(testPageId);
    expect(data.data.page.title).toBe('Тестовая страница');
  });

  it('должен обновлять страницу', async () => {
    const response = await fetch(`${API_URL}/pages/${testPageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'Обновленная страница',
        content: '# Обновленный контент\n\nЭта страница была обновлена.',
        visibility: 'public',
      }),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.page.title).toBe('Обновленная страница');
  });

  it('должен отклонять обновление при отсутствии авторизации', async () => {
    const response = await fetch(`${API_URL}/pages/${testPageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Не передаем токен авторизации
      },
      body: JSON.stringify({
        title: 'Неавторизованное обновление',
        content: 'Этот контент не должен быть сохранен',
        visibility: 'public',
      }),
    });

    expect(response.status).toBe(401);
  });

  it('должен увеличивать счетчик просмотров', async () => {
    // Сначала получаем текущее количество просмотров
    const initialResponse = await fetch(`${API_URL}/pages/${testPageId}`);
    const initialData = await initialResponse.json();
    const initialViews = initialData.data.page.views;

    // Отправляем запрос на регистрацию просмотра
    const viewResponse = await fetch(`${API_URL}/pages/${testPageId}/view`, {
      method: 'POST',
    });
    expect(viewResponse.status).toBe(200);

    // Получаем обновленные данные страницы
    const updatedResponse = await fetch(`${API_URL}/pages/${testPageId}`);
    const updatedData = await updatedResponse.json();
    
    // Проверяем, что счетчик просмотров увеличился
    expect(updatedData.data.page.views).toBe(initialViews + 1);
  });

  it('должен удалять страницу', async () => {
    const response = await fetch(`${API_URL}/pages/${testPageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);
    
    // Проверяем, что страница действительно удалена
    const checkResponse = await fetch(`${API_URL}/pages/${testPageId}`);
    expect(checkResponse.status).toBe(404);
  });
}); 