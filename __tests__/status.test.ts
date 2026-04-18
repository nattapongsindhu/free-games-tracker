import { computeStatus, isEndingSoon } from '../src/lib/status'

const now = new Date('2024-06-15T12:00:00Z')

describe('computeStatus', () => {
  it('returns active when within promotion window', () => {
    expect(computeStatus('2024-06-01T00:00:00Z', '2024-06-30T00:00:00Z', now)).toBe('active')
  })

  it('returns upcoming when start is in the future', () => {
    expect(computeStatus('2024-06-20T00:00:00Z', '2024-06-30T00:00:00Z', now)).toBe('upcoming')
  })

  it('returns ended when end date is past', () => {
    expect(computeStatus('2024-06-01T00:00:00Z', '2024-06-10T00:00:00Z', now)).toBe('ended')
  })

  it('returns active when startDate is null and not ended', () => {
    expect(computeStatus(null, '2024-06-30T00:00:00Z', now)).toBe('active')
  })

  it('returns active when both dates are null', () => {
    expect(computeStatus(null, null, now)).toBe('active')
  })

  it('returns ended when endDate is null but startDate is past — no, active', () => {
    // No endDate means perpetually active
    expect(computeStatus('2024-01-01T00:00:00Z', null, now)).toBe('active')
  })
})

describe('isEndingSoon', () => {
  it('returns true when endDate is within 48 hours', () => {
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    expect(isEndingSoon(in24h, now)).toBe(true)
  })

  it('returns false when endDate is more than 48 hours away', () => {
    const in72h = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString()
    expect(isEndingSoon(in72h, now)).toBe(false)
  })

  it('returns false when endDate is in the past', () => {
    const yesterday = new Date(now.getTime() - 86400_000).toISOString()
    expect(isEndingSoon(yesterday, now)).toBe(false)
  })

  it('returns false for null endDate', () => {
    expect(isEndingSoon(null, now)).toBe(false)
  })
})
