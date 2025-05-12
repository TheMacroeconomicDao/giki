import { redirect } from "next/navigation"

export default function SettingsPage() {
  // Проверяем, что путь валидный перед редиректом
  try {
    return redirect("/settings/profile")
  } catch (error) {
    console.error("Redirect error:", error)
    return redirect("/")
  }
}
