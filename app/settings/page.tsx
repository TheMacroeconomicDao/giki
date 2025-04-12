"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-context"
import { formatAddress } from "@/lib/wallet-utils"
import { Loader2 } from "lucide-react"
import type { Language } from "@/lib/translation-service"

export default function SettingsPage() {
  const { toast } = useToast()
  const { wallet, isAuthenticated } = useAuth()
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [isSaving, setIsSaving] = useState(false)

  // User preferences state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [defaultLanguage, setDefaultLanguage] = useState<Language>("en")

  const t = {
    en: {
      settings: "Settings",
      profile: "Profile",
      notifications: "Notifications",
      appearance: "Appearance",
      security: "Security",
      profileSettings: "Profile Settings",
      profileDescription: "Manage your personal information and preferences",
      displayName: "Display Name",
      email: "Email Address",
      defaultLanguage: "Default Language",
      english: "English",
      russian: "Russian",
      saveChanges: "Save Changes",
      saving: "Saving...",
      notificationSettings: "Notification Settings",
      notificationDescription: "Manage how you receive notifications",
      emailNotifications: "Email Notifications",
      receiveEmails: "Receive email notifications",
      securitySettings: "Security Settings",
      securityDescription: "Manage your account security settings",
      connectedWallet: "Connected Wallet",
      disconnect: "Disconnect",
      appearanceSettings: "Appearance Settings",
      appearanceDescription: "Customize the look and feel of the interface",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      fontSize: "Font Size",
      small: "Small",
      medium: "Medium",
      large: "Large",
      save: "Save Changes",
    },
    ru: {
      settings: "Настройки",
      profile: "Профиль",
      notifications: "Уведомления",
      appearance: "Внешний вид",
      security: "Безопасность",
      profileSettings: "Настройки профиля",
      profileDescription: "Управление личной информацией и предпочтениями",
      displayName: "Отображаемое имя",
      email: "Электронная почта",
      defaultLanguage: "Язык по умолчанию",
      english: "Английский",
      russian: "Русский",
      saveChanges: "Сохранить изменения",
      saving: "Сохранение...",
      notificationSettings: "Настройки уведомлений",
      notificationDescription: "Управление способами получения уведомлений",
      emailNotifications: "Уведомления по электронной почте",
      receiveEmails: "Получать уведомления по электронной почте",
      securitySettings: "Настройки безопасности",
      securityDescription: "Управление настройками безопасности аккаунта",
      connectedWallet: "Подключенный кошелек",
      disconnect: "Отключить",
      appearanceSettings: "Настройки внешнего вида",
      appearanceDescription: "Настройка внешнего вида интерфейса",
      theme: "Тема",
      light: "Светлая",
      dark: "Темная",
      system: "Системная",
      fontSize: "Размер шрифта",
      small: "Маленький",
      medium: "Средний",
      large: "Большой",
      save: "Сохранить изменения",
    },
  }

  const handleSaveProfile = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: currentLanguage === "en" ? "Profile updated" : "Профиль обновлен",
        description:
          currentLanguage === "en"
            ? "Your profile settings have been saved successfully"
            : "Настройки вашего профиля были успешно сохранены",
      })
    }, 1000)
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t[currentLanguage].settings}</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t[currentLanguage].profile}</TabsTrigger>
          <TabsTrigger value="notifications">{t[currentLanguage].notifications}</TabsTrigger>
          <TabsTrigger value="appearance">{t[currentLanguage].appearance}</TabsTrigger>
          <TabsTrigger value="security">{t[currentLanguage].security}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t[currentLanguage].profileSettings}</CardTitle>
              <CardDescription>{t[currentLanguage].profileDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">{t[currentLanguage].displayName}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={currentLanguage === "en" ? "Your display name" : "Ваше отображаемое имя"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t[currentLanguage].email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentLanguage === "en" ? "your.email@example.com" : "ваша.почта@example.com"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t[currentLanguage].defaultLanguage}</Label>
                <select
                  id="language"
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value as Language)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="en">{t[currentLanguage].english}</option>
                  <option value="ru">{t[currentLanguage].russian}</option>
                </select>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t[currentLanguage].saving}
                  </>
                ) : (
                  t[currentLanguage].saveChanges
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t[currentLanguage].notificationSettings}</CardTitle>
              <CardDescription>{t[currentLanguage].notificationDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">{t[currentLanguage].emailNotifications}</Label>
                  <p className="text-sm text-muted-foreground">{t[currentLanguage].receiveEmails}</p>
                </div>
                <Switch id="emailNotifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Button
                onClick={() => {
                  toast({
                    title:
                      currentLanguage === "en" ? "Notification settings updated" : "Настройки уведомлений обновлены",
                  })
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {t[currentLanguage].saveChanges}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t[currentLanguage].securitySettings}</CardTitle>
              <CardDescription>{t[currentLanguage].securityDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t[currentLanguage].connectedWallet}</Label>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="font-mono text-sm">
                    {isAuthenticated && wallet.address
                      ? formatAddress(wallet.address)
                      : currentLanguage === "en"
                        ? "No wallet connected"
                        : "Кошелек не подключен"}
                  </div>
                  <Button variant="outline" size="sm">
                    {t[currentLanguage].disconnect}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t[currentLanguage].appearanceSettings}</CardTitle>
              <CardDescription>{t[currentLanguage].appearanceDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">{t[currentLanguage].theme}</Label>
                <select
                  id="theme"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="light">{t[currentLanguage].light}</option>
                  <option value="dark">{t[currentLanguage].dark}</option>
                  <option value="system">{t[currentLanguage].system}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">{t[currentLanguage].fontSize}</Label>
                <select
                  id="fontSize"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="small">{t[currentLanguage].small}</option>
                  <option value="medium">{t[currentLanguage].medium}</option>
                  <option value="large">{t[currentLanguage].large}</option>
                </select>
              </div>

              <Button
                onClick={() => {
                  toast({
                    title:
                      currentLanguage === "en" ? "Appearance settings updated" : "Настройки внешнего вида обновлены",
                  })
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {t[currentLanguage].saveChanges}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}
