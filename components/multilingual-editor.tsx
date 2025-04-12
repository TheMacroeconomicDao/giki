"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, Globe, ImportIcon as Translate } from "lucide-react"
import { type Language, translateContent, detectLanguage } from "@/lib/translation-service"
import { useToast } from "@/components/ui/use-toast"

interface MultilingualEditorProps {
  initialTitle?: string
  initialContent?: string
  initialLanguage?: Language
  pageId?: string
  onSave?: (data: {
    pageId?: string
    contents: Record<Language, { title: string; content: string; language: Language }>
  }) => void
}

export function MultilingualEditor({
  initialTitle = "",
  initialContent = "",
  initialLanguage = "en",
  pageId,
  onSave,
}: MultilingualEditorProps) {
  const { toast } = useToast()
  const [activeLanguage, setActiveLanguage] = useState<Language>(initialLanguage)
  const [isTranslating, setIsTranslating] = useState(false)

  // Content state for each language
  const [content, setContent] = useState({
    en: initialLanguage === "en" ? initialContent : "",
    ru: initialLanguage === "ru" ? initialContent : "",
  })

  // Title state for each language
  const [title, setTitle] = useState({
    en: initialLanguage === "en" ? initialTitle : "",
    ru: initialLanguage === "ru" ? initialTitle : "",
  })

  // Handle content change
  const handleContentChange = (value: string, language: Language) => {
    setContent((prev) => ({
      ...prev,
      [language]: value,
    }))
  }

  // Handle title change
  const handleTitleChange = (value: string, language: Language) => {
    setTitle((prev) => ({
      ...prev,
      [language]: value,
    }))
  }

  // Update the handleTranslate function to show better loading states

  const handleTranslate = async (targetLanguage: Language) => {
    const sourceLanguage = activeLanguage

    if (content[sourceLanguage].trim() === "") {
      toast({
        title: "Cannot translate empty content",
        description: "Please enter some content before translating.",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)

    try {
      // First translate the content
      toast({
        title: "Translation in progress",
        description: `Translating content to ${targetLanguage === "en" ? "English" : "Russian"}...`,
      })

      const contentResult = await translateContent(content[sourceLanguage], sourceLanguage, targetLanguage)

      if (!contentResult.success) {
        throw new Error(contentResult.error || "Content translation failed")
      }

      setContent((prev) => ({
        ...prev,
        [targetLanguage]: contentResult.translatedContent,
      }))

      // Then translate the title if it exists
      if (title[sourceLanguage].trim() !== "") {
        toast({
          title: "Translating title",
          description: `Translating title to ${targetLanguage === "en" ? "English" : "Russian"}...`,
        })

        const titleResult = await translateContent(title[sourceLanguage], sourceLanguage, targetLanguage)

        if (titleResult.success) {
          setTitle((prev) => ({
            ...prev,
            [targetLanguage]: titleResult.translatedContent,
          }))
        }
      }

      toast({
        title: "Translation complete",
        description: `Content has been translated to ${targetLanguage === "en" ? "English" : "Russian"}.`,
      })

      // Switch to the translated language tab
      setActiveLanguage(targetLanguage)
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation failed",
        description: error instanceof Error ? error.message : "Failed to translate content",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  // Handle save
  const handleSave = () => {
    if (onSave) {
      // Prepare content in both languages
      const contents: Record<Language, { title: string; content: string; language: Language }> = {
        en: {
          title: title.en,
          content: content.en,
          language: "en",
        },
        ru: {
          title: title.ru,
          content: content.ru,
          language: "ru",
        },
      }

      onSave({
        pageId,
        contents,
      })
    }
  }

  // Auto-detect language when content changes
  useEffect(() => {
    if (content[activeLanguage].length > 10) {
      const detectedLanguage = detectLanguage(content[activeLanguage])
      if (detectedLanguage !== activeLanguage) {
        toast({
          title: "Language detected",
          description: `It looks like you're writing in ${detectedLanguage === "ru" ? "Russian" : "English"}. Would you like to switch?`,
          action: (
            <Button variant="outline" size="sm" onClick={() => setActiveLanguage(detectedLanguage)}>
              Switch
            </Button>
          ),
        })
      }
    }
  }, [content, activeLanguage, toast])

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as Language)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="en" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                English
              </TabsTrigger>
              <TabsTrigger value="ru" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Русский
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              {activeLanguage === "ru" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTranslate("en")}
                  disabled={isTranslating}
                  className="flex items-center gap-2"
                >
                  {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Translate className="h-4 w-4" />}
                  Translate to English
                </Button>
              )}

              {activeLanguage === "en" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTranslate("ru")}
                  disabled={isTranslating}
                  className="flex items-center gap-2"
                >
                  {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Translate className="h-4 w-4" />}
                  Перевести на русский
                </Button>
              )}

              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                Save
              </Button>
            </div>
          </div>

          <TabsContent value="en" className="mt-0">
            <div className="space-y-4">
              <div>
                <label htmlFor="title-en" className="mb-2 block text-sm font-medium">
                  Page Title (English)
                </label>
                <Input
                  id="title-en"
                  value={title.en}
                  onChange={(e) => handleTitleChange(e.target.value, "en")}
                  className="text-lg font-medium"
                  placeholder="Enter page title in English"
                />
              </div>

              <div>
                <label htmlFor="content-en" className="mb-2 block text-sm font-medium">
                  Content (English)
                </label>
                <Textarea
                  id="content-en"
                  value={content.en}
                  onChange={(e) => handleContentChange(e.target.value, "en")}
                  className="min-h-[400px] font-mono"
                  placeholder="Write your content in English using Markdown..."
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ru" className="mt-0">
            <div className="space-y-4">
              <div>
                <label htmlFor="title-ru" className="mb-2 block text-sm font-medium">
                  Заголовок страницы (Русский)
                </label>
                <Input
                  id="title-ru"
                  value={title.ru}
                  onChange={(e) => handleTitleChange(e.target.value, "ru")}
                  className="text-lg font-medium"
                  placeholder="Введите заголовок страницы на русском"
                />
              </div>

              <div>
                <label htmlFor="content-ru" className="mb-2 block text-sm font-medium">
                  Содержание (Русский)
                </label>
                <Textarea
                  id="content-ru"
                  value={content.ru}
                  onChange={(e) => handleContentChange(e.target.value, "ru")}
                  className="min-h-[400px] font-mono"
                  placeholder="Напишите содержание на русском языке, используя Markdown..."
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
