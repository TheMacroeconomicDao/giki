"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Diff } from "react-diff-viewer-continued"

interface Version {
  id: string
  content: string
  createdAt: string
}

interface VersionHistoryProps {
  pageId: string
  currentContent: string
  onRestore: (content: string) => void
}

export function VersionHistory({ pageId, currentContent, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  // Fetch versions from API
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch(`/api/pages/${pageId}/versions`)
        // const data = await response.json()
        // setVersions(data.versions)

        // Mock data for demonstration
        setVersions([
          {
            id: "3",
            content:
              "# Getting Started with Giki.js\n\nWelcome to Giki.js! This is the latest version with more details.\n\n## Features\n\n- Markdown support\n- Version history\n- Translations",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
          {
            id: "2",
            content:
              "# Getting Started with Giki.js\n\nWelcome to Giki.js! This is the second version with some updates.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          },
          {
            id: "1",
            content: "# Getting Started\n\nWelcome to Giki.js!",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
          },
        ])
      } catch (err) {
        setError("Failed to load version history")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [pageId])

  const handleVersionSelect = (index: number) => {
    setSelectedVersionIndex(index)
    setShowDiff(true)
  }

  const handleRestore = () => {
    if (selectedVersionIndex !== null) {
      onRestore(versions[selectedVersionIndex].content)
      setShowDiff(false)
      setSelectedVersionIndex(null)
    }
  }

  const handleNavigate = (direction: "prev" | "next") => {
    if (selectedVersionIndex === null) return

    if (direction === "prev" && selectedVersionIndex < versions.length - 1) {
      setSelectedVersionIndex(selectedVersionIndex + 1)
    } else if (direction === "next" && selectedVersionIndex > 0) {
      setSelectedVersionIndex(selectedVersionIndex - 1)
    }
  }

  if (loading) {
    return <div>Loading version history...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {versions.length === 0 ? (
              <p className="text-muted-foreground">No previous versions</p>
            ) : (
              <div className="space-y-2">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-md cursor-pointer ${
                      selectedVersionIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => handleVersionSelect(index)}
                  >
                    <div className="font-medium">Version {versions.length - index}</div>
                    <div className="text-sm opacity-80">
                      {formatDistanceToNow(new Date(version.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {showDiff && selectedVersionIndex !== null && (
        <Card className="md:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Comparing Version {versions.length - selectedVersionIndex} with Current</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("prev")}
                disabled={selectedVersionIndex >= versions.length - 1}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Older
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("next")}
                disabled={selectedVersionIndex <= 0}
              >
                Newer
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <Button variant="default" size="sm" onClick={handleRestore} className="gap-1">
                <RotateCcw className="h-4 w-4" />
                Restore
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Diff
                oldValue={versions[selectedVersionIndex].content}
                newValue={currentContent}
                splitView={true}
                leftTitle="Selected Version"
                rightTitle="Current Version"
                hideLineNumbers
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
