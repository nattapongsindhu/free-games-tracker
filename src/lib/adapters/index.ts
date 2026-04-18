import { GameOffer } from '../types'
import { fetchEpicOffers } from './epic'
import { fetchSteamOffers } from './steam'
import { fetchPlayStationOffers } from './playstation'
import { fetchGGDealsOffers } from './ggdeals'
import { fetchITADOffers } from './isthereanydeal'

type AdapterFn = () => Promise<GameOffer[]>

const adapters: { name: string; fn: AdapterFn }[] = [
  { name: 'epic', fn: fetchEpicOffers },
  { name: 'steam', fn: fetchSteamOffers },
  { name: 'playstation', fn: fetchPlayStationOffers },
  { name: 'ggdeals', fn: fetchGGDealsOffers },
  { name: 'isthereanydeal', fn: fetchITADOffers },
]

export const ADAPTER_NAMES = adapters.map(adapter => adapter.name)

export interface FetchResult {
  offers: GameOffer[]
  errors: Record<string, string>
}

export async function fetchAllOffers(): Promise<FetchResult> {
  const results = await Promise.allSettled(adapters.map(a => a.fn()))
  const offers: GameOffer[] = []
  const errors: Record<string, string> = {}

  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.status === 'fulfilled') {
      offers.push(...r.value)
    } else {
      const msg = r.reason instanceof Error ? r.reason.message : String(r.reason)
      errors[adapters[i].name] = msg
      console.warn(`[${adapters[i].name}] failed:`, msg)
    }
  }

  return { offers, errors }
}
