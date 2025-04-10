import { SiweMessage } from "siwe"

// Create a SIWE message for the user to sign
export const createSiweMessage = (address: string, statement: string) => {
  const domain = window.location.host
  const origin = window.location.origin

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: "1",
    chainId: 1,
    nonce: generateNonce(),
  })

  return message.prepareMessage()
}

// Generate a random nonce
const generateNonce = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

// Verify a SIWE message (this would typically be done on the server)
// For this demo, we'll just simulate verification
export const verifySiweMessage = async (message: string, signature: string) => {
  // In a real application, this would be a server-side verification
  // For demo purposes, we'll just return true after a delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return true
}
