import { useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { useTypingTest } from '../useTypingTest'
import type { TestMode, WordData } from '../types'

const MODES: TestMode[] = [15, 30, 60, 120]

function WordDisplay({
  word,
  isActive,
  isPast,
  currentInput,
}: {
  word: WordData
  isActive: boolean
  isPast: boolean
  currentInput: string
}) {
  const typed = isActive ? currentInput : word.typed
  const extra = typed.slice(word.word.length)

  return (
    <span>
      {word.chars.map((c, ci) => (
        <span key={ci}>
          {isActive && ci === typed.length && <span className="caret-bar" aria-hidden />}
          <span
            className={
              c.state === 'correct'
                ? isPast
                  ? 'text-[var(--ink)] opacity-40'
                  : 'text-[var(--ink)]'
                : c.state === 'incorrect'
                  ? 'text-[var(--error)]'
                  : 'opacity-25'
            }
          >
            {c.char}
          </span>
        </span>
      ))}
      {extra.split('').map((ch, i) => (
        <span key={`x${i}`} className="text-[var(--error)] opacity-60">{ch}</span>
      ))}
      {isActive && typed.length >= word.word.length + extra.length && (
        <span className="caret-bar" aria-hidden />
      )}
    </span>
  )
}

export function TypingArea() {
  const {
    mode, testState, words, wordIdx, currentInput,
    timeLeft, result, liveWpm, liveAccuracy,
    handleInput, handleKeyDown, reset, changeMode,
  } = useTypingTest()

  const inputRef = useRef<HTMLInputElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)
  const activeWordRef = useRef<HTMLSpanElement>(null)

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  useEffect(() => { focusInput() }, [focusInput])

  // Scroll so the active word is always in the top visible band
  useEffect(() => {
    const container = wordsContainerRef.current
    const word = activeWordRef.current
    if (!container || !word) return
    const lineH = word.offsetHeight
    if (word.offsetTop - container.scrollTop > lineH * 1.8) {
      container.scrollTop = word.offsetTop - lineH
    }
  }, [wordIdx])

  // Results screen
  if (testState === 'finished' && result) {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-10 px-4"
        onClick={focusInput}
      >
        <div className="text-center">
          <p className="text-[var(--muted)] text-xs font-bold uppercase tracking-[0.2em] mb-2">wpm</p>
          <p className="display-font text-[6rem] sm:text-[8rem] font-bold text-[var(--accent)] leading-none">
            {result.wpm}
          </p>
        </div>

        <div className="flex gap-8 sm:gap-12 text-center">
          {[
            { label: 'accuracy', value: `${result.accuracy}%` },
            { label: 'raw', value: String(result.rawWpm) },
            { label: 'time', value: `${result.mode}s` },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[var(--muted)] text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.97]"
          >
            try again
          </button>
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => changeMode(m)}
              className={[
                'px-4 py-2.5 rounded-full text-sm font-semibold transition-colors',
                m === result.mode
                  ? 'bg-[var(--glass-strong)] border border-[var(--line-strong)] text-[var(--ink)]'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]',
              ].join(' ')}
            >
              {m}s
            </button>
          ))}
        </div>

        {/* Hidden input stays active so keyboard shortcuts work */}
        <input
          ref={inputRef}
          readOnly
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); reset() }
          }}
          className="absolute"
          style={{ opacity: 0, top: -9999, left: -9999, width: 1, height: 1 }}
          aria-label="typing input"
        />
      </div>
    )
  }

  const isRunning = testState === 'running'

  return (
    <div
      className="flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-10 max-w-2xl mx-auto w-full gap-6"
      onClick={focusInput}
    >
      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {MODES.map(m => (
            <button
              key={m}
              onClick={e => { e.stopPropagation(); changeMode(m) }}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all',
                m === mode
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]',
              ].join(' ')}
            >
              {m}s
            </button>
          ))}
        </div>

        <div className="flex items-baseline gap-4">
          {isRunning && (
            <>
              <span className="tabular-nums text-sm font-semibold text-[var(--muted)]">
                {liveWpm} <span className="font-normal text-xs">wpm</span>
              </span>
              <span className="tabular-nums text-sm font-semibold text-[var(--muted)]">
                {liveAccuracy}<span className="font-normal text-xs">%</span>
              </span>
            </>
          )}
          <span
            className={[
              'tabular-nums display-font text-3xl font-bold leading-none transition-colors',
              isRunning && timeLeft <= 5 ? 'text-[var(--error)]' : 'text-[var(--ink)]',
            ].join(' ')}
          >
            {testState === 'idle' ? mode : timeLeft}
          </span>
        </div>
      </div>

      {/* Word display */}
      <div
        ref={wordsContainerRef}
        className="overflow-hidden h-[8.5rem] cursor-text select-none relative"
        style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)' }}
      >
        <div className="flex flex-wrap gap-x-[0.6rem] gap-y-[0.55rem] text-xl leading-[2.1rem] font-medium">
          {words.map((word, wi) => (
            <span
              key={wi}
              ref={wi === wordIdx ? activeWordRef : null}
              className={[
                'transition-opacity',
                wi > wordIdx + 20 ? 'opacity-0' : '',
              ].join(' ')}
            >
              <WordDisplay
                word={word}
                isActive={wi === wordIdx}
                isPast={wi < wordIdx}
                currentInput={currentInput}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Hint / restart bar */}
      <div className="flex items-center justify-center h-5">
        {testState === 'idle' && (
          <p className="text-xs text-[var(--muted)] select-none animate-pulse">
            start typing to begin
          </p>
        )}
        {isRunning && (
          <button
            onClick={e => { e.stopPropagation(); reset() }}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            esc · restart
          </button>
        )}
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        value={currentInput}
        onChange={e => handleInput(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Escape') { e.preventDefault(); reset(); return }
          handleKeyDown(e)
        }}
        className="absolute"
        style={{ opacity: 0, top: -9999, left: -9999, width: 1, height: 1 }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        tabIndex={0}
        aria-label="typing input"
      />
    </div>
  )
}
