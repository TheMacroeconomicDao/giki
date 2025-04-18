"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeftRight, Globe, Lock, Save, Users } from "lucide-react"
import { useState } from "react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"

export default function CreatePage() {
  const { toast } = useToast()
  const { address, isConnected } = useWeb3()
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
      toast({
        title: "Error",
        description: "Please enter some content to translate",
        variant: "destructive",
      })
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

      toast({
        title: "Translation complete",
        description: "Your content has been translated successfully",
      })
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

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your page",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your page",
        variant: "destructive",
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to save pages",
        variant: "destructive",
      })
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
            id: address,
            name: "User", // In a real app, you'd get the user's name from a profile
            address,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save page")
      }

      const data = await response.json()

      toast({
        title: "Page saved",
        description: "Your page has been saved successfully",
      })

      // Redirect to the new page
      router.push(`/pages/${data.page.id}`)
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
                    <MarkdownEditor value={content} onChange={setContent} placeholder="Write your content here..." />
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
                    <MarkdownEditor
                      value={translatedContent}
                      onChange={setTranslatedContent}
                      placeholder="Translated content will appear here..."
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
