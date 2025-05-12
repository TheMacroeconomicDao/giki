import { ethers } from 'ethers'

export async function verifySignature(address: string, signature: string, message: string): Promise<boolean> {
	try {
		const recoveredAddress = ethers.verifyMessage(message, signature)
		return recoveredAddress.toLowerCase() === address.toLowerCase()
	} catch (error) {
		console.error('Signature verification error:', error)
		return false
	}
}

export function generateNonce(): string {
	return `Giki.js Authentication Nonce: ${crypto.randomUUID()}`
} 