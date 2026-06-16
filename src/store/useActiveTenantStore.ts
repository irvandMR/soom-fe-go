import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const TENANT_OPTIONS = [
  { id: "ten-1", name: "SOOM Sudirman", code: "TEN-SUD", is_active: true },
  { id: "ten-2", name: "SOOM Dago", code: "TEN-DAG", is_active: true },
  { id: "ten-3", name: "SOOM Central Kitchen", code: "TEN-PST", is_active: true },
  { id: "ten-4", name: "SOOM Margonda (Non-Aktif)", code: "TEN-MAR", is_active: false },
];

interface ActiveTenantStore {
  activeTenantId: string
  setActiveTenantId: (id: string) => void
}

export const useActiveTenantStore = create<ActiveTenantStore>()(
  persist(
    (set) => ({
      activeTenantId: 'ten-1', // Default to SOOM Sudirman (ten-1)
      setActiveTenantId: (id) => set({ activeTenantId: id }),
    }),
    {
      name: 'soom-active-tenant', // Key di localStorage
    }
  )
)
