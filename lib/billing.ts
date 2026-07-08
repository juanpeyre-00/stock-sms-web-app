import type { CompanyPlan, CompanyStatus } from '@/lib/generated/prisma/enums'

export const MONTHLY_PRICE_CENTS = 899
export const MONTHLY_PRICE_LABEL = 'USD 8.99/mes'
export const TRIAL_DAYS = 7
export const FREE_COMPANY_SLUG = 'tololo'

type BillingCompany = {
  lifetimeAccess: boolean
  plan: CompanyPlan
  status: CompanyStatus
  trialEndsAt: Date | null
}

export function isCompanyBillable(
  company: Pick<BillingCompany, 'lifetimeAccess' | 'plan'>,
) {
  return !company.lifetimeAccess && company.plan !== 'INTERNAL'
}

export function canUsePaidFeatures(company: BillingCompany, now = new Date()) {
  if (!isCompanyBillable(company)) return true
  if (company.status === 'ACTIVE') return true
  if (company.status === 'TRIALING' && company.trialEndsAt) {
    return company.trialEndsAt.getTime() >= now.getTime()
  }

  return false
}

export function getTrialEndsAt(startDate = new Date()) {
  const trialEndsAt = new Date(startDate)
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS)
  return trialEndsAt
}
