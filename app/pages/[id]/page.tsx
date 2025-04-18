"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Edit, Eye, Globe, History, Lock, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { VersionHistory } from "@/components/version-history"
import ReactMarkdown from "react-markdown"

interface PageData {
  id: string
  title: string
  content: string
  translatedContent: Record<string, string>
  visibility: "public" | "community" | "private"
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    address: string
  }
}

export default function PageView() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // const response = await fetch(`/api/pages/${params.id}`)
        // const data = await response.json()
        // setPage(data.page)

        // Mock data for demonstration
        setPage({
          id: params.id as string,
          title: "Getting Started with Giki.js",
          content:
            "# Getting Started with Giki.js\n\nWelcome to Giki.js! This is a next-generation wiki platform with powerful features.\n\n## Features\n\n- **Markdown Support**: Write content using Markdown syntax\n- **Version History**: Track changes and restore previous versions\n- **AI Translation**: Translate content to multiple languages with one click\n- **Web3 Authentication**: Secure login with your crypto wallet\n\n## Getting Started\n\n1. Connect your wallet\n2. Create your first page\n3. Explore the platform\n\n> Giki.js makes documentation easy and collaborative!",
          translatedContent: {
            es: "# Comenzando con Giki.js\n\n¡Bienvenido a Giki.js! Esta es una plataforma wiki de próxima generación con potentes características.\n\n## Características\n\n- **Soporte Markdown**: Escribe contenido usando sintaxis Markdown\n- **Historial de Versiones**: Realiza un seguimiento de los cambios y restaura versiones anteriores\n- **Traducción con IA**: Traduce contenido a varios idiomas con un solo clic\n- **Autenticación Web3**: Inicio de sesión seguro con tu billetera crypto\n\n## Primeros Pasos\n\n1. Conecta tu billetera\n2. Crea tu primera página\n3. Explora la plataforma\n\n> ¡Giki.js hace que la documentación sea fácil y colaborativa!",
            fr: "# Démarrer avec Giki.js\n\nBienvenue sur Giki.js ! Il s'agit d'une plateforme wiki de nouvelle génération avec des fonctionnalités puissantes.\n\n## Fonctionnalités\n\n- **Support Markdown** : Rédigez du contenu en utilisant la syntaxe Markdown\n- **Historique des versions** : Suivez les modifications et restaurez les versions précédentes\n- **Traduction IA** : Traduisez le contenu dans plusieurs langues en un seul clic\n- **Authentification Web3** : Connexion sécurisée avec votre portefeuille crypto\n\n## Premiers pas\n\n1. Connectez votre portefeuille\n2. Créez votre première page\n3. Explorez la plateforme\n\n> Giki.js rend la documentation facile et collaborative !",
          },
          visibility: "public",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          author: {
            id: "1",
            name: "Admin",
            address: "0x1234",
          },
        })
      } catch (err) {
        setError("Failed to load page")
        console.error(err)
        toast({
          title: "Error",
          description: "Failed to load page",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [params.id, toast])

  const handleEditPage = () => {
    router.push(`/pages/${params.id}/edit`)
  }

  const handleRestoreVersion = (content: string) => {
    // In a real app, this would update the page via API
    setPage((prev) => {
      if (!prev) return null
      return {
        ...prev,
        content,
        updatedAt: new Date().toISOString(),
      }
    })

    setShowHistory(false)
    toast({
      title: "Version restored",
      description: "The page has been updated with the selected version",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error || "Page not found"}</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Return Home
        </Button>
      </div>
    )
  }

  const getVisibilityIcon = () => {
    switch (page.visibility) {
      case "public":
        return <Globe className="h-4 w-4" />
      case "community":
        return <Users className="h-4 w-4" />
      case "private":
        return <Lock className="h-4 w-4" />
    }
  }

  const getVisibilityText = () => {
    switch (page.visibility) {
      case "public":
        return "Public"
      case "community":
        return "Community"
      case "private":
        return "Private"
    }
  }

  const availableLanguages = ["en", ...Object.keys(page.translatedContent)]

  return (
    <div className="container mx-auto max-w-5xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className="gap-1">
              <History className="h-4 w-4" />
              {showHistory ? "Hide History" : "Version History"}
            </Button>
            <Button onClick={handleEditPage} className="gap-1">
              <Edit className="h-4 w-4" />
              Edit Page
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{page.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              {getVisibilityIcon()}
              <span>{getVisibilityText()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>123 views</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{page.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{page.author.name}</div>
              <div className="text-sm text-muted-foreground">
                {page.author.address.slice(0, 6)}...{page.author.address.slice(-4)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}</span>
          </div>
        </div>

        {showHistory ? (
          <VersionHistory pageId={page.id} currentContent={page.content} onRestore={handleRestoreVersion} />
        ) : (
          <>
            {availableLanguages.length > 1 && (
              <div className="mb-4">
                <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage} className="w-full">
                  <TabsList>
                    {availableLanguages.map((lang) => (
                      <TabsTrigger key={lang} value={lang}>
                        {lang === "en"
                          ? "English"
                          : lang === "es"
                            ? "Spanish"
                            : lang === "fr"
                              ? "French"
                              : lang === "de"
                                ? "German"
                                : "Russian"}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {selectedLanguage === "en"
                      ? page.content
                      : page.translatedContent[selectedLanguage] || "Translation not available"}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
