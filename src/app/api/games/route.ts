import { NextResponse } from 'next/server'
import { getCached, setCached } from '@/lib/cache'
import { fetchAllOffers } from '@/lib/adapters'
import { deduplicateOffers } from '@/lib/dedup'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cached = await getCached()
  if (cached) {
    return NextResponse.json({ offers: cached, errors: {}, cached: true })
  }

  const { offers: raw, errors } = await fetchAllOffers()
  const offers = deduplicateOffers(raw)
  await setCached(offers)

  return NextResponse.json({ offers, errors, cached: false })
}
