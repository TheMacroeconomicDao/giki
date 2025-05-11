"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { History, ArrowLeft, ArrowRight, RotateCcw, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Diff } from "react-diff-viewer-continued"
import { useToast } from "@/hooks/use-toast"

interface Version {
  id: string
  content: string
  createdAt: string
  createdBy: string
  authorName?: string
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
  const { toast } = useToast()

  // Fetch versions from API
  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/pages/${pageId}/versions`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch version history')
        }
        
        const data = await response.json()
        
        if (data.success && data.data && data.data.versions) {
          setVersions(data.data.versions)
        } else {
          throw new Error(data.error || 'Failed to load version history')
        }
      } catch (err) {
        console.error('Error fetching versions:', err)
        setError((err as Error).message || 'Failed to load version history')
      } finally {
        setLoading(false)
      }
    }

    if (pageId) {
      fetchVersions()
    }
  }, [pageId])

  const handleVersionSelect = (index: number) => {
    setSelectedVersionIndex(index)
    setShowDiff(true)
  }

  const handleRestore = async () => {
    if (selectedVersionIndex !== null) {
      try {
        // Show loading toast
        toast({
          title: "Restoring version...",
          description: "Please wait while the content is being restored"
        })
        
        // In a real implementation, you would call an API to create a new version
        // that restores this content, but for now we'll just use the onRestore callback
        onRestore(versions[selectedVersionIndex].content)
        
        toast({
          title: "Version restored",
          description: "The selected version has been restored successfully"
        })
        
        setShowDiff(false)
        setSelectedVersionIndex(null)
      } catch (error) {
        console.error('Error restoring version:', error)
        toast({
          title: "Restore failed",
          description: "There was an error restoring this version",
          variant: "destructive"
        })
      }
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

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-80" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-6 text-center">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  // No versions state
  if (versions.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md">
        <History className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No version history available</p>
      </div>
    )
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
                  {version.authorName && (
                    <div className="text-xs opacity-70 mt-1">
                      By {version.authorName}
                    </div>
                  )}
                </div>
              ))}
            </div>
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
