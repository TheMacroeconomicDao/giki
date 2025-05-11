import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RecentPages } from '@/components/recent-pages';

// Мокаем глобальный fetch
global.fetch = jest.fn();

describe('RecentPages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 200))
    );
    
    render(<RecentPages />);
    
    // Проверяем наличие состояния загрузки
    expect(screen.getAllByClassName('animate-pulse').length).toBeGreaterThan(0);
  });

  it('displays error message when API request fails', async () => {
    // Мокаем неудачный запрос
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Failed to fetch' }),
      })
    );
    
    render(<RecentPages />);
    
    // Ждем появления сообщения об ошибке
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch recent pages/i)).toBeInTheDocument();
    });
  });

  it('displays message when no pages are found', async () => {
    // Мокаем пустой ответ
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { pages: [] } }),
      })
    );
    
    render(<RecentPages />);
    
    // Ждем появления сообщения о пустом результате
    await waitFor(() => {
      expect(screen.getByText(/no pages found/i)).toBeInTheDocument();
    });
  });

  it('renders pages when data is loaded successfully', async () => {
    // Мокаем успешный ответ с тестовыми данными
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            pages: [
              {
                id: 'page-1',
                title: 'Test Page 1',
                content: 'This is test content for page 1',
                visibility: 'public',
                author: { id: 'user-1', name: 'Test User', address: '0x123' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 10,
              },
              {
                id: 'page-2',
                title: 'Test Page 2',
                content: 'This is test content for page 2',
                visibility: 'community',
                author: { id: 'user-2', name: null, address: '0x456' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 5,
              },
            ],
          },
        }),
      })
    );
    
    render(<RecentPages />);
    
    // Ждем загрузки страниц
    await waitFor(() => {
      expect(screen.getByText('Test Page 1')).toBeInTheDocument();
      expect(screen.getByText('Test Page 2')).toBeInTheDocument();
    });
    
    // Проверяем отображение описания на основе содержимого
    expect(screen.getByText(/this is test content for page 1/i)).toBeInTheDocument();
    
    // Проверяем отображение иконок в зависимости от видимости страницы
    expect(screen.getAllByLucideGlobe.length || 0).toBe(1);
    expect(screen.getAllByLucideUsers.length || 0).toBe(1);
  });

  it('handles pages with null author names', async () => {
    // Мокаем страницу с null в поле имени автора
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            pages: [
              {
                id: 'page-3',
                title: 'Test Page 3',
                content: 'Test content 3',
                visibility: 'public',
                author: { id: 'user-3', name: null, address: '0x789' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 15,
              },
            ],
          },
        }),
      })
    );
    
    render(<RecentPages />);
    
    // Проверяем, что страница отображается с адресом вместо имени
    await waitFor(() => {
      expect(screen.getByText('Test Page 3')).toBeInTheDocument();
      expect(screen.getByText('0x789')).toBeInTheDocument();
    });
  });

  it('makes the correct API request', async () => {
    // Мокаем успешный ответ
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { pages: [] } }),
      })
    );
    
    render(<RecentPages />);
    
    // Проверяем, что API вызван с правильными параметрами
    expect(global.fetch).toHaveBeenCalledWith('/api/pages?limit=4');
  });
}); 