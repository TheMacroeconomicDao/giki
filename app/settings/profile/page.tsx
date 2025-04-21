"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Save, User } from "lucide-react"

export default function ProfileSettings() {
  const { toast } = useToast()
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      })

      // Try to get avatar URL from user data first
      if (user.avatarUrl) {
        setAvatarUrl(user.avatarUrl)
      } else {
        // Try to get from localStorage as fallback
        const storedAvatarUrl = localStorage.getItem(`avatar_${user.id}`)
        if (storedAvatarUrl) {
          setAvatarUrl(storedAvatarUrl)
        }
      }
    }
  }, [user])

  const handleSave = async () => {
    try {
      setLoading(true)

      // Use the updateUser function from the auth context
      await updateUser({
        name: formData.name,
        email: formData.email,
      })

      // Toast notification is handled in the updateUser function
    } catch (error) {
      console.error("Error updating profile:", error)
      // Toast notification is handled in the updateUser function
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)

      // Create form data for upload
      const formData = new FormData()
      formData.append("file", file)

      // Upload the file
      const response = await fetch("/api/users/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()

      // Update avatar URL
      setAvatarUrl(data.avatarUrl)

      // Store in localStorage as fallback
      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, data.avatarUrl)
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    setAvatarUrl(null)
    // Remove from localStorage
    if (user?.id) {
      localStorage.removeItem(`avatar_${user.id}`)
    }
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed",
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in</h1>
        <p>You need to be logged in to access your profile settings.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal information and how others see you on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                {avatarUrl ? <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile picture" /> : null}
                <AvatarFallback className="text-xl">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : user.address.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  This will be displayed on your profile and in comments.
                </p>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button variant="outline" size="sm" onClick={triggerFileInput} disabled={uploading}>
                    {uploading ? "Uploading..." : "Change"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRemoveAvatar} disabled={!avatarUrl}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
                <p className="text-sm text-muted-foreground">This is the name that will be displayed to other users.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />
                <p className="text-sm text-muted-foreground">
                  Your email address is used for notifications and account recovery.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="wallet-address">Wallet Address</Label>
                <Input id="wallet-address" value={user.address} disabled />
                <p className="text-sm text-muted-foreground">
                  This is the wallet address you use to sign in. It cannot be changed.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
