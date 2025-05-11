import { POST } from '@/app/api/upload/route';
import { NextResponse } from 'next/server';
import * as apiUtils from '@/lib/api-utils';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Мокаем модули
jest.mock('@/lib/api-utils');
jest.mock('fs/promises');
jest.mock('fs');
jest.mock('path');
jest.mock('uuid');
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Upload API', () => {
  let mockRequest: Request;
  let mockFormData: FormData;
  let mockAuthenticateRequest: jest.SpyInstance;
  let mockSuccessResponse: jest.SpyInstance;
  let mockErrorResponse: jest.SpyInstance;
  let mockHandleApiError: jest.SpyInstance;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Мокаем запрос и FormData
    mockFormData = new FormData();
    mockRequest = new Request('http://localhost:3000/api/upload');
    
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
    
    // Мокаем функции файловой системы
    jest.spyOn(fs, 'writeFile').mockResolvedValue(undefined);
    jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined);
    jest.spyOn(fsSync, 'existsSync').mockReturnValue(true);
    jest.spyOn(path, 'join').mockReturnValue('/path/to/uploads/file.jpg');
    
    // Мокаем генерацию UUID
    jest.spyOn(uuidv4, 'default').mockReturnValue('test-uuid');
    
    // Мокаем метод formData из запроса
    jest.spyOn(mockRequest, 'formData').mockResolvedValue(mockFormData);
  });
  
  it('should upload an image file successfully', async () => {
    // Создаем тестовый файл
    const file = new File(['test-content'], 'test-image.jpg', { type: 'image/jpeg' });
    mockFormData.append('file', file);
    
    const result = await POST(mockRequest);
    
    expect(mockAuthenticateRequest).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
    expect(mockSuccessResponse).toHaveBeenCalledWith({ url: '/uploads/test-uuid.jpg' });
    expect(result.status).toBe(200);
  });
  
  it('should reject unauthenticated requests', async () => {
    mockAuthenticateRequest.mockResolvedValue({
      authenticated: false,
      error: NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 }),
    });
    
    const result = await POST(mockRequest);
    
    expect(fs.writeFile).not.toHaveBeenCalled();
    expect(result.status).toBe(401);
  });
  
  it('should reject requests without files', async () => {
    // Не добавляем файл в FormData
    
    const result = await POST(mockRequest);
    
    expect(mockErrorResponse).toHaveBeenCalledWith('No file provided');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
  
  it('should reject non-image files', async () => {
    const file = new File(['test-content'], 'test-document.pdf', { type: 'application/pdf' });
    mockFormData.append('file', file);
    
    const result = await POST(mockRequest);
    
    expect(mockErrorResponse).toHaveBeenCalledWith('Only image files are allowed');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
  
  it('should reject files exceeding size limit', async () => {
    // Создаем файл размером больше 5MB
    const largeContent = new Uint8Array(6 * 1024 * 1024); // 6MB
    const file = new File([largeContent], 'large-image.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    mockFormData.append('file', file);
    
    const result = await POST(mockRequest);
    
    expect(mockErrorResponse).toHaveBeenCalledWith('File size exceeds 5MB limit');
    expect(fs.writeFile).not.toHaveBeenCalled();
  });
  
  it('should create upload directory if it does not exist', async () => {
    jest.spyOn(fsSync, 'existsSync').mockReturnValue(false);
    
    const file = new File(['test-content'], 'test-image.jpg', { type: 'image/jpeg' });
    mockFormData.append('file', file);
    
    const result = await POST(mockRequest);
    
    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalled();
    expect(result.status).toBe(200);
  });
  
  it('should handle filesystem errors', async () => {
    const file = new File(['test-content'], 'test-image.jpg', { type: 'image/jpeg' });
    mockFormData.append('file', file);
    
    jest.spyOn(fs, 'writeFile').mockRejectedValue(new Error('Filesystem error'));
    
    const result = await POST(mockRequest);
    
    expect(mockHandleApiError).toHaveBeenCalled();
    expect(result.status).toBe(500);
  });
}); 