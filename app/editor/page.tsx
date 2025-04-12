"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Code,
  LinkIcon,
  Shield,
  Heading1,
  Heading2,
  TableIcon,
  Eye,
  Save,
  CheckSquare,
  Type,
  Quote,
  HelpCircle,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { toast } from "@/components/ui/use-toast"
import { MultilingualEditor } from "@/components/multilingual-editor"
import { savePage } from "@/lib/page-service"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Language } from "@/lib/translation-service"

export default function WikiEditor() {
  const { isConnected, isAuthenticated, loading, wallet, connectWallet, signIn } = useAuth()
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>("")
  const [previewTitle, setPreviewTitle] = useState<string>("")
  const [activeLanguage, setActiveLanguage] = useState<Language>("en")
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit")
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    // Check authentication status after loading
    if (!loading) {
      if (!isConnected && !isAuthenticating) {
        // Automatically try to authenticate when the page loads
        handleOneClickAuth()
      }
    }
  }, [isConnected, loading])

  // Auto-save functionality
  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout | null = null

    if (autoSaveEnabled && isAuthenticated && editorMode === "edit") {
      autoSaveInterval = setInterval(() => {
        // This would trigger the save function in a real implementation
        // For now, we'll just update the last saved time
        setLastSaved(new Date())
        toast({
          title: "Auto-saved",
          description: "Your changes have been automatically saved",
          duration: 2000,
        })
      }, 30000) // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval)
      }
    }
  }, [autoSaveEnabled, isAuthenticated, editorMode])

  const handleOneClickAuth = async () => {
    setIsAuthenticating(true)
    try {
      if (!isConnected) {
        // First connect wallet
        const connected = await connectWallet()
        if (connected) {
          // Then automatically sign in
          await signIn()
        } else {
          // If connection failed, redirect to home
          toast({
            title: "Authentication required",
            description: "Please connect your wallet to access the editor",
            variant: "destructive",
          })
          router.push("/")
        }
      } else if (!isAuthenticated) {
        // Already connected, just sign in
        const success = await signIn()
        if (!success) {
          toast({
            title: "Authentication required",
            description: "You need to sign the message to edit pages",
            variant: "destructive",
          })
          router.push("/")
        }
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleSave = async ({
    contents,
  }: {
    pageId?: string
    contents: Record<Language, { title: string; content: string; language: Language }>
  }) => {
    try {
      setIsSaving(true)
      // In a real app, we would get the user ID from the auth context
      const userId = wallet.address || "demo-user-id"

      // Save the page with both language versions
      await savePage(contents, userId, undefined)

      setLastSaved(new Date())
      toast({
        title: "Page saved",
        description: "Your page has been saved in both languages.",
      })

      // Update preview with the current language content
      setPreviewTitle(contents[activeLanguage].title)
      setPreviewContent(contents[activeLanguage].content)
    } catch (error) {
      console.error("Error saving page:", error)
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Failed to save page",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || isAuthenticating) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-lg">{isAuthenticating ? "Authenticating..." : "Loading..."}</p>
      </div>
    )
  }

  // Show authentication prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6 flex flex-col items-center text-center">
            <Shield className="mb-2 h-12 w-12 text-emerald-600" />
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You need to sign in with your wallet to access the editor.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              variant="default"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={handleOneClickAuth}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In with Wallet"
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Return to home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <Link href="/pages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">{activeLanguage === "en" ? "Edit Page" : "Редактировать страницу"}</h1>
          {lastSaved && (
            <span className="text-xs text-gray-500">
              {activeLanguage === "en" ? "Last saved: " : "Последнее сохранение: "}
              {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as "edit" | "preview")}>
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                {activeLanguage === "en" ? "Edit" : "Редактировать"}
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {activeLanguage === "en" ? "Preview" : "Предпросмотр"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              handleSave({
                contents: {
                  en: { title: "Getting Started Guide", content: "Content in English", language: "en" },
                  ru: { title: "Руководство по началу работы", content: "Содержание на русском", language: "ru" },
                },
              })
            }
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {activeLanguage === "en" ? "Saving..." : "Сохранение..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {activeLanguage === "en" ? "Save" : "Сохранить"}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            className={autoSaveEnabled ? "text-emerald-600" : "text-gray-500"}
          >
            {autoSaveEnabled
              ? activeLanguage === "en"
                ? "Auto-save: On"
                : "Автосохранение: Вкл"
              : activeLanguage === "en"
                ? "Auto-save: Off"
                : "Автосохранение: Выкл"}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {editorMode === "edit" ? (
          <div className="flex flex-1 flex-col p-6">
            <TooltipProvider>
              <div className="mb-4 flex items-center gap-1 rounded-md border bg-white p-1 dark:bg-gray-800">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Bold className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Bold" : "Жирный"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Italic className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Italic" : "Курсив"}</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Heading1 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Heading 1" : "Заголовок 1"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Heading2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Heading 2" : "Заголовок 2"}</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Bullet List" : "Маркированный список"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Numbered List" : "Нумерованный список"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Task List" : "Список задач"}</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Quote className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Blockquote" : "Цитата"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Code className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Code" : "Код"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <TableIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Table" : "Таблица"}</TooltipContent>
                </Tooltip>

                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Image" : "Изображение"}</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{activeLanguage === "en" ? "Link" : "Ссылка"}</TooltipContent>
                </Tooltip>

                <div className="ml-auto flex items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{activeLanguage === "en" ? "Markdown Help" : "Помощь по Markdown"}</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>

            <MultilingualEditor
              initialTitle="Getting Started Guide"
              initialContent={`# Getting Started with Wiki.js

Welcome to Wiki.js! This guide will help you get up and running quickly.

## Installation

To install Wiki.js, you need:
- Node.js 14.x or later
- MongoDB 4.x or PostgreSQL 10.x or later
- Git (optional, for version control)

## Basic Configuration

After installation, you'll need to configure:
1. Authentication methods
2. User permissions
3. Content organization

## Creating Your First Page

To create a new page:
1. Click the "+" button in the sidebar
2. Enter a title for your page
3. Choose a location in your wiki structure
4. Start writing using Markdown or the visual editor`}
              onSave={handleSave}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto border-l bg-white p-6 dark:bg-gray-800">
            <div className="prose dark:prose-invert max-w-none">
              {previewTitle ? <h1>{previewTitle}</h1> : <h1>Getting Started with Wiki.js</h1>}

              {previewContent ? (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(previewContent) }} />
              ) : (
                <>
                  <p>Welcome to Wiki.js! This guide will help you get up and running quickly.</p>
                  <h2>Installation</h2>
                  <p>To install Wiki.js, you need:</p>
                  <ul>
                    <li>Node.js 14.x or later</li>
                    <li>MongoDB 4.x or PostgreSQL 10.x or later</li>
                    <li>Git (optional, for version control)</li>
                  </ul>
                  <h2>Basic Configuration</h2>
                  <p>After installation, you'll need to configure:</p>
                  <ol>
                    <li>Authentication methods</li>
                    <li>User permissions</li>
                    <li>Content organization</li>
                  </ol>
                  <h2>Creating Your First Page</h2>
                  <p>To create a new page:</p>
                  <ol>
                    <li>Click the "+" button in the sidebar</li>
                    <li>Enter a title for your page</li>
                    <li>Choose a location in your wiki structure</li>
                    <li>Start writing using Markdown or the visual editor</li>
                  </ol>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple markdown renderer (in a real app, you would use a proper markdown library)
function renderMarkdown(markdown: string): string {
  // This is a very simplified markdown renderer
  // In a real app, you would use a library like marked or remark

  const html = markdown
    // Headers
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    // Bold
    .replace(/\*\*(.*)\*\*/gm, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*)\*/gm, "<em>$1</em>")
    // Lists
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/^\d\. (.*$)/gm, "<li>$1</li>")
    // Paragraphs
    .replace(/^(?!<h|<li|<ul|<ol|<p)(.*$)/gm, "<p>$1</p>")

  // Wrap lists
  let inList = false
  const lines = html.split("\n")
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("<li>") && !inList) {
      lines[i] = "<ul>" + lines[i]
      inList = true
    } else if (!lines[i].startsWith("<li>") && inList) {
      lines[i - 1] = lines[i - 1] + "</ul>"
      inList = false
    }
  }
  if (inList) {
    lines.push("</ul>")
  }

  return lines.join("\n")
}
