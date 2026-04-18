import { normalizeTitle, deduplicateOffers } from '../src/lib/dedup'
import { GameOffer } from '../src/lib/types'

describe('normalizeTitle', () => {
  it('lowercases and strips non-alphanumeric', () => {
    expect(normalizeTitle('The Game: Special Edition')).toBe('thegamespecialedition')
  })

  it('handles apostrophes and dashes', () => {
    expect(normalizeTitle("Assassin's Creed - Valhalla")).toBe('assassinscreedvalhalla')
  })
})

describe('deduplicateOffers', () => {
  const now = new Date('2024-06-15T12:00:00Z')

  const base: GameOffer = {
    id: 'epic-1',
    title: 'Death Stranding',
    offerType: 'giveaway',
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-06-15T00:00:00Z',
    status: 'active',
    sources: [{ store: 'epic', url: 'https://epicgames.com/p/death-stranding' }],
  }

  it('deduplicates same game from two sources', () => {
    const itad: GameOffer = {
      ...base,
      id: 'itad-2',
      sources: [{ store: 'isthereanydeal', url: 'https://isthereanydeal.com/game/death-stranding' }],
    }
    const result = deduplicateOffers([base, itad], now)
    expect(result).toHaveLength(1)
    expect(result[0].sources).toHaveLength(2)
  })

  it('does not merge different games', () => {
    const other: GameOffer = {
      ...base,
      id: 'epic-3',
      title: 'Cyberpunk 2077',
      sources: [{ store: 'steam', url: 'https://store.steampowered.com/app/123' }],
    }
    const result = deduplicateOffers([base, other], now)
    expect(result).toHaveLength(2)
  })

  it('does not duplicate a source that already exists', () => {
    const duplicate: GameOffer = { ...base, id: 'epic-1b' }
    const result = deduplicateOffers([base, duplicate], now)
    expect(result[0].sources).toHaveLength(1)
  })

  it('keeps earliest startDate and latest endDate when merging', () => {
    const later: GameOffer = {
      ...base,
      id: 'itad-4',
      startDate: '2024-05-01T00:00:00Z',
      endDate: '2024-07-01T00:00:00Z',
      sources: [{ store: 'isthereanydeal', url: 'https://itad.com/x' }],
    }
    const result = deduplicateOffers([base, later], now)
    expect(result[0].startDate).toBe('2024-05-01T00:00:00Z')
    expect(result[0].endDate).toBe('2024-07-01T00:00:00Z')
  })

  it('recomputes status after merge when combined dates make the offer ended', () => {
    const endedWindow: GameOffer = {
      ...base,
      id: 'steam-2',
      endDate: '2024-06-10T00:00:00Z',
      sources: [{ store: 'steam', url: 'https://store.steampowered.com/app/2' }],
    }

    const result = deduplicateOffers([base, endedWindow], new Date('2024-06-20T12:00:00Z'))
    expect(result[0].status).toBe('ended')
  })

  it('recomputes status after merge when earliest start date is still in the future', () => {
    const upcomingBase: GameOffer = {
      ...base,
      id: 'epic-upcoming',
      title: 'Upcoming Game',
      startDate: '2024-06-25T00:00:00Z',
      endDate: '2024-07-01T00:00:00Z',
      status: 'active',
      sources: [{ store: 'epic', url: 'https://epicgames.com/p/upcoming-game' }],
    }

    const upcomingOther: GameOffer = {
      ...upcomingBase,
      id: 'itad-upcoming',
      startDate: '2024-06-20T00:00:00Z',
      sources: [{ store: 'isthereanydeal', url: 'https://isthereanydeal.com/game/upcoming-game' }],
    }

    const result = deduplicateOffers([upcomingBase, upcomingOther], now)
    expect(result[0].startDate).toBe('2024-06-20T00:00:00Z')
    expect(result[0].status).toBe('upcoming')
  })
})
