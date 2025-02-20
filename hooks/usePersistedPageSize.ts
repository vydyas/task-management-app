'use client'
import { useState, useEffect } from 'react'

const PAGE_SIZE_KEY = 'taskTablePageSize'
const DEFAULT_PAGE_SIZE = 10

export function usePersistedPageSize() {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  
  useEffect(() => {
    const stored = localStorage.getItem(PAGE_SIZE_KEY)
    if (stored) {
      setPageSize(Number(stored))
    }
  }, [])

  const updatePageSize = (size: number) => {
    setPageSize(size)
    localStorage.setItem(PAGE_SIZE_KEY, String(size))
  }

  return [pageSize, updatePageSize] as const
} 