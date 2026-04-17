'use client'

import { GameOffer, STORE_LABELS, StoreId } from '@/lib/types'
import { isEndingSoon } from '@/lib/status'
import Image from 'next/image'

const STORE_COLORS: Record<StoreId, string> = {
  epic: 'bg-gray-700 text-white',
  steam: 'bg-blue-700 text-white',
  playstation: 'bg-blue-500 text-white',
  ggdeals: 'bg-green-700 text-white',
  isthereanydeal: 'bg-orange-600 text-white',
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-600 text-white',
  upcoming: 'bg-yellow-500 text-black',
  ended: 'bg-gray-600 text-gray-300',
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export function GameCard({ offer }: { offer: GameOffer }) {
  const endingSoon = isEndingSoon(offer.endDate)

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col border border-gray-700 hover:border-gray-500 transition-colors">
      <div className="relative h-36 bg-gray-900">
        {offer.thumbnail ? (
          <Image
            src={offer.thumbnail}
            alt={offer.title}
            fill
            className="object-cover"
            loading="eager"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
            No image
          </div>
        )}
        {endingSoon && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
            Ending soon
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2">
          {offer.title}
        </h3>

        <div className="flex flex-wrap gap-1">
          <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[offer.status]}`}>
            {offer.status}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-purple-700 text-white">
            {offer.offerType === 'subscription' ? 'PS Plus' : 'Giveaway'}
          </span>
        </div>

        <div className="text-xs text-gray-400 space-y-0.5">
          <div>
            <span className="text-gray-500">Start:</span> {formatDate(offer.startDate)}
          </div>
          <div>
            <span className="text-gray-500">End:</span> {formatDate(offer.endDate)}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {offer.sources.map(src => (
            <a
              key={src.store}
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs px-2 py-0.5 rounded ${STORE_COLORS[src.store]} hover:opacity-80 transition-opacity`}
            >
              {STORE_LABELS[src.store]}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
