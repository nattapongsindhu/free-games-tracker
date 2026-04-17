import { GameOffer } from './types'
import { promises as fs } from 'fs'
import path from 'path'

const CACHE_FILE = path.join(process.cwd(), '.cache', 'games.json')
const TTL_MS = 60 * 60 * 1000 // 1 hour

interface CacheData {
  fetchedAt: number
  offers: GameOffer[]
}

// Module-level memory cache survives across requests in the same process
let memCache: CacheData | null = null

export async function getCached(): Promise<GameOffer[] | null> {
  if (memCache && Date.now() - memCache.fetchedAt < TTL_MS) {
    return memCache.offers
  }
  try {
    const raw = await fs.readFile(CACHE_FILE, 'utf-8')
    const data: CacheData = JSON.parse(raw)
    if (Date.now() - data.fetchedAt < TTL_MS) {
      memCache = data
      return data.offers
    }
  } catch {
    // cache miss or corrupt file — fetch fresh
  }
  return null
}

export async function setCached(offers: GameOffer[]): Promise<void> {
  const data: CacheData = { fetchedAt: Date.now(), offers }
  memCache = data
  try {
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true })
    await fs.writeFile(CACHE_FILE, JSON.stringify(data))
  } catch {
    // non-fatal: memory cache still works
  }
}

export async function invalidateCache(): Promise<void> {
  memCache = null
  try {
    await fs.unlink(CACHE_FILE)
  } catch {
    // already gone — fine
  }
}
