'use client'

import { useEffect, useState, useCallback } from 'react'
import { GameOffer, StoreId, OfferStatus } from '@/lib/types'
import { isEndingSoon } from '@/lib/status'
import { GameCard } from '@/components/GameCard'
import { FilterBar } from '@/components/FilterBar'
import { SyncButton } from '@/components/SyncButton'

const ALL_STORES: StoreId[] = ['epic', 'steam', 'playstation', 'ggdeals', 'isthereanydeal']

function Section({ title, offers }: { title: string; offers: GameOffer[] }) {
  if (offers.length === 0) return null
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-200 mb-3">
        {title}
        <span className="ml-2 text-sm font-normal text-gray-500">({offers.length})</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {offers.map(o => (
          <GameCard key={o.id} offer={o} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const [offers, setOffers] = useState<GameOffer[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedStores, setSelectedStores] = useState<StoreId[]>([...ALL_STORES])
  const [selectedStatuses, setSelectedStatuses] = useState<OfferStatus[]>(['active', 'upcoming'])

  useEffect(() => {
    fetch('/api/games')
      .then(r => r.json())
      .then(data => {
        setOffers(data.offers ?? [])
        setErrors(data.errors ?? {})
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleStore = useCallback((store: StoreId) => {
    setSelectedStores(prev =>
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store],
    )
  }, [])

  const toggleStatus = useCallback((status: OfferStatus) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status],
    )
  }, [])

  const resetFilters = useCallback(() => {
    setSelectedStores([...ALL_STORES])
    setSelectedStatuses(['active', 'upcoming'])
  }, [])

  const filtered = offers.filter(
    o =>
      selectedStatuses.includes(o.status) &&
      o.sources.some(s => selectedStores.includes(s.store)),
  )

  const endingSoon = filtered.filter(o => o.status === 'active' && isEndingSoon(o.endDate))
  const active = filtered.filter(o => o.status === 'active' && !isEndingSoon(o.endDate))
  const upcoming = filtered.filter(o => o.status === 'upcoming')
  const ended = filtered.filter(o => o.status === 'ended')

  const errorEntries = Object.entries(errors)

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-8 max-w-screen-xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Free Games Tracker</h1>
          <p className="text-gray-400 text-sm mt-1">
            Giveaways and free offers from Epic, Steam, PlayStation, GG.deals, and IsThereAnyDeal
          </p>
        </div>
        <SyncButton
          onSync={({ offers: fresh, errors: syncErrors }) => {
            setOffers(fresh)
            setErrors(syncErrors)
          }}
        />
      </div>

      {errorEntries.length > 0 && (
        <div className="mb-6 p-3 bg-yellow-900/40 border border-yellow-700 rounded-lg text-sm text-yellow-300">
          <strong>Some sources failed:</strong>
          <ul className="mt-1 list-disc list-inside">
            {errorEntries.map(([src, msg]) => (
              <li key={src}>
                <span className="capitalize">{src}</span>: {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <FilterBar
          selectedStores={selectedStores}
          selectedStatuses={selectedStatuses}
          onStoreToggle={toggleStore}
          onStatusToggle={toggleStatus}
          onReset={resetFilters}
        />
      </div>

      {loading ? (
        <div className="text-center py-24 text-gray-500">Loading offers…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-500">No offers match your filters.</div>
      ) : (
        <div className="flex flex-col gap-10">
          <Section title="Ending Soon" offers={endingSoon} />
          <Section title="Free Now" offers={active} />
          <Section title="Upcoming" offers={upcoming} />
          <Section title="Ended" offers={ended} />
        </div>
      )}
    </main>
  )
}
