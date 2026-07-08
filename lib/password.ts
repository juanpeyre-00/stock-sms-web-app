import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const KEY_LENGTH = 64

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex')

  return `scrypt$${salt}$${hash}`
}

export function verifyPassword(password: string, passwordHash: string) {
  const [method, salt, storedHash] = passwordHash.split('$')

  if (method !== 'scrypt' || !salt || !storedHash) {
    return false
  }

  const candidate = Buffer.from(
    scryptSync(password, salt, KEY_LENGTH).toString('hex'),
    'hex',
  )
  const expected = Buffer.from(storedHash, 'hex')

  return (
    candidate.length === expected.length && timingSafeEqual(candidate, expected)
  )
}
