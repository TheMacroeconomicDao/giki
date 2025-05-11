import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarkdownEditor } from '@/components/markdown-editor';
import { useToast } from '@/hooks/use-toast';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Определяем типы для тестов
declare global {
  interface Window {
    FileReader: any;
  }
}

// Мокаем хук useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

// Мокаем fetch для загрузки изображений
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: { url: '/uploads/test-image.jpg' } }),
  })
) as unknown as typeof fetch;

describe('MarkdownEditor', () => {
  const mockOnChange = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Настраиваем мок useToast
    (useToast as any).mockReturnValue({
      toast: vi.fn(),
    });
    
    // Мокаем методы, которые не реализованы в jsdom
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
      },
    });
    
    // Мокаем FileReader с использованием any для обхода проблем типизации
    class MockFileReader {
      onload: any = null;
      
      readAsDataURL() {
        setTimeout(() => {
          if (this.onload) {
            this.onload({
              target: { result: 'data:image/jpeg;base64,test' }
            });
          }
        }, 100);
      }
    }
    
    Object.defineProperty(window, 'FileReader', {
      value: MockFileReader,
      writable: true
    });
  });
  
  it('renders basic editor with textarea and preview tabs', () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />);
    
    // Проверяем наличие вкладок и текстового поля
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /write/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write your content here/i)).toBeInTheDocument();
  });
  
  it('shows preview of markdown content', async () => {
    const testContent = '# Test Heading\n\nThis is a test paragraph.';
    
    render(<MarkdownEditor value={testContent} onChange={mockOnChange} />);
    
    // Переключаемся на вкладку превью
    const previewTab = screen.getByRole('tab', { name: /preview/i });
    userEvent.click(previewTab);
    
    // Проверяем, что контент отображается с разметкой Markdown
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /test heading/i })).toBeInTheDocument();
      expect(screen.getByText(/this is a test paragraph/i)).toBeInTheDocument();
    });
  });
  
  it('calls onChange when textarea content changes', async () => {
    render(<MarkdownEditor value="" onChange={mockOnChange} />);
    
    // Изменяем содержимое textarea
    const textarea = screen.getByPlaceholderText(/write your content here/i);
    userEvent.type(textarea, 'New content');
    
    // Проверяем, что onChange был вызван с правильным значением
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('New content');
    });
  });
  
  it('inserts markdown formatting when toolbar buttons are clicked', async () => {
    render(<MarkdownEditor value="test" onChange={mockOnChange} />);
    
    // Находим кнопки форматирования и нажимаем на них
    const boldButton = screen.getByRole('button', { name: /bold/i });
    userEvent.click(boldButton);
    
    // Поскольку нет выделенного текста, должен быть добавлен маркер форматирования
    expect(mockOnChange).toHaveBeenCalledWith('test**');
  });
  
  it('formats selected text when toolbar buttons are clicked', async () => {
    render(<MarkdownEditor value="select this text" onChange={mockOnChange} />);
    
    // Эмулируем выделение текста
    const textarea = screen.getByPlaceholderText(/write your content here/i);
    fireEvent.select(textarea, { target: { selectionStart: 7, selectionEnd: 11 } });
    
    // Нажимаем на кнопку жирного текста
    const boldButton = screen.getByRole('button', { name: /bold/i });
    userEvent.click(boldButton);
    
    // Проверяем, что текст был обернут в маркеры форматирования
    expect(mockOnChange).toHaveBeenCalledWith('select **this** text');
  });
  
  it('handles undo and redo operations', async () => {
    // Создаем тестовый вариант редактора с начальным значением
    const { rerender } = render(<MarkdownEditor value="initial text" onChange={mockOnChange} />);
    
    // Изменяем текст для создания истории
    mockOnChange.mockImplementation((newValue: string) => {
      rerender(<MarkdownEditor value={newValue} onChange={mockOnChange} />);
    });
    
    // Добавляем текст
    const textarea = screen.getByPlaceholderText(/write your content here/i);
    userEvent.type(textarea, ' with more content');
    
    // Нажимаем Undo
    const undoButton = screen.getByTitle('Undo');
    userEvent.click(undoButton);
    
    // Проверяем, что текст вернулся к предыдущему состоянию
    await waitFor(() => {
      expect(textarea).toHaveValue('initial text');
    });
    
    // Нажимаем Redo
    const redoButton = screen.getByTitle('Redo');
    userEvent.click(redoButton);
    
    // Проверяем, что текст вернулся к последнему состоянию
    await waitFor(() => {
      expect(textarea).toHaveValue('initial text with more content');
    });
  });
  
  it('handles image upload through the toolbar button', async () => {
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);
    
    // Находим кнопку загрузки изображения и нажимаем на нее
    const imageButton = screen.getByRole('button', { name: /image/i });
    userEvent.click(imageButton);
    
    // Находим скрытый input для файлов
    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    
    // Имитируем выбор файла
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    userEvent.upload(fileInput as HTMLElement, file);
    
    // Проверяем, что был вызван fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.any(Object));
      expect(mockOnChange).toHaveBeenCalledWith('![test.jpg](/uploads/test-image.jpg)');
    });
  });
  
  it('validates image file type during upload', async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
    
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);
    
    // Находим скрытый input для файлов
    const fileInput = container.querySelector('input[type="file"]');
    
    // Имитируем выбор файла неправильного типа
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    userEvent.upload(fileInput as HTMLElement, file);
    
    // Проверяем, что было показано сообщение об ошибке
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Invalid file type',
        variant: 'destructive'
      }));
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
  
  it('validates image file size during upload', async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
    
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);
    
    // Находим скрытый input для файлов
    const fileInput = container.querySelector('input[type="file"]');
    
    // Имитируем выбор файла слишком большого размера
    const file = new File(['test'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB
    userEvent.upload(fileInput as HTMLElement, file);
    
    // Проверяем, что было показано сообщение об ошибке
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'File too large',
        variant: 'destructive'
      }));
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
  
  it('handles API errors during image upload', async () => {
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({
      toast: mockToast,
    });
    
    // Мокаем ошибку fetch
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' }),
      })
    );
    
    const { container } = render(<MarkdownEditor value="" onChange={mockOnChange} />);
    
    // Находим скрытый input для файлов
    const fileInput = container.querySelector('input[type="file"]');
    
    // Имитируем выбор файла
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    userEvent.upload(fileInput as HTMLElement, file);
    
    // Проверяем, что было показано сообщение об ошибке
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Upload failed',
        variant: 'destructive'
      }));
    });
  });
}); 