'use client'
import { motion } from 'framer-motion'

interface ViewToggleProps {
  view: 'table' | 'board'
  onChange: (view: 'table' | 'board') => void
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onChange('table')}
        className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
          view === 'table' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {view === 'table' && (
          <motion.div
            layoutId="viewIndicator"
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative">Table</span>
      </button>
      <button
        onClick={() => onChange('board')}
        className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
          view === 'board' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {view === 'board' && (
          <motion.div
            layoutId="viewIndicator"
            className="absolute inset-0 bg-white rounded-md shadow-sm"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative">Board</span>
      </button>
    </div>
  )
} 