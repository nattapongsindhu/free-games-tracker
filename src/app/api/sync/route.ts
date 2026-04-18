import { NextResponse } from 'next/server'
import { invalidateCache, setCached } from '@/lib/cache'
import { fetchAllOffers } from '@/lib/adapters'
import { deduplicateOffers } from '@/lib/dedup'

export const dynamic = 'force-dynamic'

export async function POST() {
  await invalidateCache()
  const { offers: raw, errors } = await fetchAllOffers()
  const offers = deduplicateOffers(raw)
  await setCached(offers)
  return NextResponse.json({ offers, errors, synced: true })
}
