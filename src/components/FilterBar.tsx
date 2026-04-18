'use client'

import { StoreId, OfferStatus, STORE_LABELS } from '@/lib/types'

const ALL_STORES: StoreId[] = ['epic', 'steam', 'playstation', 'ggdeals', 'isthereanydeal']
const ALL_STATUSES: OfferStatus[] = ['active', 'upcoming', 'ended']

interface Props {
  selectedStores: StoreId[]
  selectedStatuses: OfferStatus[]
  onStoreToggle: (store: StoreId) => void
  onStatusToggle: (status: OfferStatus) => void
  onReset: () => void
}

export function FilterBar({
  selectedStores,
  selectedStatuses,
  onStoreToggle,
  onStatusToggle,
  onReset,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <span className="text-gray-400 font-medium">Source:</span>
      {ALL_STORES.map(store => (
        <button
          key={store}
          onClick={() => onStoreToggle(store)}
          className={`px-3 py-1 rounded-full border transition-colors ${
            selectedStores.includes(store)
              ? 'bg-white text-gray-900 border-white'
              : 'border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          {STORE_LABELS[store]}
        </button>
      ))}

      <span className="text-gray-400 font-medium ml-2">Status:</span>
      {ALL_STATUSES.map(status => (
        <button
          key={status}
          onClick={() => onStatusToggle(status)}
          className={`px-3 py-1 rounded-full border transition-colors capitalize ${
            selectedStatuses.includes(status)
              ? 'bg-white text-gray-900 border-white'
              : 'border-gray-600 text-gray-400 hover:border-gray-400'
          }`}
        >
          {status}
        </button>
      ))}

      <button
        onClick={onReset}
        className="ml-auto text-xs text-gray-500 hover:text-gray-300 underline"
      >
        Reset filters
      </button>
    </div>
  )
}
