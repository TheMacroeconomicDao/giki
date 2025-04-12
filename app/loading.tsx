import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      <p className="mt-4 text-lg font-medium">Loading...</p>
    </div>
  )
}
