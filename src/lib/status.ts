import { OfferStatus } from './types'

export function computeStatus(
  startDate: string | null,
  endDate: string | null,
  now: Date = new Date(),
): OfferStatus {
  const nowMs = now.getTime()
  if (endDate && new Date(endDate).getTime() < nowMs) return 'ended'
  if (startDate && new Date(startDate).getTime() > nowMs) return 'upcoming'
  return 'active'
}

export function isEndingSoon(endDate: string | null, now: Date = new Date()): boolean {
  if (!endDate) return false
  const ms = new Date(endDate).getTime() - now.getTime()
  return ms > 0 && ms < 48 * 60 * 60 * 1000
}
