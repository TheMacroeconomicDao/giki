"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code,
  ImageIcon,
  Link,
  Table,
  Undo,
  Redo,
  Fullscreen,
  SpellCheck,
} from "lucide-react"
import { useEditorContext } from "./editor-context"
import { useCallback, useState } from "react"

// Helper function to insert markdown syntax
function useMarkdownInserter() {
  const { value, setValue, editorRef } = useEditorContext()

  const insertMarkdown = useCallback(
    (before: string, after = "", defaultText = "") => {
      // Get editor instance
      const editor = editorRef.current?.view
      if (!editor) return

      const doc = editor.state.doc
      const selection = editor.state.selection.main

      // Get selected text
      const selectedText = doc.sliceString(selection.from, selection.to)

      // Text to insert
      const textToInsert = selectedText || defaultText
      const insertedText = before + textToInsert + after

      // Create transaction
      const transaction = editor.state.update({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: insertedText,
        },
        selection: {
          anchor: selection.from + before.length + textToInsert.length,
          head: selection.from + before.length + textToInsert.length,
        },
      })

      // Apply the transaction
      editor.dispatch(transaction)
      editor.focus()
    },
    [editorRef, setValue, value],
  )

  return insertMarkdown
}

// Text formatting toolbar
export function TextFormatting() {
  const insertMarkdown = useMarkdownInserter()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("**", "**", "bold text")}>
            <Bold className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bold</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("*", "*", "italic text")}>
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Italic</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("~~", "~~", "strikethrough text")}>
            <Strikethrough className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Strikethrough</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("# ", "", "Heading 1")}>
            <Heading1 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 1</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("## ", "", "Heading 2")}>
            <Heading2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 2</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("### ", "", "Heading 3")}>
            <Heading3 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Heading 3</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// List formatting toolbar
export function ListFormatting() {
  const insertMarkdown = useMarkdownInserter()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("- ", "", "List item")}>
            <List className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Bullet List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("1. ", "", "List item")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Numbered List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("- [ ] ", "", "Task item")}>
            <ListChecks className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Task List</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("> ", "", "Blockquote")}>
            <Quote className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Quote</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Insert components toolbar
export function InsertComponents() {
  const insertMarkdown = useMarkdownInserter()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("`", "`", "code")}>
            <Code className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Inline Code</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("```\n", "\n```", "code block")}>
            <Code className="h-4 w-4 border border-current" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Code Block</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("![Alt text](", ")", "image_url")}>
            <ImageIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Image</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => insertMarkdown("[", "](url)", "link text")}>
            <Link className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Link</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              insertMarkdown(
                "\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |\n| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |\n\n",
                "",
              )
            }
          >
            <Table className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Table</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// History controls
export function HistoryControls() {
  const { handleUndo, handleRedo, canUndo, canRedo } = useEditorContext()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={!canUndo}>
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleRedo} disabled={!canRedo}>
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// View options
export function ViewOptions() {
  const [fullscreen, setFullscreen] = useState(false)
  const { value, setValue } = useEditorContext()

  // Toggle fullscreen view
  const handleFullscreen = () => {
    const element = document.documentElement
    if (!fullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setFullscreen(!fullscreen)
  }

  // Check spelling and grammar
  const checkSpelling = async () => {
    try {
      const response = await fetch("/api/ai/improve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: value }),
      })

      const data = await response.json()

      if (data.success && data.data?.improvedText) {
        setValue(data.data.improvedText)
      }
    } catch (error) {
      console.error("Failed to check spelling:", error)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleFullscreen}>
            <Fullscreen className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fullscreen</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={checkSpelling}>
            <SpellCheck className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Spell Check</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
