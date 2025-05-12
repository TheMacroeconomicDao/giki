import type React from "react"
import type { Metadata } from "next"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Settings - Giki.js",
  description: "Manage your account settings and preferences",
}

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <SettingsTabs />

        <div>{children}</div>
      </div>
    </div>
  )
}

function SettingsTabs() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
        <TabsTrigger value="profile" asChild>
          <Link href="/settings/profile">Profile</Link>
        </TabsTrigger>
        <TabsTrigger value="preferences" asChild>
          <Link href="/settings/preferences">Preferences</Link>
        </TabsTrigger>
        <TabsTrigger value="security" asChild>
          <Link href="/settings/security">Security</Link>
        </TabsTrigger>
        <TabsTrigger value="sessions" asChild>
          <Link href="/settings/sessions">Sessions</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
