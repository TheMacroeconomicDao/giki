"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { translateContent, type TranslationProvider } from "@/lib/translation-service"
import { LanguageSelector } from "@/components/language-selector"
import { VisibilitySelector, type Visibility } from "@/components/visibility-selector"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, Save, Clock, Send, ChevronDown, AlertTriangle, Settings } from "lucide-react"
import { useAuth } from "@/components/auth-context"

// Supported languages
const languages = [
  { code: "en", name: "English" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
]

interface MultilingualEditorProps {
  initialContent?: Record<string, string>
  initialTitle?: Record<string, string>
  onSave?: (data: {
    content: Record<string, string>
    title: Record<string, string>
    visibility: Visibility
    status: string
    scheduledFor?: Date
  }) => void
}

export function MultilingualEditor({
  initialContent = { en: "" },
  initialTitle = { en: "" },
  onSave,
}: MultilingualEditorProps) {
  const { toast } = useToast()
  const { wallet } = useAuth()
  const [activeLanguage, setActiveLanguage] = useState("en")
  const [content, setContent] = useState<Record<string, string>>(initialContent)
  const [title, setTitle] = useState<Record<string, string>>(initialTitle)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationProgress, setTranslationProgress] = useState(0)
  const [targetLanguages, setTargetLanguages] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [visibility, setVisibility] = useState<Visibility>("public")
  const [publishStatus, setPublishStatus] = useState<"draft" | "published" | "scheduled">("draft")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [translationError, setTranslationError] = useState<string | null>(null)
  const [translationProvider, setTranslationProvider] = useState<TranslationProvider>("openai")

  // Initialize content and title with initial values
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent)
    }
    if (initialTitle) {
      setTitle(initialTitle)
    }
  }, [initialContent, initialTitle])

  // Load translation provider from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const config = localStorage.getItem("translationConfig")
      if (config) {
        try {
          const parsedConfig = JSON.parse(config)
          if (parsedConfig.defaultProvider) {
            setTranslationProvider(parsedConfig.defaultProvider)
          }
        } catch (e) {
          console.error("Failed to parse translation config:", e)
        }
      }
    }
  }, [])

  // Handle content change for the active language
  const handleContentChange = (value: string) => {
    setContent((prev) => ({
      ...prev,
      [activeLanguage]: value,
    }))
  }

  // Handle title change for the active language
  const handleTitleChange = (value: string) => {
    setTitle((prev) => ({
      ...prev,
      [activeLanguage]: value,
    }))
  }

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setActiveLanguage(language)
  }

  // Handle visibility change
  const handleVisibilityChange = (newVisibility: Visibility) => {
    setVisibility(newVisibility)
  }

  // Handle translation provider change
  const handleProviderChange = (provider: TranslationProvider) => {
    setTranslationProvider(provider)
    toast({
      title: "Translation Provider Changed",
      description: `Now using ${provider.toUpperCase()} for translations`,
    })
  }

  // Handle translation for a single language
  const handleTranslate = async (targetLang: string) => {
    if (!content[activeLanguage] || !title[activeLanguage]) {
      toast({
        title: "Translation Error",
        description: "Please enter content and title before translating",
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    setTranslationError(null)

    try {
      // Translate content
      const contentResult = await translateContent(
        content[activeLanguage],
        activeLanguage as any,
        targetLang as any,
        translationProvider,
      )

      if (!contentResult.success) {
        throw new Error(contentResult.error || "Failed to translate content")
      }

      // Translate title
      const titleResult = await translateContent(
        title[activeLanguage],
        activeLanguage as any,
        targetLang as any,
        translationProvider,
      )

      if (!titleResult.success) {
        throw new Error(titleResult.error || "Failed to translate title")
      }

      // Update state with translations
      setContent((prev) => ({
        ...prev,
        [targetLang]: contentResult.translatedContent,
      }))

      setTitle((prev) => ({
        ...prev,
        [targetLang]: titleResult.translatedContent,
      }))

      toast({
        title: "Translation Complete",
        description: `Successfully translated to ${languages.find((l) => l.code === targetLang)?.name}`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      setTranslationError(error instanceof Error ? error.message : "Failed to translate content. Please try again.")
      toast({
        title: "Translation Failed",
        description: "There was an error translating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  // Handle translation to all selected languages
  const handleTranslateAll = async () => {
    if (targetLanguages.length === 0) {
      setIsDialogOpen(true)
      return
    }

    setIsTranslating(true)
    setTranslationProgress(0)
    setTranslationError(null)

    try {
      let completed = 0

      for (const lang of targetLanguages) {
        if (lang !== activeLanguage) {
          // Skip the source language
          try {
            // Translate content
            const contentResult = await translateContent(
              content[activeLanguage],
              activeLanguage as any,
              lang as any,
              translationProvider,
            )

            if (!contentResult.success) {
              console.warn(`Error translating content to ${lang}:`, contentResult.error)
              // Continue with other languages even if one fails
            } else {
              // Translate title
              const titleResult = await translateContent(
                title[activeLanguage],
                activeLanguage as any,
                lang as any,
                translationProvider,
              )

              if (!titleResult.success) {
                console.warn(`Error translating title to ${lang}:`, titleResult.error)
              } else {
                // Update state with translations
                setContent((prev) => ({
                  ...prev,
                  [lang]: contentResult.translatedContent,
                }))

                setTitle((prev) => ({
                  ...prev,
                  [lang]: titleResult.translatedContent,
                }))
              }
            }
          } catch (error) {
            console.error(`Error translating to ${lang}:`, error)
            // Continue with other languages even if one fails
          }
        }

        completed++
        setTranslationProgress((completed / targetLanguages.length) * 100)
      }

      toast({
        title: "Translation Complete",
        description: `Successfully translated to ${targetLanguages.length} languages`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      setTranslationError(error instanceof Error ? error.message : "Failed to translate content. Please try again.")
      toast({
        title: "Translation Failed",
        description: "There was an error translating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
      setTranslationProgress(100)
    }
  }

  // Handle language selection in the dialog
  const handleLanguageSelect = (lang: string) => {
    setTargetLanguages((prev) => {
      if (prev.includes(lang)) {
        return prev.filter((l) => l !== lang)
      } else {
        return [...prev, lang]
      }
    })
  }

  // Handle select all languages
  const handleSelectAllLanguages = () => {
    setTargetLanguages(languages.map((l) => l.code))
  }

  // Handle deselect all languages
  const handleDeselectAllLanguages = () => {
    setTargetLanguages([])
  }

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave({
        content,
        title,
        visibility,
        status: publishStatus,
        scheduledFor: publishStatus === "scheduled" ? scheduledDate : undefined,
      })
    }

    toast({
      title: "Content Saved",
      description: `Your content has been saved as ${publishStatus}`,
    })
  }

  // Handle publish
  const handlePublish = () => {
    setPublishStatus("published")
    handleSave()
  }

  // Handle save as draft
  const handleSaveAsDraft = () => {
    setPublishStatus("draft")
    handleSave()
  }

  // Handle schedule
  const handleSchedule = (date: Date) => {
    setPublishStatus("scheduled")
    setScheduledDate(date)
    handleSave()
  }

  // Handle translate and publish all
  const handleTranslateAndPublishAll = async () => {
    await handleTranslateAll()
    handlePublish()
  }

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Edit Page</h2>
          <div className="flex items-center gap-2">
            <Badge
              variant={publishStatus === "draft" ? "outline" : publishStatus === "published" ? "default" : "secondary"}
            >
              {publishStatus === "draft" ? "Draft" : publishStatus === "published" ? "Published" : "Scheduled"}
            </Badge>
            {translationError && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Translation Error
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <VisibilitySelector value={visibility} onChange={handleVisibilityChange} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSaveAsDraft}>
                <Clock className="mr-2 h-4 w-4" />
                Save as Draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePublish}>
                <Send className="mr-2 h-4 w-4" />
                Publish Now
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  handleSchedule(tomorrow)
                }}
              >
                <Clock className="mr-2 h-4 w-4" />
                Schedule for Tomorrow
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Globe className="h-4 w-4" />
                Translate & Publish
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Translation Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleTranslateAndPublishAll}>
                <Globe className="mr-2 h-4 w-4" />
                Translate All & Publish
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Translation Provider</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={translationProvider}
                onValueChange={(value) => handleProviderChange(value as TranslationProvider)}
              >
                <DropdownMenuRadioItem value="openai">OpenAI</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="deepl">DeepL</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/admin/settings/translation">
                  <Settings className="mr-2 h-4 w-4" />
                  Translation Settings
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Translation Progress */}
      {isTranslating && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Translating with {translationProvider.toUpperCase()}...</span>
            <span className="text-sm text-muted-foreground">{Math.round(translationProgress)}%</span>
          </div>
          <Progress value={translationProgress} />
        </div>
      )}

      {/* Translation Error */}
      {translationError && (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Translation Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{translationError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeLanguage} onValueChange={handleLanguageChange} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              {Object.keys(content).map((lang) => (
                <TabsTrigger key={lang} value={lang}>
                  {languages.find((l) => l.code === lang)?.name || lang.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex items-center gap-2">
              <LanguageSelector value={activeLanguage} onChange={handleLanguageChange} languages={languages} />

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Translate to All
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Target Languages</DialogTitle>
                    <DialogDescription>Choose which languages you want to translate your content to.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" onClick={handleSelectAllLanguages}>
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDeselectAllLanguages}>
                        Deselect All
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {languages.map((lang) => (
                        <div key={lang.code} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang.code}`}
                            checked={targetLanguages.includes(lang.code)}
                            onCheckedChange={() => handleLanguageSelect(lang.code)}
                          />
                          <Label htmlFor={`lang-${lang.code}`}>{lang.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setIsDialogOpen(false)
                        handleTranslateAll()
                      }}
                      disabled={targetLanguages.length === 0}
                    >
                      Translate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Editor Content */}
          {Object.keys(content).map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${lang}`}>Title</Label>
                <Input
                  id={`title-${lang}`}
                  value={title[lang] || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter title"
                  disabled={isTranslating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`content-${lang}`}>Content</Label>
                <Textarea
                  id={`content-${lang}`}
                  value={content[lang] || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Enter content"
                  className="min-h-[300px]"
                  disabled={isTranslating}
                />
              </div>
              {lang !== activeLanguage && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleTranslate(lang)} disabled={isTranslating}>
                    <Globe className="mr-2 h-4 w-4" />
                    Update Translation
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleSaveAsDraft} disabled={isTranslating}>
          Save as Draft
        </Button>
        <Button onClick={handlePublish} disabled={isTranslating}>
          Publish
        </Button>
      </div>
    </div>
  )
}
