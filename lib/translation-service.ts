// Translation service using OpenAI API
// In a production environment, this would be a server-side API call

export type Language = "ru" | "en"

export type TranslationResult = {
  translatedContent: string
  success: boolean
  error?: string
}

// Replace the translateContent function with this implementation that uses our API route

export async function translateContent(
  content: string,
  fromLanguage: Language,
  toLanguage: Language,
): Promise<TranslationResult> {
  try {
    // Skip translation if content is empty
    if (!content.trim()) {
      return {
        translatedContent: "",
        success: true,
      }
    }

    // Call our API route
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        fromLanguage,
        toLanguage,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Translation API error: ${errorData.error || "Unknown error"}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Translation error:", error)
    return {
      translatedContent: "",
      success: false,
      error: error instanceof Error ? error.message : "Failed to translate content",
    }
  }
}

// Detect language of content (simplified version)
export function detectLanguage(content: string): Language {
  // This is a very simplified language detection
  // In a real app, you would use a proper language detection library

  // Check for Cyrillic characters which are common in Russian
  const cyrillicPattern = /[а-яА-ЯёЁ]/
  if (cyrillicPattern.test(content)) {
    return "ru"
  }

  // Default to English
  return "en"
}
