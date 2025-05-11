"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { BookOpen, ChevronDown, FileText, FolderTree, Globe, Home, Lock, Plus, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
  badge?: string
}

export function Sidebar() {
  const pathname = usePathname()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    public: true,
    community: false,
    private: false,
  })

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const navItems: NavItem[] = [
    {
      title: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Public Pages",
      href: "/explore/public",
      icon: <Globe className="h-5 w-5" />,
      submenu: [
        {
          title: "Getting Started",
          href: "/explore/public/getting-started",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "User Guide",
          href: "/explore/public/user-guide",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "API Documentation",
          href: "/explore/public/api-docs",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Community Pages",
      href: "/explore/community",
      icon: <Users className="h-5 w-5" />,
      badge: "12",
      submenu: [
        {
          title: "Development",
          href: "/explore/community/development",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Design",
          href: "/explore/community/design",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Private Pages",
      href: "/dashboard/private",
      icon: <Lock className="h-5 w-5" />,
      submenu: [
        {
          title: "Notes",
          href: "/dashboard/private/notes",
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: "Drafts",
          href: "/dashboard/private/drafts",
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "All Pages",
      href: "/pages",
      icon: <FolderTree className="h-5 w-5" />,
    },
    {
      title: "Documentation",
      href: "/docs",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Admin",
      href: "/admin",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="hidden border-r bg-background md:block w-64 overflow-hidden">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          <span>Giki.js</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-2 p-4">
          <Button asChild variant="default" className="justify-start gap-2">
            <Link href="/create">
              <Plus className="h-4 w-4" />
              Create New Page
            </Link>
          </Button>

          <div className="py-2">
            <nav className="grid gap-1 px-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleCategory(item.title.toLowerCase())}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href && "bg-accent text-accent-foreground",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {item.badge && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              openCategories[item.title.toLowerCase()] && "rotate-180",
                            )}
                          />
                        </div>
                      </button>
                      {openCategories[item.title.toLowerCase()] && (
                        <div className="ml-4 mt-1 grid gap-1 pl-4 border-l">
                          {item.submenu.map((subitem, subindex) => (
                            <Link
                              key={subindex}
                              href={subitem.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                pathname === subitem.href && "bg-accent text-accent-foreground",
                              )}
                            >
                              {subitem.icon}
                              <span>{subitem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
