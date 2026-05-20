import { Shell } from './components/Shell.tsx'
import { TypingArea } from './components/TypingArea.tsx'
import { useTheme } from './useTheme.ts'
import { useStats } from './useStats.ts'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const { stats, recordResult } = useStats()

  return (
    <Shell theme={theme} onToggleTheme={toggleTheme} stats={stats}>
      <TypingArea currentPb={stats.pb} onResult={recordResult} />
    </Shell>
  )
}
