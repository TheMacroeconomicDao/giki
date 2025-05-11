import { exec } from "child_process"
import fs from "fs"
import path from "path"

// Function to run Cypress tests
async function runTests() {
  console.log("Starting automated tests...")

  return new Promise((resolve, reject) => {
    exec("npx cypress run", (error, stdout, stderr) => {
      if (error) {
        console.error(`Test execution error: ${error.message}`)
        return reject(error)
      }

      console.log(stdout)

      if (stderr) {
        console.error(`Test stderr: ${stderr}`)
      }

      resolve(stdout)
    })
  })
}

// Function to parse test results and extract errors
function parseTestResults(output: string) {
  const errors = []
  const lines = output.split("\n")

  let collectingError = false
  let currentError = ""

  for (const line of lines) {
    if (line.includes("Error:") || line.includes("AssertionError:")) {
      collectingError = true
      currentError = line
    } else if (collectingError && line.trim() !== "") {
      currentError += "\n" + line
    } else if (collectingError && line.trim() === "") {
      errors.push(currentError)
      collectingError = false
      currentError = ""
    }
  }

  return errors
}

// Main function
async function main() {
  try {
    const testOutput = (await runTests()) as string
    const errors = parseTestResults(testOutput)

    console.log(`Found ${errors.length} errors`)

    // Log errors to file
    const logDir = path.join(process.cwd(), "logs")
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir)
    }

    const logFile = path.join(logDir, `test-errors-${new Date().toISOString().replace(/:/g, "-")}.log`)
    fs.writeFileSync(logFile, errors.join("\n\n"))

    console.log(`Errors logged to ${logFile}`)
  } catch (error) {
    console.error("Test execution failed:", error)
  }
}

main()
