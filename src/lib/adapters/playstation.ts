import { GameOffer, SourceLink } from '../types'
import { computeStatus } from '../status'
import * as cheerio from 'cheerio'

// PlayStation Store free games page (HTML scrape — no public API)
const PAGE_URL = 'https://store.playstation.com/en-us/category/bf5f49a1-e1cf-45f5-a4b0-5dcb3b6e28e2/1'

export async function fetchPlayStationOffers(): Promise<GameOffer[]> {
  const res = await fetch(PAGE_URL, {
    cache: 'no-store',
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; free-games-tracker/1.0)' },
  })
  if (!res.ok) throw new Error(`PlayStation Store responded ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)
  const offers: GameOffer[] = []

  // PS Store renders client-side via React; the static HTML rarely has game data.
  // Attempt to parse __NEXT_DATA__ JSON blob if present.
  const nextDataScript = $('#__NEXT_DATA__').html()
  if (!nextDataScript) {
    console.warn('[playstation] No __NEXT_DATA__ found — PS Store is fully client-rendered')
    return []
  }

  try {
    const nextData = JSON.parse(nextDataScript)
    // Path varies by PS Store version; try known paths
    const products =
      nextData?.props?.pageProps?.products ??
      nextData?.props?.pageProps?.serverProps?.products ??
      []

    for (const p of products) {
      const title: string = p?.name ?? p?.title
      if (!title) continue
      const url = `https://store.playstation.com/en-us/product/${p.id ?? ''}`
      const source: SourceLink = { store: 'playstation', url }
      offers.push({
        id: `ps-${p.id ?? normalizeKey(title)}`,
        title,
        thumbnail: p?.images?.[0]?.url ?? p?.thumbnailUrl,
        offerType: 'subscription',
        startDate: p?.startDate ?? null,
        endDate: p?.endDate ?? null,
        status: computeStatus(p?.startDate ?? null, p?.endDate ?? null),
        sources: [source],
      })
    }
  } catch {
    console.warn('[playstation] Failed to parse __NEXT_DATA__')
  }

  return offers
}

function normalizeKey(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '-')
}
