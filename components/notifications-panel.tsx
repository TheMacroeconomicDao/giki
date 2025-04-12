"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, X, Edit, Trash, UserPlus, FileText } from "lucide-react"
import { useState } from "react"
import type { Language } from "@/lib/translation-service"

interface Notification {
  id: string
  type: "edit" | "delete" | "new_user" | "comment" | "mention"
  title: string
  message: string
  time: string
  read: boolean
}

interface NotificationsPanelProps {
  currentLanguage: Language
  onClose: () => void
}

export function NotificationsPanel({ currentLanguage, onClose }: NotificationsPanelProps) {
  const t = {
    en: {
      title: "Notifications",
      markAllRead: "Mark all as read",
      viewAll: "View all notifications",
      noNotifications: "No new notifications",
      empty: "You're all caught up!",
    },
    ru: {
      title: "Уведомления",
      markAllRead: "Отметить все как прочитанное",
      viewAll: "Посмотреть все уведомления",
      noNotifications: "Нет новых уведомлений",
      empty: "У вас нет новых уведомлений!",
    },
  }

  const notificationsData: Record<Language, Notification[]> = {
    en: [
      {
        id: "1",
        type: "edit",
        title: "Page Updated",
        message: "John Doe updated 'Installation Guide'",
        time: "10 minutes ago",
        read: false,
      },
      {
        id: "2",
        type: "new_user",
        title: "New User",
        message: "Jane Smith joined the wiki",
        time: "1 hour ago",
        read: false,
      },
      {
        id: "3",
        type: "comment",
        title: "New Comment",
        message: "Mike added a comment on 'API Documentation'",
        time: "3 hours ago",
        read: true,
      },
      {
        id: "4",
        type: "delete",
        title: "Page Deleted",
        message: "Admin deleted 'Deprecated Features'",
        time: "Yesterday",
        read: true,
      },
    ],
    ru: [
      {
        id: "1",
        type: "edit",
        title: "Страница обновлена",
        message: "Иван обновил 'Руководство по установке'",
        time: "10 минут назад",
        read: false,
      },
      {
        id: "2",
        type: "new_user",
        title: "Новый пользователь",
        message: "Елена присоединилась к вики",
        time: "1 час назад",
        read: false,
      },
      {
        id: "3",
        type: "comment",
        title: "Новый комментарий",
        message: "Михаил добавил комментарий к 'Документация API'",
        time: "3 часа назад",
        read: true,
      },
      {
        id: "4",
        type: "delete",
        title: "Страница удалена",
        message: "Администратор удалил 'Устаревшие функции'",
        time: "Вчера",
        read: true,
      },
    ],
  }

  const [notifications, setNotifications] = useState<Notification[]>(notificationsData[currentLanguage])

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <Edit className="h-4 w-4 text-blue-500" />
      case "delete":
        return <Trash className="h-4 w-4 text-red-500" />
      case "new_user":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Bell className="mr-2 h-4 w-4" />
          {t[currentLanguage].title}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-250px)] overflow-y-auto p-0">
        {notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 transition-colors ${notification.read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20"}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                    <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <Bell className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-center text-sm text-gray-500">{t[currentLanguage].empty}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-4 py-2 dark:bg-gray-800/50">
        <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={notifications.every((n) => n.read)}>
          {t[currentLanguage].markAllRead}
        </Button>
        <Button variant="link" size="sm">
          {t[currentLanguage].viewAll}
        </Button>
      </CardFooter>
    </Card>
  )
}
