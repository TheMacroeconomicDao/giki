import { describe, expect, it, beforeAll } from 'vitest';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';

const API_URL = process.env.TEST_API_URL || 'http://localhost:3000/api';
let authToken: string;

// Получаем директорию текущего файла
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Upload API интеграционный тест', () => {
  beforeAll(async () => {
    // Получаем токен аутентификации
    const userResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: '0xTestUploadUser123',
        name: 'Upload Test User',
        signature: 'test_signature',
      }),
    });

    const userData = await userResponse.json();
    authToken = userData.data.token;
    
    // Создаем директорию для тестовых файлов если её нет
    const testFilesDir = path.join(__dirname, '../../../../test-files');
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
    
    // Создаем тестовое изображение если его нет
    const testImagePath = path.join(testFilesDir, 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
      // Создаем простое изображение JPEG
      const buffer = Buffer.from([
        0xff, 0xd8, // SOI маркер
        0xff, 0xe0, 0x00, 0x10, 'J', 'F', 'I', 'F', 0x00, 0x01, 0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, // JFIF заголовок
        0xff, 0xdb, 0x00, 0x43, 0x00, // DQT маркер
        // Заполняем таблицу квантования (упрощенно)
        ...Array(64).fill(0x01),
        0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01, 0x00, 0x01, 0x03, 0x01, 0x22, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, // SOF маркер
        0xff, 0xda, 0x00, 0x0c, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, // SOS маркер
        0x0f, // Данные изображения (минимальные)
        0xff, 0xd9 // EOI маркер
      ]);
      fs.writeFileSync(testImagePath, buffer);
    }
  });

  it('должен загружать файл изображения', async () => {
    const form = new FormData();
    const testImagePath = path.join(__dirname, '../../../../test-files/test-image.jpg');
    const fileStream = fs.createReadStream(testImagePath);
    
    form.append('file', fileStream, {
      filename: 'test-upload.jpg',
      contentType: 'image/jpeg',
    });

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('url');
    expect(data.data.url).toMatch(/\/uploads\/[a-zA-Z0-9-]+\.jpg/);

    // Проверяем, что файл действительно доступен по URL
    const uploadedFileResponse = await fetch(`http://localhost:3000${data.data.url}`);
    expect(uploadedFileResponse.status).toBe(200);
  });

  it('должен отклонять не-изображения', async () => {
    // Создаем тестовый текстовый файл
    const testFilePath = path.join(__dirname, '../../../../test-files/test-file.txt');
    fs.writeFileSync(testFilePath, 'Это текстовый файл, не изображение');
    
    const form = new FormData();
    const fileStream = fs.createReadStream(testFilePath);
    
    form.append('file', fileStream, {
      filename: 'test-file.txt',
      contentType: 'text/plain',
    });

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/only image files are allowed/i);
  });

  it('должен отклонять запросы без авторизации', async () => {
    const form = new FormData();
    const testImagePath = path.join(__dirname, '../../../../test-files/test-image.jpg');
    const fileStream = fs.createReadStream(testImagePath);
    
    form.append('file', fileStream, {
      filename: 'test-upload-no-auth.jpg',
      contentType: 'image/jpeg',
    });

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
        // Не передаем токен авторизации
      },
      body: form,
    });

    expect(response.status).toBe(401);
  });

  it('должен отклонять запросы без файла', async () => {
    const form = new FormData();
    // Не добавляем файл в форму

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/no file provided/i);
  });
}); 