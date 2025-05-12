import { type NextRequest, NextResponse } from "next/server"
import { getUserById } from "@/entities/user"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }): Promise<NextResponse> {
  const userId = params.userId

  try {
    // Get the user to check if they have an avatar
    const user = await getUserById(userId)

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // For now, we'll generate a placeholder avatar based on the user's name or address
    // In a real implementation, you would retrieve the actual image from storage

    // Get initials for the avatar
    const initials = user.name ? user.name.slice(0, 2).toUpperCase() : user.address.slice(2, 4).toUpperCase()

    // Generate a color based on the user ID (for consistent colors)
    const colors = [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#ecf0f1",
      "#95a5a6",
      "#f39c12",
      "#d35400",
      "#c0392b",
      "#bdc3c7",
      "#7f8c8d",
    ]

    const colorIndex = Number.parseInt(userId.substring(0, 8), 16) % colors.length
    const bgColor = colors[colorIndex]

    // Create an SVG placeholder
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="${bgColor}" />
        <text x="50%" y="50%" dy=".1em" 
              font-family="Arial, sans-serif" 
              font-size="80" 
              fill="white" 
              text-anchor="middle" 
              dominant-baseline="middle">
          ${initials}
        </text>
      </svg>
    `

    // Return the SVG as an image
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    })
  } catch (error) {
    console.error("Error serving avatar:", error)
    return new NextResponse("Error serving avatar", { status: 500 })
  }
}
