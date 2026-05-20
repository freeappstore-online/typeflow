import type { ReactNode } from 'react'

interface ShellProps {
  children: ReactNode
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="relative min-h-[100dvh]">
      <div className="mx-auto max-w-[1540px] px-2 pt-1 sm:px-4 lg:px-8 lg:py-8">
        <div className="min-h-[100dvh] pb-14 pt-12 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-7 lg:pb-0 lg:pt-0">

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex lg:min-h-[calc(100dvh-4rem)] lg:flex-col lg:gap-5 lg:rounded-[2rem] lg:border lg:border-[var(--line)] lg:bg-[var(--glass-strong)] lg:p-6 lg:shadow-[var(--shadow-soft)] lg:backdrop-blur-xl">
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--glass)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)] w-fit">
                typeflow
              </div>
              <p className="text-[0.7rem] text-[var(--muted)] pl-1 mt-1">
                test your typing speed
              </p>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--ink)] bg-[var(--glass)] border border-[var(--line)]">
                <span className="text-[var(--accent)]">⌨</span>
                Speed Test
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <div className="rounded-xl border border-[var(--line)] bg-[var(--glass-soft)] p-3 text-[0.65rem] text-[var(--muted)] leading-relaxed">
                <span className="font-semibold text-[var(--ink)]">Tips:</span>
                <ul className="mt-1 space-y-0.5 list-none">
                  <li>· Space to submit a word</li>
                  <li>· Backspace to go back</li>
                  <li>· Esc to restart</li>
                </ul>
              </div>
              <p className="text-[0.65rem] text-[var(--muted)]">
                Part of{' '}
                <a
                  href="https://freeappstore.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--ink)]"
                >
                  FreeAppStore
                </a>
              </p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--dock)]/92 px-4 py-2 backdrop-blur-2xl lg:hidden"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)]">typeflow</span>
      </header>

      {/* Mobile dock */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--dock)]/92 px-2 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-1 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto grid max-w-xs grid-cols-1 py-2">
          <a
            href="https://freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]"
          >
            Part of FreeAppStore
          </a>
        </div>
      </nav>
    </div>
  )
}
