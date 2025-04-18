import { getUserById } from "@/lib/user-service"

// This is a mock implementation. In a real app, you would serve the image from your storage service.
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId

    // Get the user to check if they exist
    const user = await getUserById(userId)

    if (!user) {
      return new Response("User not found", { status: 404 })
    }

    // In a real implementation, you would fetch the image from your storage service
    // For this example, we'll return a placeholder SVG with the user's initials

    const initials = user.name ? user.name.slice(0, 2).toUpperCase() : user.address.slice(2, 4).toUpperCase()

    const colors = [
      "#2563EB", // blue-600
      "#D97706", // amber-600
      "#059669", // emerald-600
      "#DC2626", // red-600
      "#7C3AED", // violet-600
      "#DB2777", // pink-600
    ]

    // Use a deterministic color based on the user ID
    const colorIndex = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    const bgColor = colors[colorIndex]

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="${bgColor}" />
        <text x="50%" y="50%" dy=".1em" 
          font-family="Arial, sans-serif" 
          font-size="80" 
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle">${initials}</text>
      </svg>
    `

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error serving avatar:", error)
    return new Response("Error serving avatar", { status: 500 })
  }
}
