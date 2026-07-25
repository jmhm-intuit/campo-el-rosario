import type { AppState } from '../types'

export interface CampoDataStore {
  load(): Promise<AppState | null>
  save(state: AppState): Promise<void>
  clear(): Promise<void>
}

const DB_NAME = 'campo-el-rosario'
const DB_VERSION = 1
const STORE_NAME = 'app-state'
const STATE_KEY = 'current'

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('No se pudo abrir IndexedDB.'))
  })
}

class IndexedDbStore implements CampoDataStore {
  async load(): Promise<AppState | null> {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const request = transaction.objectStore(STORE_NAME).get(STATE_KEY)
      request.onsuccess = () => resolve((request.result as AppState | undefined) ?? null)
      request.onerror = () => reject(request.error ?? new Error('No se pudo leer la base local.'))
      transaction.oncomplete = () => db.close()
    })
  }

  async save(state: AppState): Promise<void> {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).put(state, STATE_KEY)
      transaction.oncomplete = () => {
        db.close()
        resolve()
      }
      transaction.onerror = () => {
        db.close()
        reject(transaction.error ?? new Error('No se pudo guardar la base local.'))
      }
    })
  }

  async clear(): Promise<void> {
    const db = await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      transaction.objectStore(STORE_NAME).delete(STATE_KEY)
      transaction.oncomplete = () => {
        db.close()
        resolve()
      }
      transaction.onerror = () => {
        db.close()
        reject(transaction.error ?? new Error('No se pudo limpiar la base local.'))
      }
    })
  }
}

class LocalStorageFallback implements CampoDataStore {
  private key = 'campo-el-rosario-state'

  async load(): Promise<AppState | null> {
    const stored = localStorage.getItem(this.key)
    return stored ? (JSON.parse(stored) as AppState) : null
  }

  async save(state: AppState): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(state))
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key)
  }
}

class ResilientBrowserStore implements CampoDataStore {
  constructor(
    private readonly primary: CampoDataStore,
    private readonly fallback: CampoDataStore,
  ) {}

  async load(): Promise<AppState | null> {
    try {
      const primaryState = await this.primary.load()
      if (primaryState) return primaryState
    } catch {
      // Some browsers expose IndexedDB but block it in restricted/private modes.
    }
    return this.fallback.load()
  }

  async save(state: AppState): Promise<void> {
    try {
      await this.primary.save(state)
      // Remove an older emergency copy once the primary database is healthy again.
      try {
        await this.fallback.clear()
      } catch {
        // The primary save succeeded; a blocked fallback should not surface as failure.
      }
    } catch {
      await this.fallback.save(state)
    }
  }

  async clear(): Promise<void> {
    const results = await Promise.allSettled([this.primary.clear(), this.fallback.clear()])
    if (results.every((result) => result.status === 'rejected')) {
      throw new Error('No se pudo limpiar el almacenamiento local.')
    }
  }
}

const fallbackStore = new LocalStorageFallback()

export const dataStore: CampoDataStore =
  typeof indexedDB !== 'undefined'
    ? new ResilientBrowserStore(new IndexedDbStore(), fallbackStore)
    : fallbackStore
