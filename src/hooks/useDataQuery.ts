import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataMeta {
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface SortState {
  key: string
  dir: 'asc' | 'desc'
}

export interface DataQueryResult<T> {
  rows: T[]
  meta: DataMeta | undefined
  isLoading: boolean
  isError: boolean
  search: string
  setSearch: (val: string) => void
  sort: SortState | null
  setSort: (key: string) => void
  activeFilters: Record<string, string>
  setFilter: (key: string, val: string) => void
  resetFilters: () => void
  page: number
  setPage: (p: number) => void
}

interface UseDataQueryOptions {
  url: string
  queryKey: string
  pageSize?: number
  extraParams?: Record<string, unknown>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDataQuery<T = Record<string, unknown>>({
  url,
  queryKey,
  pageSize = 10,
  extraParams = {},
}: UseDataQueryOptions): DataQueryResult<T> {

  const [page, setPage] = useState(1)
  const [search, setSearchRaw] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [sort, setSortRaw] = useState<SortState | null>(null)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const setSearch = (val: string) => {
    setSearchRaw(val)
    if (searchTimer) clearTimeout(searchTimer)
    const t = setTimeout(() => {
      setDebouncedSearch(val)
      setPage(1)
    }, 400)
    setSearchTimer(t)
  }

  const setSort = (key: string) => {
    setSortRaw(prev => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' }
      if (prev.dir === 'asc') return { key, dir: 'desc' }
      return null
    })
    setPage(1)
  }

  const setFilter = (key: string, val: string) => {
    setActiveFilters(prev => {
      if (!val) { const next = { ...prev }; delete next[key]; return next }
      return { ...prev, [key]: val }
    })
    setPage(1)
  }

  const resetFilters = () => { setActiveFilters({}); setPage(1) }

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey, page, pageSize, debouncedSearch, sort, activeFilters, extraParams],
    queryFn: async () => {
      const params = {
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(sort && { sort_by: sort.key, sort_dir: sort.dir }),
        ...activeFilters,
        ...extraParams,
      }
      const res = await api.get(url, { params })
      return res.data.result
    },
  })

  return {
    rows: data?.data ?? [],
    meta: {
      total: data?.total ?? 0,
      page: data?.page ?? 1,
      limit: data?.limit ?? pageSize,
      total_pages: data?.total_pages ?? 1,
    },
    isLoading,
    isError,
    search,
    setSearch,
    sort,
    setSort,
    activeFilters,
    setFilter,
    resetFilters,
    page,
    setPage,
  }
}