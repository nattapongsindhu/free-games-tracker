import { GameOffer } from './types'

export function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function deduplicateOffers(offers: GameOffer[]): GameOffer[] {
  const map = new Map<string, GameOffer>()
  for (const offer of offers) {
    const key = normalizeTitle(offer.title)
    const existing = map.get(key)
    if (!existing) {
      map.set(key, { ...offer, sources: [...offer.sources] })
      continue
    }
    // Merge sources (avoid duplicates by store)
    for (const src of offer.sources) {
      if (!existing.sources.find(s => s.store === src.store)) {
        existing.sources.push(src)
      }
    }
    // Keep earliest start date
    if (offer.startDate && (!existing.startDate || offer.startDate < existing.startDate)) {
      existing.startDate = offer.startDate
    }
    // Keep latest end date
    if (offer.endDate && (!existing.endDate || offer.endDate > existing.endDate)) {
      existing.endDate = offer.endDate
    }
    // Prefer thumbnail from the offer if existing has none
    if (!existing.thumbnail && offer.thumbnail) {
      existing.thumbnail = offer.thumbnail
    }
  }
  return Array.from(map.values())
}
