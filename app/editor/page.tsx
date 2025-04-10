"use client"

import Link from "next/link"
import { ArrowLeft, Bold, Italic, List, ListOrdered, ImageIcon, Code, LinkIcon, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { SignInButton } from "@/components/sign-in-button"
import { toast } from "@/components/ui/use-toast"
import { MultilingualEditor } from "@/components/multilingual-editor"

export default function WikiEditor() {
  const { isConnected, isAuthenticated, loading, signIn } = useAuth()
  const router = useRouter()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>("")
  const [previewTitle, setPreviewTitle] = useState<string>("")

  useEffect(() => {
    // Check authentication status after loading
    if (!loading) {
      if (!isConnected) {
        toast({
          title: "Wallet connection required",
          description: "Please connect your wallet to edit pages",
          variant: "destructive",
        })
        router.push("/")
      } else if (!isAuthenticated) {
        // User is connected but not authenticated
        // We'll show the auth prompt in the UI instead of redirecting
      }
    }
  }, [isConnected, isAuthenticated, loading, router])

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const success = await signIn()
      if (!success) {
        toast({
          title: "Authentication required",
          description: "You need to sign the message to edit pages",
          variant: "destructive",
        })
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSave = ({ title, content }: { title: string; content: string }) => {
    // In a real app, this would save to a database
    toast({
      title: "Page saved",
      description: "Your changes have been saved successfully.",
    })

    // Update preview
    setPreviewTitle(title)
    setPreviewContent(content)
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!isConnected) {
    return null // Will redirect in the useEffect
  }

  // Show authentication prompt if connected but not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
          <div className="mb-6 flex flex-col items-center text-center">
            <Shield className="mb-2 h-12 w-12 text-emerald-600" />
            <h1 className="text-2xl font-bold">Authentication Required</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You need to sign a message with your wallet to verify your identity before editing pages.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSigningIn ? "Signing..." : "Sign message to continue"}
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
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Edit Page</h1>
        </div>
        <div className="flex items-center gap-4">
          <SignInButton />
          <WalletConnectButton />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-4 flex items-center gap-1 rounded-t-md border bg-white p-1 dark:bg-gray-800">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>

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

        <div className="w-1/2 overflow-auto border-l bg-white p-6 dark:bg-gray-800">
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
