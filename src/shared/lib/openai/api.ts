import OpenAI from 'openai'
import { logger } from '@shared/lib/logger'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Function to translate text
 */
export async function translateText(content: string, targetLanguage: string): Promise<string> {
  try {
    const languageNames: Record<string, string> = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ru: 'Russian',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
      ar: 'Arabic',
    }

    const targetLanguageName = languageNames[targetLanguage] || targetLanguage

    const prompt = `Translate the following text to ${targetLanguageName}. 
    Preserve all Markdown formatting, code blocks, and special characters.
    
    Text to translate:
    ${content}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional translator. Translate the provided text accurately while preserving all formatting, including Markdown syntax, code blocks, and special characters.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    })

    return completion.choices[0].message.content || content
  } catch (error) {
    logger.error('Translation error:', error as Error)
    throw new Error('Failed to translate content')
  }
}

/**
 * Function to summarize text
 */
export async function summarizeText(content: string): Promise<string> {
  try {
    const prompt = `Summarize the following text while preserving the key points and main ideas. 
    The summary should be concise but comprehensive.
    
    Text to summarize:
    ${content}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at summarizing content. Create concise summaries that capture the main points while maintaining the original meaning.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    return completion.choices[0].message.content || content
  } catch (error) {
    logger.error('Summarization error:', error as Error)
    throw new Error('Failed to summarize content')
  }
}

/**
 * Function to improve text
 */
export async function improveText(content: string): Promise<string> {
  try {
    const prompt = `Improve the following text by enhancing clarity, fixing grammar and spelling issues, 
    and making it more engaging. Preserve all Markdown formatting, code blocks, and special characters.
    
    Text to improve:
    ${content}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert editor. Improve the provided text by enhancing clarity, fixing grammar and spelling issues, and making it more engaging. Preserve all formatting, including Markdown syntax, code blocks, and special characters.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    return completion.choices[0].message.content || content
  } catch (error) {
    logger.error('Text improvement error:', error as Error)
    throw new Error('Failed to improve content')
  }
} 