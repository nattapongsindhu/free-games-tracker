import { GameOffer, SourceLink } from '../types'
import { computeStatus } from '../status'
import * as cheerio from 'cheerio'

const PAGE_URL = 'https://gg.deals/deals/giveaways/'

export async function fetchGGDealsOffers(): Promise<GameOffer[]> {
  const res = await fetch(PAGE_URL, {
    cache: 'no-store',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; free-games-tracker/1.0)',
      Accept: 'text/html',
    },
  })
  if (!res.ok) throw new Error(`GG.deals responded ${res.status}`)

  const html = await res.text()
  const $ = cheerio.load(html)
  const offers: GameOffer[] = []

  // GG.deals giveaway cards — selectors based on their current markup patterns
  $('.game-list-item, .deal-item, [class*="game-item"]').each((_, el) => {
    const $el = $(el)

    const titleEl = $el.find('[class*="game-info-title"], .game-info-title-link, h2 a, h3 a').first()
    const title = titleEl.text().trim()
    if (!title) return

    const href = titleEl.attr('href') ?? $el.find('a').first().attr('href') ?? ''
    const url = href.startsWith('http') ? href : `https://gg.deals${href}`

    const thumbnail =
      $el.find('img').first().attr('data-src') ??
      $el.find('img').first().attr('src') ??
      undefined

    // GG.deals shows expiry text like "Ends in 2 days" or a date
    const expiryText = $el.find('[class*="expiry"], [class*="time"], time').first().text().trim()
    const endDate = parseGGDealsExpiry(expiryText)

    const source: SourceLink = { store: 'ggdeals', url }
    offers.push({
      id: `ggdeals-${slugify(title)}`,
      title,
      thumbnail,
      offerType: 'giveaway',
      startDate: null,
      endDate,
      status: computeStatus(null, endDate),
      sources: [source],
    })
  })

  return offers
}

function parseGGDealsExpiry(text: string): string | null {
  if (!text) return null
  // Try to parse "Ends in X days/hours" style
  const inDays = text.match(/(\d+)\s*day/i)
  const inHours = text.match(/(\d+)\s*hour/i)
  if (inDays || inHours) {
    const ms =
      (parseInt(inDays?.[1] ?? '0') * 86400 + parseInt(inHours?.[1] ?? '0') * 3600) * 1000
    return new Date(Date.now() + ms).toISOString()
  }
  // Try direct date parse
  const d = new Date(text)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 60)
}
