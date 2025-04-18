"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AITools } from "./ai-tools"
import dynamic from "next/dynamic"
import { EditorContext } from "./editor-context"
import { useToast } from "@/hooks/use-toast"

// Import editor components dynamically to avoid SSR issues
const Editor = dynamic(() => import("./editor"), { ssr: false })
const Preview = dynamic(() => import("./preview"), { ssr: false })

// Import toolbar components
import { TextFormatting, InsertComponents, ListFormatting, HistoryControls, ViewOptions } from "./toolbar"

export interface WysiwygEditorProps {
  initialValue: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  maxHeight?: string
  minHeight?: string
  readOnly?: boolean
}

export function WysiwygEditor({
  initialValue,
  onChange,
  placeholder = "Write your content here...",
  autoFocus = false,
  maxHeight = "none",
  minHeight = "400px",
  readOnly = false,
}: WysiwygEditorProps) {
  const { theme } = useTheme()
  const { toast } = useToast()
  const [value, setValue] = useState(initialValue)
  const [currentTab, setCurrentTab] = useState<string>("write")
  const [showAiTools, setShowAiTools] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [history, setHistory] = useState<string[]>([initialValue])
  const [historyIndex, setHistoryIndex] = useState(0)
  const editorRef = useRef<any>(null)

  // Update counts when value changes
  useEffect(() => {
    const text = value.replace(/\s+/g, " ").trim()
    setWordCount(text ? text.split(" ").length : 0)
    setCharCount(value.length)
  }, [value])

  // Handle value change and history
  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      onChange(newValue)

      // Add to history if it's different from last entry
      if (newValue !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newValue)

        // Keep history at a reasonable size
        if (newHistory.length > 100) {
          newHistory.shift()
        }

        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
      }
    },
    [history, historyIndex, onChange],
  )

  // Undo/redo functions
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setValue(history[newIndex])
      onChange(history[newIndex])
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex, onChange])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setValue(history[newIndex])
      onChange(history[newIndex])
      setHistoryIndex(newIndex)
    }
  }, [history, historyIndex, onChange])

  // Context value for editor components
  const contextValue = {
    value,
    setValue: handleChange,
    editorRef,
    handleUndo,
    handleRedo,
    placeholder,
    readOnly,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }

  return (
    <EditorContext.Provider value={contextValue}>
      <Card className="w-full border">
        <Tabs defaultValue="write" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="flex justify-between items-center border-b px-2">
            <TabsList>
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <div className="text-xs text-muted-foreground">
              {wordCount} words | {charCount} characters
            </div>
          </div>

          {currentTab === "write" && (
            <div className="flex items-center overflow-x-auto py-2 px-3 gap-1 border-b">
              <TooltipProvider>
                <HistoryControls />
                <Separator orientation="vertical" className="mx-1 h-6" />
                <TextFormatting />
                <Separator orientation="vertical" className="mx-1 h-6" />
                <ListFormatting />
                <Separator orientation="vertical" className="mx-1 h-6" />
                <InsertComponents />
                <Separator orientation="vertical" className="mx-1 h-6" />
                <ViewOptions />
                <Separator orientation="vertical" className="mx-1 h-6" />

                <div className="ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setShowAiTools(!showAiTools)}>
                        AI Tools
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>AI-powered writing assistance</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          )}

          {showAiTools && (
            <div className="border-b">
              <AITools
                onClose={() => setShowAiTools(false)}
                onApply={(text) => {
                  handleChange(text)
                  setShowAiTools(false)
                  toast({
                    title: "AI changes applied",
                    description: "The AI-generated content has been inserted into your editor.",
                  })
                }}
              />
            </div>
          )}

          <TabsContent value="write" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <Editor style={{ minHeight, maxHeight }} autoFocus={autoFocus} />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <Preview style={{ minHeight, maxHeight }} />
          </TabsContent>
        </Tabs>
      </Card>
    </EditorContext.Provider>
  )
}
