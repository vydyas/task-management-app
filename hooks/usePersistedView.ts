'use client'
import { useState, useEffect } from 'react'

export function usePersistedView() {
  // Start with a default value
  const [view, setView] = useState<'table' | 'board'>('board')
  
  // Load the persisted value after mount
  useEffect(() => {
    const stored = localStorage.getItem('taskView')
    if (stored === 'table' || stored === 'board') {
      setView(stored)
    }
  }, [])

  // Update localStorage when view changes
  useEffect(() => {
    localStorage.setItem('taskView', view)
  }, [view])

  return [view, setView] as const
} 