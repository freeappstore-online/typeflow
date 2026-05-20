import { useState, useEffect } from 'react'
import type { Theme } from './types'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('typeflow:theme') as Theme) ?? 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.dataset.theme = 'dark'
    } else {
      delete document.documentElement.dataset.theme
    }
    try { localStorage.setItem('typeflow:theme', theme) } catch { /* noop */ }
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return { theme, toggleTheme }
}
