import { GET, POST } from '@/app/api/pages/route';
import { NextResponse } from 'next/server';
import * as pageService from '@/lib/page-service';
import * as apiUtils from '@/lib/api-utils';

// Мокаем модули
jest.mock('@/lib/page-service');
jest.mock('@/lib/api-utils');
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Pages API', () => {
  let mockRequest: Request;
  let mockAuthenticateRequest: jest.SpyInstance;
  let mockListPages: jest.SpyInstance;
  let mockCreatePage: jest.SpyInstance;
  let mockSuccessResponse: jest.SpyInstance;
  let mockErrorResponse: jest.SpyInstance;
  let mockHandleApiError: jest.SpyInstance;

  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();

    // Создаем моки для запросов и ответов
    mockRequest = new Request('http://localhost:3000/api/pages');
    
    // Мокаем утилиты API
    mockSuccessResponse = jest.spyOn(apiUtils, 'successResponse')
      .mockImplementation((data) => NextResponse.json({ success: true, data }));
    
    mockErrorResponse = jest.spyOn(apiUtils, 'errorResponse')
      .mockImplementation((error, status = 400) => NextResponse.json({ success: false, error }, { status }));
    
    mockHandleApiError = jest.spyOn(apiUtils, 'handleApiError')
      .mockImplementation((error) => NextResponse.json({ success: false, error: 'Error' }, { status: 500 }));
    
    mockAuthenticateRequest = jest.spyOn(apiUtils, 'authenticateRequest')
      .mockResolvedValue({
        authenticated: true,
        user: { sub: 'user-123', role: 'editor' }
      });

    // Мокаем сервисные функции
    mockListPages = jest.spyOn(pageService, 'listPages')
      .mockResolvedValue({
        pages: [
          {
            id: 'page-1',
            title: 'Test Page',
            content: 'Test content',
            visibility: 'public',
            author: {
              id: 'user-123',
              name: 'Test User',
              address: '0x123456789',
            },
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            views: 10,
          },
        ],
        total: 1,
      });
    
    mockCreatePage = jest.spyOn(pageService, 'createPage')
      .mockResolvedValue({
        id: 'new-page',
        title: 'New Page',
        content: 'New content',
        visibility: 'public',
        author_id: 'user-123',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        views: 0,
      });
  });

  describe('GET', () => {
    it('should return pages with pagination', async () => {
      const result = await GET(mockRequest);
      
      expect(mockListPages).toHaveBeenCalledWith({
        visibility: undefined,
        author_id: undefined,
        limit: 10,
        offset: 0,
        search: undefined,
      });
      
      expect(mockSuccessResponse).toHaveBeenCalledWith({
        pages: [expect.objectContaining({ id: 'page-1' })],
        total: 1,
        limit: 10,
        offset: 0,
      });
      
      expect(result.status).toBe(200);
    });

    it('should handle query parameters', async () => {
      const url = new URL('http://localhost:3000/api/pages');
      url.searchParams.set('limit', '5');
      url.searchParams.set('offset', '10');
      url.searchParams.set('visibility', 'public');
      url.searchParams.set('search', 'test');
      url.searchParams.set('author_id', 'user-123');
      
      const request = new Request(url);
      
      const result = await GET(request);
      
      expect(mockListPages).toHaveBeenCalledWith({
        visibility: 'public',
        author_id: 'user-123',
        limit: 5,
        offset: 10,
        search: 'test',
      });
      
      expect(result.status).toBe(200);
    });

    it('should handle errors', async () => {
      mockListPages.mockRejectedValue(new Error('Database error'));
      
      const result = await GET(mockRequest);
      
      expect(mockHandleApiError).toHaveBeenCalled();
      expect(result.status).toBe(500);
    });
  });

  describe('POST', () => {
    beforeEach(() => {
      // Добавляем мок для получения данных из запроса
      jest.spyOn(mockRequest, 'json').mockResolvedValue({
        title: 'New Page',
        content: 'New content',
        visibility: 'public',
      });
    });

    it('should create a new page', async () => {
      const result = await POST(mockRequest);
      
      expect(mockAuthenticateRequest).toHaveBeenCalled();
      expect(mockCreatePage).toHaveBeenCalledWith({
        title: 'New Page',
        content: 'New content',
        visibility: 'public',
        author_id: 'user-123',
      });
      
      expect(mockSuccessResponse).toHaveBeenCalledWith(
        { page: expect.objectContaining({ id: 'new-page' }) },
        'Page created successfully'
      );
    });

    it('should validate required fields', async () => {
      jest.spyOn(mockRequest, 'json').mockResolvedValue({
        // title отсутствует
        content: 'New content',
        visibility: 'public',
      });
      
      const result = await POST(mockRequest);
      
      expect(mockErrorResponse).toHaveBeenCalledWith('Title is required');
      expect(mockCreatePage).not.toHaveBeenCalled();
    });

    it('should handle authentication failure', async () => {
      mockAuthenticateRequest.mockResolvedValue({
        authenticated: false,
        error: NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 }),
      });
      
      const result = await POST(mockRequest);
      
      expect(mockCreatePage).not.toHaveBeenCalled();
    });

    it('should handle creation failure', async () => {
      mockCreatePage.mockResolvedValue(null);
      
      const result = await POST(mockRequest);
      
      expect(mockErrorResponse).toHaveBeenCalledWith('Failed to create page', 500);
    });

    it('should handle unexpected errors', async () => {
      mockCreatePage.mockRejectedValue(new Error('Database error'));
      
      const result = await POST(mockRequest);
      
      expect(mockHandleApiError).toHaveBeenCalled();
    });
  });
}); 