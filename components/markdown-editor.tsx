"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Bold, Italic, Link, List, ListOrdered, ImageIcon, Code, 
  Table, Heading1, Heading2, Heading3, Quote, Undo, Redo
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

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
  const [history, setHistory] = useState<string[]>([value])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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

    // Add to history
    addToHistory(newValue)

    onChange(newValue)
  }

  // Handle history
  const addToHistory = (newValue: string) => {
    // If we're not at the end of history, trim it
    if (historyIndex < history.length - 1) {
      setHistory(prev => [...prev.slice(0, historyIndex + 1), newValue])
    } else {
      setHistory(prev => [...prev, newValue])
    }
    setHistoryIndex(prev => prev + 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      onChange(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      onChange(history[historyIndex + 1])
    }
  }

  // Handle image upload
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      })
      return
    }

    try {
      // Show loading toast
      toast({
        title: "Uploading image...",
        description: "Please wait while your image is being uploaded"
      })

      // Create FormData to send to the API
      const formData = new FormData()
      formData.append("file", file)
      
      // Upload to server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }
      
      const data = await response.json()
      
      if (data.success && data.data.url) {
        // Insert image markdown at cursor position
        const imageMarkdown = `![${file.name}](${data.data.url})`
        insertMarkdown("", () => imageMarkdown)
        
        toast({
          title: "Image uploaded",
          description: "Image has been added to your content",
          variant: "default"
        })
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast({
        title: "Upload failed",
        description: (error as Error)?.message || "There was an error uploading your image",
        variant: "destructive"
      })
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const formatters = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      tooltip: "Heading 1",
      action: () => insertMarkdown("", (selected) => `# ${selected || "Heading 1"}`),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      tooltip: "Heading 2",
      action: () => insertMarkdown("", (selected) => `## ${selected || "Heading 2"}`),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      tooltip: "Heading 3",
      action: () => insertMarkdown("", (selected) => `### ${selected || "Heading 3"}`),
    },
    null, // Separator
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
      icon: <Quote className="h-4 w-4" />,
      tooltip: "Quote",
      action: () => insertMarkdown("", (selected) => `> ${selected || "Blockquote"}`),
    },
    null, // Separator
    {
      icon: <Link className="h-4 w-4" />,
      tooltip: "Link",
      action: () => insertMarkdown("", (selected) => (selected ? `[${selected}](url)` : "[link text](url)")),
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      tooltip: "Image",
      action: handleImageUpload,
    },
    {
      icon: <Code className="h-4 w-4" />,
      tooltip: "Code",
      action: () => insertMarkdown("`"),
    },
    null, // Separator
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
    {
      icon: <Table className="h-4 w-4" />,
      tooltip: "Table",
      action: () => insertMarkdown("", () => 
        "| Header 1 | Header 2 | Header 3 |\n" +
        "| -------- | -------- | -------- |\n" +
        "| Cell 1   | Cell 2   | Cell 3   |\n" +
        "| Cell 4   | Cell 5   | Cell 6   |\n"
      ),
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleUndo} 
                disabled={historyIndex <= 0}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRedo} 
                disabled={historyIndex >= history.length - 1}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <TooltipProvider>
                {formatters.map((formatter, index) => 
                  formatter ? (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={formatter.action}
                        >
                          {formatter.icon}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{formatter.tooltip}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Separator key={index} orientation="vertical" className="h-6 mx-1" />
                  )
                )}
              </TooltipProvider>
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => {
              // Add to history only if content actually changed
              if (e.target.value !== value) {
                addToHistory(e.target.value)
              }
              onChange(e.target.value)
            }}
            onSelect={handleSelect}
            placeholder={placeholder}
            className="font-mono min-h-[400px]"
            style={{ minHeight }}
          />
          {/* Hidden file input for image uploads */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            className="hidden"
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
