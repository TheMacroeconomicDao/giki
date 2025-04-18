"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Link, List, ListOrdered, ImageIcon, Code } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "400px",
}: MarkdownEditorProps) {
  const [currentTab, setCurrentTab] = useState<string>("write")
  const [selectionStart, setSelectionStart] = useState<number>(0)
  const [selectionEnd, setSelectionEnd] = useState<number>(0)

  // Track textarea selection
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelectionStart(target.selectionStart)
    setSelectionEnd(target.selectionEnd)
  }

  // Insert markdown syntax at cursor position or around selected text
  const insertMarkdown = (syntax: string, selectionModifier?: (selected: string) => string) => {
    const selected = value.substring(selectionStart, selectionEnd)
    let newValue

    if (selected) {
      const before = value.substring(0, selectionStart)
      const after = value.substring(selectionEnd)
      const modifiedSelection = selectionModifier ? selectionModifier(selected) : `${syntax}${selected}${syntax}`
      newValue = before + modifiedSelection + after
    } else {
      const before = value.substring(0, selectionStart)
      const after = value.substring(selectionStart)
      newValue = before + syntax + after
    }

    onChange(newValue)
  }

  const formatters = [
    {
      icon: <Bold className="h-4 w-4" />,
      tooltip: "Bold",
      action: () => insertMarkdown("**"),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      tooltip: "Italic",
      action: () => insertMarkdown("*"),
    },
    {
      icon: <Link className="h-4 w-4" />,
      tooltip: "Link",
      action: () => insertMarkdown("", (selected) => (selected ? `[${selected}](url)` : "[link text](url)")),
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      tooltip: "Image",
      action: () => insertMarkdown("", () => "![alt text](image-url)"),
    },
    {
      icon: <Code className="h-4 w-4" />,
      tooltip: "Code",
      action: () => insertMarkdown("`"),
    },
    {
      icon: <List className="h-4 w-4" />,
      tooltip: "Bullet List",
      action: () => insertMarkdown("", () => "- List item\n- Another item\n"),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      tooltip: "Numbered List",
      action: () => insertMarkdown("", () => "1. First item\n2. Second item\n"),
    },
  ]

  return (
    <div className="w-full">
      <Tabs defaultValue="write" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {currentTab === "write" && (
            <div className="flex items-center space-x-1">
              {formatters.map((formatter, index) => (
                <Button key={index} variant="ghost" size="sm" onClick={formatter.action} title={formatter.tooltip}>
                  {formatter.icon}
                </Button>
              ))}
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleSelect}
            placeholder={placeholder}
            className="font-mono min-h-[400px]"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md p-4 prose dark:prose-invert max-w-none overflow-auto" style={{ minHeight }}>
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
