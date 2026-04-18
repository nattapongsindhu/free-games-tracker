import { NextResponse } from 'next/server'
import { getCached, setCached } from '@/lib/cache'
import { ADAPTER_NAMES, fetchAllOffers } from '@/lib/adapters'
import { deduplicateOffers } from '@/lib/dedup'

export const dynamic = 'force-dynamic'

function getRequestKey(request: Request): string | null {
  const direct = request.headers.get('x-sync-key')
  if (direct) return direct

  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    return auth.slice('Bearer '.length)
  }

  return null
}

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export async function POST(request: Request) {
  const expectedKey = process.env.SYNC_API_KEY

  if (isProduction() && !expectedKey) {
    return NextResponse.json(
      { error: 'SYNC_API_KEY must be configured to use /api/sync in production.' },
      { status: 503 },
    )
  }

  if (expectedKey && getRequestKey(request) !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized sync request.' }, { status: 401 })
  }

  const { offers: raw, errors } = await fetchAllOffers()
  const offers = deduplicateOffers(raw)
  const allSourcesFailed = Object.keys(errors).length === ADAPTER_NAMES.length

  if (allSourcesFailed) {
    const staleCached = await getCached({ allowStale: true })

    return NextResponse.json(
      {
        offers: staleCached ?? [],
        errors,
        synced: false,
        stale: Boolean(staleCached),
      },
      { status: 502 },
    )
  }

  await setCached(offers)

  return NextResponse.json({ offers, errors, synced: true, stale: false })
}
