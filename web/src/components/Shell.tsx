import type { ReactNode } from 'react'
import type { Theme, Stats } from '../types'
import { getLevel } from '../useStats'

interface ShellProps {
  children: ReactNode
  theme: Theme
  onToggleTheme: () => void
  stats: Stats
}

export function Shell({ children, theme, onToggleTheme, stats }: ShellProps) {
  const level = getLevel(stats.pb)
  const nextWpm = level.next

  return (
    <div className="relative min-h-[100dvh]">
      <div className="mx-auto max-w-[1540px] px-2 pt-1 sm:px-4 lg:px-8 lg:py-8">
        <div className="min-h-[100dvh] pb-14 pt-12 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7 lg:pb-0 lg:pt-0">

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex lg:min-h-[calc(100dvh-4rem)] lg:flex-col lg:gap-5 lg:rounded-[2rem] lg:border lg:border-[var(--line)] lg:bg-[var(--glass-strong)] lg:p-6 lg:shadow-[var(--shadow-soft)] lg:backdrop-blur-xl">

            {/* Brand */}
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--glass)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)] w-fit">
                typeflow
              </div>
              <p className="text-[0.7rem] text-[var(--muted)] pl-1 mt-0.5">test your typing speed</p>
            </div>

            {/* Nav */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--ink)] bg-[var(--glass)] border border-[var(--line)]">
                <span className="text-[var(--accent)]">⌨</span>
                Speed Test
              </div>
            </div>

            {/* Level card */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--glass-soft)] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--muted)]">your level</span>
                <span className="text-xs font-bold" style={{ color: level.color }}>{level.label}</span>
              </div>

              {stats.pb > 0 ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--ink)] tabular-nums">{stats.pb}</span>
                    <span className="text-xs text-[var(--muted)]">wpm pb</span>
                  </div>
                  {nextWpm && (
                    <div>
                      <div className="flex justify-between text-[0.6rem] text-[var(--muted)] mb-1">
                        <span>{level.label}</span>
                        <span>{level.next} wpm →</span>
                      </div>
                      <div className="h-1 rounded-full bg-[var(--line-strong)] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, ((stats.pb - level.min) / (nextWpm - level.min)) * 100)}%`,
                            background: level.color,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-[0.65rem] text-[var(--muted)]">{stats.testsCompleted} test{stats.testsCompleted !== 1 ? 's' : ''} completed</p>
                </>
              ) : (
                <p className="text-[0.7rem] text-[var(--muted)]">Complete a test to track progress</p>
              )}
            </div>

            {/* Tips */}
            <div className="rounded-xl border border-[var(--line)] bg-[var(--glass-soft)] p-3 text-[0.65rem] text-[var(--muted)] leading-relaxed">
              <span className="font-semibold text-[var(--ink)]">Tips</span>
              <ul className="mt-1.5 space-y-1">
                <li>· Space to submit a word</li>
                <li>· Backspace to go back a word</li>
                <li>· Esc to restart at any time</li>
                <li>· Click the text area to focus</li>
              </ul>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              {/* Theme toggle */}
              <button
                onClick={onToggleTheme}
                className="flex items-center justify-between w-full rounded-xl border border-[var(--line)] bg-[var(--glass-soft)] px-3 py-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--glass-hover)] transition-colors"
              >
                <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
                <span className="text-base leading-none">{theme === 'dark' ? '☀' : '☾'}</span>
              </button>

              <p className="text-[0.65rem] text-[var(--muted)]">
                Part of{' '}
                <a href="https://freeappstore.online" target="_blank" rel="noopener noreferrer"
                  className="underline hover:text-[var(--ink)]">
                  FreeAppStore
                </a>
              </p>
            </div>
          </aside>

          {/* Main */}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile header */}
      <header
        className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--dock)]/92 px-4 backdrop-blur-2xl lg:hidden"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.4rem)', paddingBottom: '0.4rem' }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)]">typeflow</span>
        <div className="flex items-center gap-3">
          {stats.pb > 0 && (
            <span className="text-[0.65rem] font-bold text-[var(--muted)] tabular-nums">
              pb {stats.pb}
            </span>
          )}
          <button
            onClick={onToggleTheme}
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            aria-label="toggle theme"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      {/* Mobile dock */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--dock)]/92 px-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between py-2">
          <a href="https://freeappstore.online" target="_blank" rel="noopener noreferrer"
            className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            FreeAppStore
          </a>
          {stats.pb > 0 && (
            <span className="text-[0.65rem] text-[var(--muted)]" style={{ color: getLevel(stats.pb).color }}>
              {getLevel(stats.pb).label}
            </span>
          )}
        </div>
      </nav>
    </div>
  )
}
