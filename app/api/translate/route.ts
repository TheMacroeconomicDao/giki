import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, fromLanguage, toLanguage } = await request.json()

    // Validate input
    if (!content || !fromLanguage || !toLanguage) {
      return NextResponse.json({ error: "Missing required fields: content, fromLanguage, toLanguage" }, { status: 400 })
    }

    // Skip translation if content is empty
    if (!content.trim()) {
      return NextResponse.json({ translatedContent: "", success: true })
    }

    // Determine the instruction based on language direction
    let instruction = ""
    if (fromLanguage === "ru" && toLanguage === "en") {
      instruction =
        "Translate the following Russian text to English. Preserve all formatting, including Markdown syntax, lists, and code blocks."
    } else if (fromLanguage === "en" && toLanguage === "ru") {
      instruction =
        "Translate the following English text to Russian. Preserve all formatting, including Markdown syntax, lists, and code blocks."
    } else {
      return NextResponse.json({ error: "Unsupported language combination" }, { status: 400 })
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: instruction,
          },
          {
            role: "user",
            content: content,
          },
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json({
      translatedContent: data.choices[0].message.content,
      success: true,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to translate content",
        success: false,
      },
      { status: 500 },
    )
  }
}
