import { GameOffer, SourceLink } from '../types'
import { computeStatus } from '../status'

const API_URL =
  'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US'

interface PromoOffer {
  startDate: string
  endDate: string
  discountSetting: { discountPercentage: number }
}

interface EpicElement {
  title: string
  id: string
  productSlug?: string
  urlSlug?: string
  keyImages: { type: string; url: string }[]
  promotions: {
    promotionalOffers: { promotionalOffers: PromoOffer[] }[]
    upcomingPromotionalOffers: { promotionalOffers: PromoOffer[] }[]
  } | null
}

export async function fetchEpicOffers(): Promise<GameOffer[]> {
  const res = await fetch(API_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Epic API responded ${res.status}`)
  const json = await res.json()
  const elements: EpicElement[] = json?.data?.Catalog?.searchStore?.elements ?? []

  const offers: GameOffer[] = []
  for (const el of elements) {
    if (!el.promotions) continue

    const current = el.promotions.promotionalOffers.flatMap(g => g.promotionalOffers)
    const upcoming = el.promotions.upcomingPromotionalOffers.flatMap(g => g.promotionalOffers)

    const promo = current[0] ?? upcoming[0]
    if (!promo) continue
    if (promo.discountSetting.discountPercentage !== 0) continue  // 0 = 100% off in Epic's model

    const slug = el.productSlug ?? el.urlSlug ?? el.id
    const url = `https://store.epicgames.com/en-US/p/${slug}`
    const thumbnail =
      el.keyImages.find(img => img.type === 'Thumbnail')?.url ?? el.keyImages[0]?.url

    const source: SourceLink = { store: 'epic', url }
    offers.push({
      id: `epic-${el.id}`,
      title: el.title,
      thumbnail,
      offerType: 'giveaway',
      startDate: promo.startDate,
      endDate: promo.endDate,
      status: computeStatus(promo.startDate, promo.endDate),
      sources: [source],
    })
  }
  return offers
}
