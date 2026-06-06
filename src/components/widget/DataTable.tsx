import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { type SortState } from './useDataQuery'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnDef<T = Record<string, unknown>> {
  key: string
  label: string
  render?: (value: unknown, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  rows: T[]
  isLoading?: boolean
  isError?: boolean
  sort?: SortState | null
  onSort?: (key: string) => void
  emptyMessage?: string
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ columnKey, sort }: { columnKey: string; sort?: SortState | null }) {
  if (!sort || sort.key !== columnKey)
    return <ChevronsUpDown size={11} className="text-muted-foreground/40" />
  return sort.dir === 'asc'
    ? <ChevronUp size={11} className="text-[var(--fandm-primary)]" />
    : <ChevronDown size={11} className="text-[var(--fandm-primary)]" />
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DataTable<T = Record<string, unknown>>({
  columns,
  rows,
  isLoading,
  isError,
  sort,
  onSort,
  emptyMessage = 'Belum ada data.',
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-[var(--fandm-border)] overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-[var(--fandm-bg)] hover:bg-[var(--fandm-bg)]">
            {columns.map(col => (
              <TableHead
                key={col.key}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(col.key)}
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                  col.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors'
                )}
              >
                <div className={cn(
                  'flex items-center gap-1',
                  col.align === 'center' && 'justify-center',
                  col.align === 'right' && 'justify-end',
                )}>
                  {col.label}
                  {col.sortable && <SortIcon columnKey={col.key} sort={sort} />}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-sm text-destructive">
                Gagal memuat data. Silakan coba lagi.
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={i} className="hover:bg-[var(--fandm-bg)] transition-colors">
                {columns.map(col => {
                  const val = (row as Record<string, unknown>)[col.key]
                  return (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'text-sm text-[var(--fandm-text)]',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                      )}
                    >
                      {col.render ? col.render(val, row) : String(val ?? '-')}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}