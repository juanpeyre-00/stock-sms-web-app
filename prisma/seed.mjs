import fs from 'node:fs'
import crypto from 'node:crypto'
import pg from 'pg'

function readEnv(path) {
  if (!fs.existsSync(path)) return {}

  return Object.fromEntries(
    fs
      .readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([^#=]+)=(.*)$/))
      .filter(Boolean)
      .map((match) => [
        match[1].trim(),
        match[2].trim().replace(/^"|"$/g, ''),
      ]),
  )
}

const env = { ...readEnv('.env'), ...readEnv('.env.local') }

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')

  return `scrypt$${salt}$${hash}`
}

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to seed StockSMS')
}

const { Client } = pg
const client = new Client({
  connectionString: env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const now = new Date()
const trialEndsAt = new Date(now)
trialEndsAt.setDate(trialEndsAt.getDate() + 7)
const adminPasswordHash = hashPassword('StockSMS2026!')

await client.connect()

try {
  await client.query('BEGIN')

  await client.query(
    `
      INSERT INTO "Company" (
        id, name, slug, plan, status, "monthlyPriceCents",
        "trialEndsAt", "lifetimeAccess", "internalNotes", "createdAt", "updatedAt"
      )
      VALUES
        ('company_tololo', 'Tololo', 'tololo', 'INTERNAL', 'ACTIVE', 0, null, true,
         'Cuenta interna gratuita. No visible para clientes.', now(), now()),
        ('company_demo', 'Empresa Demo', 'empresa-demo', 'TRIAL', 'TRIALING', 899, $1, false,
         'Empresa de prueba con 7 dias gratis y luego USD 8.99/mes.', now(), now())
      ON CONFLICT (slug) DO UPDATE SET
        plan = EXCLUDED.plan,
        status = EXCLUDED.status,
        "monthlyPriceCents" = EXCLUDED."monthlyPriceCents",
        "trialEndsAt" = EXCLUDED."trialEndsAt",
        "lifetimeAccess" = EXCLUDED."lifetimeAccess",
        "internalNotes" = EXCLUDED."internalNotes",
        "updatedAt" = now()
    `,
    [trialEndsAt],
  )

  await client.query(
    `
      INSERT INTO "User" (
        id, "companyId", name, email, "passwordHash", role, "createdAt", "updatedAt"
      )
      VALUES
        ('user_admin_tololo', 'company_tololo', 'Juan Peyre', 'admin@tololo.cl', $1, 'SUPERADMIN', now(), now())
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        "passwordHash" = EXCLUDED."passwordHash",
        role = EXCLUDED.role,
        "updatedAt" = now()
    `,
    [adminPasswordHash],
  )

  const products = [
    ['product_reineta', 'REI-FRE', 'Reineta fresca', 'Pescado', 'kg', 40],
    ['product_salmon', 'SAL-PAC', 'Salmon del Pacifico', 'Pescado', 'kg', 40],
    ['product_merluza', 'MER-AUS', 'Merluza austral', 'Pescado', 'kg', 50],
    ['product_congrio', 'CON-DOR', 'Congrio dorado', 'Pescado', 'kg', 25],
  ]

  for (const product of products) {
    await client.query(
      `
        INSERT INTO "Product" (
          id, "companyId", sku, name, category, unit, "minStock", active,
          "createdAt", "updatedAt"
        )
        VALUES ($1, 'company_tololo', $2, $3, $4, $5, $6, true, now(), now())
        ON CONFLICT ("companyId", sku) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          unit = EXCLUDED.unit,
          "minStock" = EXCLUDED."minStock",
          active = true,
          "updatedAt" = now()
      `,
      product,
    )
  }

  const collaborators = [
    ['collab_maria', 'Maria Alvarez', '+56961234567', 'Administradora'],
    ['collab_carlos', 'Carlos Ruiz', '+56962345678', 'Supervisor'],
    ['collab_ana', 'Ana Torres', '+56963456789', 'Operaria'],
  ]

  for (const collaborator of collaborators) {
    await client.query(
      `
        INSERT INTO "Collaborator" (
          id, "companyId", name, phone, position, active, "createdAt", "updatedAt"
        )
        VALUES ($1, 'company_tololo', $2, $3, $4, true, now(), now())
        ON CONFLICT ("companyId", phone) DO UPDATE SET
          name = EXCLUDED.name,
          position = EXCLUDED.position,
          active = true,
          "updatedAt" = now()
      `,
      collaborator,
    )
  }

  await client.query('COMMIT')
  console.log('Seed complete: Tololo, Empresa Demo, products and collaborators are ready.')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  await client.end()
}
