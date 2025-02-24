// stores/trash-store.ts
import { create } from "zustand"

type TTrashItem = {
  id: number
  level: number
  url: string
  x: number
  y: number
}

interface TrashStore {
  // State
  trashItems: TTrashItem[]
  idCounter: number

  // Actions
  addTrashItems: (items: Omit<TTrashItem, "id">[]) => void
  removeTrashItem: (id: number) => void
  clearAllTrash: () => void
  updateTrashItem: (
    id: number,
    updates: Partial<Omit<TTrashItem, "id">>,
  ) => void
  getTrashById: (id: number) => TTrashItem | undefined
  getTrashByLevel: (level: number) => TTrashItem[]
}

export const useTrashStore = create<TrashStore>((set, get) => ({
  // Initial state
  trashItems: [],
  idCounter: 0,

  // Actions
  addTrashItems: (items) => {
    set((state) => {
      const newItems = items.map((item) => ({
        ...item,
        id: state.idCounter + items.indexOf(item),
      }))

      return {
        trashItems: [...state.trashItems, ...newItems],
        idCounter: state.idCounter + items.length,
      }
    })
  },

  removeTrashItem: (id) => {
    set((state) => ({
      trashItems: state.trashItems.filter((item) => item.id !== id),
    }))
  },

  clearAllTrash: () => {
    set({ trashItems: [] })
  },

  updateTrashItem: (id, updates) => {
    set((state) => ({
      trashItems: state.trashItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    }))
  },

  getTrashById: (id) => {
    return get().trashItems.find((item) => item.id === id)
  },

  getTrashByLevel: (level) => {
    return get().trashItems.filter((item) => item.level === level)
  },
}))

// Optional-select: 나중에 필요할때 사용
export const selectAllTrash = (state: TrashStore) => state.trashItems
export const selectTrashCount = (state: TrashStore) => state.trashItems.length
export const selectTrashByLevel = (level: number) => (state: TrashStore) =>
  state.trashItems.filter((item) => item.level === level)
