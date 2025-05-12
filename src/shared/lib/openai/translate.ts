import { translateText } from './api'

/**
 * Перевести контент страницы с автоматическим определением ключевых секций
 */
export async function translatePageContent(
  content: string, 
  metadata: Record<string, any>, 
  targetLanguage: string
): Promise<{
  translatedContent: string;
  translatedMetadata: Record<string, any>;
}> {
  // Переводим основной контент
  const translatedContent = await translateText(content, targetLanguage)
  
  // Переводим мета-данные (например, title и description)
  const translatedMetadata = { ...metadata }
  if (metadata.title) {
    translatedMetadata.title = await translateText(metadata.title, targetLanguage)
  }
  if (metadata.description) {
    translatedMetadata.description = await translateText(metadata.description, targetLanguage)
  }
  
  // Добавляем информацию о переводе в метаданные
  translatedMetadata.translatedFrom = metadata.language || 'en'
  translatedMetadata.language = targetLanguage
  translatedMetadata.translatedAt = new Date().toISOString()
  
  return {
    translatedContent,
    translatedMetadata
  }
} 