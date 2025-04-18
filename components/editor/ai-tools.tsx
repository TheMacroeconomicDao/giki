"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Languages, Sparkles, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useEditorContext } from "./editor-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AITools() {
  const { toast } = useToast()
  const { value, setValue } = useEditorContext()
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [isImproving, setIsImproving] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [isTranslateDialogOpen, setIsTranslateDialogOpen] = useState(false)

  // Handle translation
  const handleTranslate = async () => {
    if (!value.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to translate",
        variant: "destructive",
      })
      return
    }

    try {
      setIsTranslating(true)

      const response = await fetch("/api/ai/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: value,
          targetLanguage,
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.translatedText) {
        setValue(data.data.translatedText)
        setIsTranslateDialogOpen(false)
        toast({
          title: "Translation complete",
          description: `Content translated to ${getLanguageName(targetLanguage)}`,
        })
      } else {
        throw new Error(data.error || "Translation failed")
      }
    } catch (error) {
      console.error("Translation error:", error)
      toast({
        title: "Translation failed",
        description: "There was an error translating your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  // Handle summarization
  const handleSummarize = async () => {
    if (!value.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to summarize",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSummarizing(true)

      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: value,
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.summary) {
        setValue(data.data.summary)
        toast({
          title: "Summarization complete",
          description: "Content has been summarized",
        })
      } else {
        throw new Error(data.error || "Summarization failed")
      }
    } catch (error) {
      console.error("Summarization error:", error)
      toast({
        title: "Summarization failed",
        description: "There was an error summarizing your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  // Handle improving
  const handleImprove = async () => {
    if (!value.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to improve",
        variant: "destructive",
      })
      return
    }

    try {
      setIsImproving(true)

      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: value,
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.improvedText) {
        setValue(data.data.improvedText)
        toast({
          title: "Improvement complete",
          description: "Content has been improved",
        })
      } else {
        throw new Error(data.error || "Improvement failed")
      }
    } catch (error) {
      console.error("Improvement error:", error)
      toast({
        title: "Improvement failed",
        description: "There was an error improving your content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImproving(false)
    }
  }

  // Helper function to get language name
  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
      ar: "Arabic",
    }
    return languages[code] || code
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isTranslateDialogOpen} onOpenChange={setIsTranslateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Translate</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Translate Content</DialogTitle>
            <DialogDescription>
              Translate your content to another language using AI. The original formatting will be preserved.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="language">Target Language</Label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTranslateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTranslate} disabled={isTranslating}>
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" />
                  Translate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={handleSummarize}
        disabled={isSummarizing || !value.trim()}
      >
        {isSummarizing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Summarizing...</span>
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Summarize</span>
          </>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1"
        onClick={handleImprove}
        disabled={isImproving || !value.trim()}
      >
        {isImproving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Improving...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Improve</span>
          </>
        )}
      </Button>
    </div>
  )
}
