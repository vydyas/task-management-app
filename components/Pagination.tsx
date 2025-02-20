'use client'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 20, 50]

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="h-12 flex items-center justify-between px-4 text-sm text-gray-500">
      <div className="flex items-center gap-4">
        <span>
          {startItem}-{endItem} of {totalItems}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 border-0 bg-transparent text-gray-500 focus:ring-0"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <span className="w-8 text-center">{currentPage}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
} 