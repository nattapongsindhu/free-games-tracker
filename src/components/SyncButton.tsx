'use client'

import { useState } from 'react'
import { GameOffer } from '@/lib/types'

interface Props {
  onSync: (offers: GameOffer[]) => void
}

export function SyncButton({ onSync }: Props) {
  const [loading, setLoading] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  async function handleSync() {
    setLoading(true)
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()
      onSync(data.offers)
      setLastSynced(new Date())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? 'Syncing…' : 'Sync now'}
      </button>
      {lastSynced && (
        <span className="text-xs text-gray-500">
          Last synced {lastSynced.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
