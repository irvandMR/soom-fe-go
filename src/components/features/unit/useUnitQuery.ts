import { useDataQuery } from '@/components/widget/useDataQuery'

export interface Unit {
  Id: string
  Name: string
  Symbol: string
  CreatedAt: string
  UpdatedAt: string
}

export function useUnitQuery() {
  return useDataQuery<Unit>({
    url: '/uoms',
    queryKey: 'units',
    pageSize: 10,
  })
}