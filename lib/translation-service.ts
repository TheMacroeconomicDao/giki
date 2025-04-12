// Translation service with support for multiple providers (OpenAI and DeepL)
export type Language = "ru" | "en" | "fr" | "de" | "es" | "zh" | "ja"
export type TranslationProvider = "openai" | "deepl"

export interface TranslationResult {
  translatedContent: string
  success: boolean
  error?: string
}

interface TranslationConfig {
  defaultProvider: TranslationProvider
  providers: {
    openai: {
      enabled: boolean
    }
    deepl: {
      enabled: boolean
    }
  }
}

// Default configuration - can be overridden by admin settings
const defaultConfig: TranslationConfig = {
  defaultProvider: "openai",
  providers: {
    openai: {
      enabled: true,
    },
    deepl: {
      enabled: false,
    },
  },
}

// Get current configuration from localStorage or use default
const getConfig = (): TranslationConfig => {
  if (typeof window === "undefined") return defaultConfig

  const savedConfig = localStorage.getItem("translationConfig")
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig)
    } catch (e) {
      console.error("Failed to parse translation config:", e)
    }
  }
  return defaultConfig
}

// Simple fallback translation function when API is not available
const fallbackTranslate = (content: string, fromLanguage: Language, toLanguage: Language): string => {
  // This is a very basic fallback that just returns the original content
  return content
}

// Translate using OpenAI
const translateWithOpenAI = async (
  content: string,
  fromLanguage: Language,
  toLanguage: Language,
): Promise<TranslationResult> => {
  try {
    // Call our API route
    const response = await fetch("/api/translate/openai", {
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

    const data = await response.json()

    if (!response.ok) {
      console.warn("OpenAI Translation API error:", data.error)
      return {
        translatedContent: fallbackTranslate(content, fromLanguage, toLanguage),
        success: false,
        error: data.error || "OpenAI translation service error",
      }
    }

    // If the API returned success: false, but still returned a response
    if (!data.success) {
      console.warn("OpenAI Translation not successful:", data.error)
      return {
        translatedContent: data.translatedContent || fallbackTranslate(content, fromLanguage, toLanguage),
        success: false,
        error: data.error || "OpenAI translation was not successful",
      }
    }

    return data
  } catch (error) {
    console.error("OpenAI Translation error:", error)
    return {
      translatedContent: fallbackTranslate(content, fromLanguage, toLanguage),
      success: false,
      error: error instanceof Error ? error.message : "Failed to translate content with OpenAI",
    }
  }
}

// Translate using DeepL
const translateWithDeepL = async (
  content: string,
  fromLanguage: Language,
  toLanguage: Language,
): Promise<TranslationResult> => {
  try {
    // Call our API route
    const response = await fetch("/api/translate/deepl", {
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

    const data = await response.json()

    if (!response.ok) {
      console.warn("DeepL Translation API error:", data.error)
      return {
        translatedContent: fallbackTranslate(content, fromLanguage, toLanguage),
        success: false,
        error: data.error || "DeepL translation service error",
      }
    }

    // If the API returned success: false, but still returned a response
    if (!data.success) {
      console.warn("DeepL Translation not successful:", data.error)
      return {
        translatedContent: data.translatedContent || fallbackTranslate(content, fromLanguage, toLanguage),
        success: false,
        error: data.error || "DeepL translation was not successful",
      }
    }

    return data
  } catch (error) {
    console.error("DeepL Translation error:", error)
    return {
      translatedContent: fallbackTranslate(content, fromLanguage, toLanguage),
      success: false,
      error: error instanceof Error ? error.message : "Failed to translate content with DeepL",
    }
  }
}

// Main translation function that selects the appropriate provider
export const translateContent = async (
  content: string,
  fromLanguage: Language,
  toLanguage: Language,
  provider?: TranslationProvider,
): Promise<TranslationResult> => {
  // Skip translation if content is empty
  if (!content.trim()) {
    return {
      translatedContent: "",
      success: true,
    }
  }

  // Get current configuration
  const config = getConfig()

  // Use specified provider or default
  const selectedProvider = provider || config.defaultProvider

  // Check if provider is enabled
  if (selectedProvider === "deepl" && config.providers.deepl.enabled) {
    return translateWithDeepL(content, fromLanguage, toLanguage)
  } else if (selectedProvider === "openai" && config.providers.openai.enabled) {
    return translateWithOpenAI(content, fromLanguage, toLanguage)
  } else {
    // Fallback to OpenAI if the selected provider is not enabled
    if (config.providers.openai.enabled) {
      return translateWithOpenAI(content, fromLanguage, toLanguage)
    } else if (config.providers.deepl.enabled) {
      return translateWithDeepL(content, fromLanguage, toLanguage)
    } else {
      // No provider is enabled
      return {
        translatedContent: fallbackTranslate(content, fromLanguage, toLanguage),
        success: false,
        error: "No translation provider is enabled",
      }
    }
  }
}

// Set the default translation provider
export const setDefaultTranslationProvider = (provider: TranslationProvider): void => {
  if (typeof window === "undefined") return

  const config = getConfig()
  config.defaultProvider = provider
  localStorage.setItem("translationConfig", JSON.stringify(config))
}

// Enable or disable a provider
export const setProviderEnabled = (provider: TranslationProvider, enabled: boolean): void => {
  if (typeof window === "undefined") return

  const config = getConfig()
  config.providers[provider].enabled = enabled
  localStorage.setItem("translationConfig", JSON.stringify(config))
}

// Detect language of content (simplified version)
export const detectLanguage = (content: string): Language => {
  // Check for Cyrillic characters which are common in Russian
  const cyrillicPattern = /[а-яА-ЯёЁ]/
  if (cyrillicPattern.test(content)) {
    return "ru"
  }

  // Default to English
  return "en"
}
