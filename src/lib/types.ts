export type StoreId = 'epic' | 'steam' | 'playstation' | 'ggdeals' | 'isthereanydeal'
export type OfferType = 'giveaway' | 'subscription'
export type OfferStatus = 'active' | 'upcoming' | 'ended'

export interface SourceLink {
  store: StoreId
  url: string
}

export interface GameOffer {
  id: string
  title: string
  thumbnail?: string
  offerType: OfferType
  startDate: string | null  // ISO UTC
  endDate: string | null    // ISO UTC
  status: OfferStatus
  sources: SourceLink[]
}

export const STORE_LABELS: Record<StoreId, string> = {
  epic: 'Epic Games',
  steam: 'Steam',
  playstation: 'PlayStation Plus',
  ggdeals: 'GG.deals',
  isthereanydeal: 'IsThereAnyDeal',
}
