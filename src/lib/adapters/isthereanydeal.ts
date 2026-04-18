import { GameOffer, SourceLink } from '../types'
import { computeStatus } from '../status'

// Requires ITAD_API_KEY env var (free registration at isthereanydeal.com/dev)
const BASE = 'https://api.isthereanydeal.com'

interface ITADDeal {
  id: string
  slug: string
  title: string
  deal: {
    price: { amount: number; amountInt: number; currency: string }
    regular: { amount: number; amountInt: number; currency: string }
    cut: number
    url: string
    expiry: string | null
    shop: { id: number; name: string }
  }
  assets?: { banner600?: string; banner300?: string }
}

export async function fetchITADOffers(): Promise<GameOffer[]> {
  const key = process.env.ITAD_API_KEY
  if (!key) {
    console.info('[isthereanydeal] ITAD_API_KEY not set — skipping')
    return []
  }

  // Fetch deals with 100% cut (free)
  const url = `${BASE}/deals/v2?key=${key}&country=US&cut_min=100&price_max=0&limit=50`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    console.warn(`[isthereanydeal] API responded ${res.status}`)
    return []
  }

  const json = await res.json()
  const deals: ITADDeal[] = json?.list ?? []

  return deals.map(item => {
    const source: SourceLink = { store: 'isthereanydeal', url: item.deal.url }
    const endDate = item.deal.expiry ? new Date(item.deal.expiry).toISOString() : null
    return {
      id: `itad-${item.id}`,
      title: item.title,
      thumbnail: item.assets?.banner600 ?? item.assets?.banner300,
      offerType: 'giveaway',
      startDate: null,
      endDate,
      status: computeStatus(null, endDate),
      sources: [source],
    }
  })
}
