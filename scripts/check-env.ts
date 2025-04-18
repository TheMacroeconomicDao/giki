import fs from "fs"
import path from "path"
import crypto from "crypto"

// Required environment variables
const requiredEnvVars = ["JWT_SECRET", "OPENAI_API_KEY"]

// Check if .env file exists
const envPath = path.join(process.cwd(), ".env")
const envVars: Record<string, string> = {}

if (fs.existsSync(envPath)) {
  // Read existing .env file
  const envContent = fs.readFileSync(envPath, "utf8")

  // Parse environment variables
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const [, key, value] = match
      envVars[key.trim()] = value.trim()
    }
  })
}

// Check for missing variables
const missingVars = requiredEnvVars.filter((varName) => !envVars[varName])

if (missingVars.length > 0) {
  console.log(`Missing environment variables: ${missingVars.join(", ")}`)
  console.log("Generating default values...")

  // Generate values for missing variables
  missingVars.forEach((varName) => {
    if (varName === "JWT_SECRET") {
      envVars[varName] = crypto.randomBytes(32).toString("hex")
    } else if (varName === "OPENAI_API_KEY") {
      envVars[varName] = "sk-mock-key-for-development"
    }
  })

  // Write updated .env file
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  fs.writeFileSync(envPath, envContent)

  console.log("Environment variables updated in .env file")
} else {
  console.log("All required environment variables are set")
}
