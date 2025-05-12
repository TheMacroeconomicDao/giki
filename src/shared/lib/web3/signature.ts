import { ethers } from 'ethers'

/**
 * Verify a message signature from a wallet
 */
export async function verifySignature(address: string, signature: string, message: string): Promise<boolean> {
  try {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature)

    // Check if the recovered address matches the provided address
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

/**
 * Generate a nonce for signing
 */
export function generateNonce(): string {
  return `Giki.js Authentication Nonce: ${crypto.randomUUID()}`
} 