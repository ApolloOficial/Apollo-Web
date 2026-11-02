import './TableSkeleton.css'

interface TableSkeletonProps {
  rows?: number
}

export function TableSkeleton({ rows = 6 }: TableSkeletonProps) {
  return (
    <div className="table-skeleton" role="status" aria-label="Carregando">
      {Array.from({ length: rows }, (_, index) => (
        <span key={index} className="table-skeleton__row" />
      ))}
    </div>
  )
}
