export const SESSION_COOKIE = 'stocksms_session'

const SESSION_DAYS = 7

export type SessionPayload = {
  userId: string
  companyId: string
  role: string
  email: string
  exp: number
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || 'dev-secret-change-me'
}

function base64UrlEncode(value: string | ArrayBuffer) {
  const bytes =
    typeof value === 'string'
      ? new TextEncoder().encode(value)
      : new Uint8Array(value)
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function base64UrlDecode(value: string) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(
    Math.ceil(value.length / 4) * 4,
    '=',
  )
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new TextDecoder().decode(bytes)
}

async function createSignature(unsignedToken: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getAuthSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(unsignedToken),
  )

  return base64UrlEncode(signature)
}

export async function signSession(
  payload: Omit<SessionPayload, 'exp'>,
  days = SESSION_DAYS,
) {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000
  const unsignedToken = base64UrlEncode(JSON.stringify({ ...payload, exp }))
  const signature = await createSignature(unsignedToken)

  return `${unsignedToken}.${signature}`
}

export async function verifySession(token?: string) {
  if (!token) return null

  const [unsignedToken, signature] = token.split('.')

  if (!unsignedToken || !signature) return null

  const expectedSignature = await createSignature(unsignedToken)

  if (signature !== expectedSignature) return null

  try {
    const payload = JSON.parse(base64UrlDecode(unsignedToken)) as SessionPayload

    if (!payload.exp || payload.exp < Date.now()) return null

    return payload
  } catch {
    return null
  }
}
