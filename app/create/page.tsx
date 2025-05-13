"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Textarea } from "@/shared/ui/textarea"
import { ArrowLeftRight, Globe, Lock, Save, Users } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/shared/ui/use-toast"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { useAuthStore } from "@/features/auth"

export default function CreatePage() {
  const { addToast } = useToast()
  const { walletAddress } = useAuthStore()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [translatedContent, setTranslatedContent] = useState("")
  const [visibility, setVisibility] = useState("public")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleTranslate = async () => {
    if (!content.trim()) {
      addToast("Please enter some content to translate", "error")
      return
    }

    try {
      setIsTranslating(true)

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          sourceLanguage,
          targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()
      setTranslatedContent(data.translatedText)

      addToast("Your content has been translated successfully", "success")
    } catch (error) {
      console.error("Translation error:", error)
      addToast("There was an error translating your content. Please try again.", "error")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      addToast("Please enter a title for your page", "error")
      return
    }

    if (!content.trim()) {
      addToast("Please enter some content for your page", "error")
      return
    }

    if (!walletAddress) {
      addToast("Wallet not connected. Please connect your wallet to save.", "error")
      return
    }

    try {
      setIsSaving(true)

      // Prepare translated content object
      const translatedContentObj: Record<string, string> = {}
      if (translatedContent.trim()) {
        translatedContentObj[targetLanguage] = translatedContent
      }

      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          translatedContent: translatedContentObj,
          visibility,
          author: {
            id: walletAddress,
            name: "User", // In a real app, you'd get the user's name from a profile
            address: walletAddress,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save page")
      }

      const data = await response.json()

      addToast("Page saved successfully", "success")

      // Redirect to the new page
      router.push(`/pages/${data.page.id}`)
    } catch (error) {
      console.error("Save error:", error)
      addToast("There was an error saving your page. Please try again.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Implementation of handleInputChange function
  }

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Create New Page</h1>
      </div>

      <div className="grid gap-6">
        <div>
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Visibility</Label>
          <RadioGroup value={visibility} onValueChange={setVisibility} className="flex space-x-4 mt-1.5">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="flex items-center gap-1.5 cursor-pointer">
                <Globe className="h-4 w-4" />
                Public
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="community" id="community" />
              <Label htmlFor="community" className="flex items-center gap-1.5 cursor-pointer">
                <Users className="h-4 w-4" />
                Community
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="flex items-center gap-1.5 cursor-pointer">
                <Lock className="h-4 w-4" />
                Private
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="editor" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="source-lang" className="text-sm">
                      Source:
                    </Label>
                    <select
                      id="source-lang"
                      value={sourceLanguage}
                      onChange={(e) => setSourceLanguage(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ru">Russian</option>
                    </select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTranslate}
                    className="gap-1"
                    disabled={isTranslating}
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    {isTranslating ? "Translating..." : "Translate"}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="target-lang" className="text-sm">
                      Target:
                    </Label>
                    <select
                      id="target-lang"
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ru">Russian</option>
                    </select>
                  </div>
                </div>
              </div>

              <TabsContent value="editor" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="content" className="text-sm font-medium">
                      {sourceLanguage === "en"
                        ? "English"
                        : sourceLanguage === "es"
                          ? "Spanish"
                          : sourceLanguage === "fr"
                            ? "French"
                            : sourceLanguage === "de"
                              ? "German"
                              : "Russian"}
                    </Label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your content here..."
                      className="min-h-[400px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="translated-content" className="text-sm font-medium">
                      {targetLanguage === "en"
                        ? "English"
                        : targetLanguage === "es"
                          ? "Spanish"
                          : targetLanguage === "fr"
                            ? "French"
                            : targetLanguage === "de"
                              ? "German"
                              : "Russian"}
                    </Label>
                    <Textarea
                      value={translatedContent}
                      onChange={(e) => setTranslatedContent(e.target.value)}
                      placeholder="Translated content will appear here..."
                      className="min-h-[400px]"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 min-h-[400px] overflow-auto">
                    <h2 className="text-xl font-bold mb-4">{title || "Page Title"}</h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {content ? <ReactMarkdown>{content}</ReactMarkdown> : "Content preview will appear here..."}
                    </div>
                  </div>
                  <div className="border rounded-md p-4 min-h-[400px] overflow-auto">
                    <h2 className="text-xl font-bold mb-4">
                      {title || "Page Title"} ({targetLanguage})
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {translatedContent ? (
                        <ReactMarkdown>{translatedContent}</ReactMarkdown>
                      ) : (
                        "Translated content preview will appear here..."
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>
    </div>
  )
}
