import { GameOffer, SourceLink } from '../types'
import { computeStatus } from '../status'

// Steam's featured endpoint — includes specials with pricing data
const API_URL = 'https://store.steampowered.com/api/featured/?cc=us&l=en'

interface SteamItem {
  id: number
  name: string
  discounted: boolean
  discount_percent: number
  original_price: number
  final_price: number
  large_capsule_image?: string
  header_image?: string
  discount_expiration?: number
}

interface SteamFeaturedResponse {
  featured_win?: SteamItem[]
  featured_mac?: SteamItem[]
  featured_linux?: SteamItem[]
  specials?: { items: SteamItem[] }
}

export async function fetchSteamOffers(): Promise<GameOffer[]> {
  const res = await fetch(API_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Steam API responded ${res.status}`)
  const json: SteamFeaturedResponse = await res.json()

  const seen = new Set<number>()
  const allItems: SteamItem[] = [
    ...(json.featured_win ?? []),
    ...(json.specials?.items ?? []),
  ]

  return allItems
    .filter(item => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      // 100% discount and originally paid = temporarily free
      return item.final_price === 0 && item.original_price > 0 && item.discount_percent === 100
    })
    .map(item => {
      const url = `https://store.steampowered.com/app/${item.id}/`
      const endDate = item.discount_expiration
        ? new Date(item.discount_expiration * 1000).toISOString()
        : null
      const source: SourceLink = { store: 'steam', url }
      return {
        id: `steam-${item.id}`,
        title: item.name,
        thumbnail: item.large_capsule_image ?? item.header_image,
        offerType: 'giveaway' as const,
        startDate: null,
        endDate,
        status: computeStatus(null, endDate),
        sources: [source],
      }
    })
}
