import { useState, useCallback } from 'react'
import type { Stats, LevelInfo } from './types'

const LEVELS: Array<{ min: number } & LevelInfo> = [
  { min: 0,   label: 'Beginner',    color: 'var(--muted)',   next: 20  },
  { min: 20,  label: 'Novice',      color: 'var(--mint)',    next: 40  },
  { min: 40,  label: 'Apprentice',  color: 'var(--sky)',     next: 60  },
  { min: 60,  label: 'Skilled',     color: 'var(--accent)',  next: 80  },
  { min: 80,  label: 'Advanced',    color: 'var(--accent)',  next: 100 },
  { min: 100, label: 'Expert',      color: 'var(--warning)', next: 130 },
  { min: 130, label: 'Master',      color: 'var(--error)',   next: null },
]

export function getLevel(wpm: number): LevelInfo & { min: number } {
  return [...LEVELS].reverse().find(l => wpm >= l.min) ?? LEVELS[0]
}

function load(): Stats {
  try {
    const raw = localStorage.getItem('typeflow:stats')
    return raw ? JSON.parse(raw) : { pb: 0, testsCompleted: 0 }
  } catch {
    return { pb: 0, testsCompleted: 0 }
  }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(load)

  const recordResult = useCallback((wpm: number) => {
    setStats(prev => {
      const next: Stats = {
        pb: Math.max(prev.pb, wpm),
        testsCompleted: prev.testsCompleted + 1,
      }
      try { localStorage.setItem('typeflow:stats', JSON.stringify(next)) } catch { /* noop */ }
      return next
    })
  }, [])

  return { stats, recordResult }
}
