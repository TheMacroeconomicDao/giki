import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PopularPages } from '@/components/popular-pages';

// Мокаем глобальный fetch
global.fetch = jest.fn();

describe('PopularPages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 200))
    );
    
    render(<PopularPages />);
    
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
    
    render(<PopularPages />);
    
    // Ждем появления сообщения об ошибке
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch popular pages/i)).toBeInTheDocument();
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
    
    render(<PopularPages />);
    
    // Ждем появления сообщения о пустом результате
    await waitFor(() => {
      expect(screen.getByText(/no pages found/i)).toBeInTheDocument();
    });
  });

  it('renders pages sorted by views when data is loaded successfully', async () => {
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
                title: 'Low Views Page',
                content: 'This is page with low views',
                visibility: 'public',
                author: { id: 'user-1', name: 'Test User', address: '0x123' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 10,
              },
              {
                id: 'page-2',
                title: 'Medium Views Page',
                content: 'This is page with medium views',
                visibility: 'community',
                author: { id: 'user-2', name: 'Another User', address: '0x456' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 50,
              },
              {
                id: 'page-3',
                title: 'High Views Page',
                content: 'This is page with high views',
                visibility: 'public',
                author: { id: 'user-3', name: 'Popular Author', address: '0x789' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 100,
              },
            ],
          },
        }),
      })
    );
    
    render(<PopularPages />);
    
    // Ожидаем, что страницы будут отсортированы по просмотрам в порядке убывания
    await waitFor(() => {
      const headings = screen.getAllByRole('heading', { level: 3 });
      // Первая страница должна быть с наибольшим числом просмотров
      expect(headings[0]).toHaveTextContent('High Views Page');
      // Вторая страница должна быть со средним числом просмотров
      expect(headings[1]).toHaveTextContent('Medium Views Page');
    });
    
    // Проверяем отображение количества просмотров
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('limits the number of displayed pages to 4', async () => {
    // Мокаем ответ с большим количеством страниц
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            pages: Array.from({ length: 10 }, (_, i) => ({
              id: `page-${i}`,
              title: `Page ${i}`,
              content: `Content ${i}`,
              visibility: 'public',
              author: { id: `user-${i}`, name: `User ${i}`, address: `0x${i}` },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              views: 100 - i, // Сортировка по убыванию просмотров
            })),
          },
        }),
      })
    );
    
    render(<PopularPages />);
    
    // Проверяем, что отображается только 4 страницы
    await waitFor(() => {
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(4);
    });
  });

  it('displays correct icon based on page visibility', async () => {
    // Мокаем страницы с разной видимостью
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            pages: [
              {
                id: 'page-1',
                title: 'Public Page',
                content: 'Public content',
                visibility: 'public',
                author: { id: 'user-1', name: 'User 1', address: '0x123' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 100,
              },
              {
                id: 'page-2',
                title: 'Community Page',
                content: 'Community content',
                visibility: 'community',
                author: { id: 'user-2', name: 'User 2', address: '0x456' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                views: 50,
              },
            ],
          },
        }),
      })
    );
    
    render(<PopularPages />);
    
    // Проверяем, что отображаются правильные иконки для разных типов видимости
    await waitFor(() => {
      expect(screen.getByText('Public Page')).toBeInTheDocument();
      expect(screen.getByText('Community Page')).toBeInTheDocument();
    });
    
    // После загрузки данных должны быть отображены иконки
    expect(screen.getAllByLucideGlobe?.length || 0).toBe(1);
    expect(screen.getAllByLucideUsers?.length || 0).toBe(1);
  });

  it('makes the correct API request', async () => {
    // Мокаем успешный ответ
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { pages: [] } }),
      })
    );
    
    render(<PopularPages />);
    
    // Проверяем, что API вызван с правильными параметрами
    expect(global.fetch).toHaveBeenCalledWith('/api/pages?limit=20');
  });
}); 