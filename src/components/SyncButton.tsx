'use client'

import { useState } from 'react'
import { GameOffer } from '@/lib/types'

interface Props {
  onSync: (payload: { offers: GameOffer[]; errors: Record<string, string> }) => void
}

export function SyncButton({ onSync }: Props) {
  const canManualSync = process.env.NODE_ENV !== 'production'
  const [loading, setLoading] = useState(false)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!canManualSync) {
    return null
  }

  async function handleSync() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Sync failed.')
      }

      onSync({ offers: data.offers ?? [], errors: data.errors ?? {} })
      setLastSynced(new Date())
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sync failed.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-3">
        <button
          onClick={handleSync}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? 'Syncing...' : 'Sync now'}
        </button>
        {lastSynced && (
          <span className="text-xs text-gray-500">
            Last synced {lastSynced.toLocaleTimeString()}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
