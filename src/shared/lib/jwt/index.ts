import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-here-minimum-32-characters-long')

const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN = '7d'

export interface JWTPayload {
	sub: string
	address: string
	role: string
	jti?: string
	type?: 'access' | 'refresh'
}

export async function signJWT(payload: JWTPayload, expiresIn: string = ACCESS_TOKEN_EXPIRES_IN): Promise<string> {
	const iat = Math.floor(Date.now() / 1000)
	const token = await new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(expiresIn)
		.sign(JWT_SECRET)
	return token
}

export async function verifyJWT<T>(token: string): Promise<T> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET, {
			clockTolerance: 120,
		})
		return payload as unknown as T
	} catch (error) {
		console.error('JWT verification failed:', error)
		throw new Error('Invalid token')
	}
}

export async function createAccessToken(payload: Omit<JWTPayload, 'type'>): Promise<string> {
	return signJWT({ ...payload, type: 'access' }, ACCESS_TOKEN_EXPIRES_IN)
}

export async function createRefreshToken(payload: Omit<JWTPayload, 'type'>): Promise<string> {
	const jti = crypto.randomUUID()
	return signJWT({ ...payload, type: 'refresh', jti }, REFRESH_TOKEN_EXPIRES_IN)
}

export function getSecureCookieOptions(maxAge: number) {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict' as const,
		path: '/',
		maxAge,
	}
}

export * from './tokens'
export * from './cookies' 