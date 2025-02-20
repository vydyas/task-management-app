'use client'
import { useState, useCallback, useEffect } from 'react'

interface ResizableColumnProps {
  width: number
  onWidthChange: (width: number) => void
  minWidth?: number
  children: React.ReactNode
  flex?: boolean // Add flex prop to allow column to grow
}

export default function ResizableColumn({
  width,
  onWidthChange,
  minWidth = 100,
  children,
  flex = false // Default to false
}: ResizableColumnProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    setStartX(e.pageX)
    setStartWidth(width)
    e.preventDefault()
  }, [width])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return

    const diff = e.pageX - startX
    const newWidth = Math.max(minWidth, startWidth + diff)
    onWidthChange(newWidth)
  }, [isResizing, startX, startWidth, minWidth, onWidthChange])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add event listeners when resizing starts
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div 
      className={`relative flex items-center ${flex ? 'flex-1' : ''}`}
      style={{ 
        width: flex ? 'auto' : `${width}px`,
        minWidth: `${minWidth}px`
      }}
    >
      {children}
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-gray-200 transition-colors border-r border-gray-300"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
} 