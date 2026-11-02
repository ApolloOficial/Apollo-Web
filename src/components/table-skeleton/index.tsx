import './TableSkeleton.css'

interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 6 }: TableSkeletonProps) {
  return (
    <div className="table-skeleton" role="status" aria-label="Carregando">
      {Array.from({ length: rows }, (_, row) => `row-${row + 1}`).map((id) => (
        <span key={id} className="table-skeleton__row" />
      ))}
    </div>
  )
}
