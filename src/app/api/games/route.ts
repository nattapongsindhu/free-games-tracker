import { NextResponse } from 'next/server'
import { getCached, setCached } from '@/lib/cache'
import { ADAPTER_NAMES, fetchAllOffers } from '@/lib/adapters'
import { deduplicateOffers } from '@/lib/dedup'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cached = await getCached()
  if (cached) {
    return NextResponse.json({ offers: cached, errors: {}, cached: true })
  }

  const { offers: raw, errors } = await fetchAllOffers()
  const offers = deduplicateOffers(raw)
  const allSourcesFailed = Object.keys(errors).length === ADAPTER_NAMES.length

  if (allSourcesFailed) {
    const staleCached = await getCached({ allowStale: true })
    if (staleCached) {
      return NextResponse.json({ offers: staleCached, errors, cached: true, stale: true })
    }

    return NextResponse.json(
      { offers: [], errors, cached: false, stale: false },
      { status: 502 },
    )
  }

  await setCached(offers)

  return NextResponse.json({ offers, errors, cached: false, stale: false })
}
