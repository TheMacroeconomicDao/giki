import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
// In production, use environment variables for the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your-api-key",
})

export async function POST(req: Request) {
  try {
    const { content, sourceLanguage, targetLanguage } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Prepare the prompt for translation
    const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
    Preserve all Markdown formatting, code blocks, and special characters.
    
    Text to translate:
    ${content}`

    // Call OpenAI API for translation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate the provided text accurately while preserving all formatting, including Markdown syntax, code blocks, and special characters.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    })

    // Extract the translated text from the response
    const translatedText = completion.choices[0].message.content

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Failed to translate content" }, { status: 500 })
  }
}
