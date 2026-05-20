import { useRef, useEffect, useCallback, useState, type KeyboardEvent } from 'react'
import { useTypingTest } from '../useTypingTest'
import { getLevel } from '../useStats'
import type { TestMode, Difficulty, WordData } from '../types'

const MODES: TestMode[] = [15, 30, 60, 120]
const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard']

const DIFF_LABEL: Record<Difficulty, string> = { easy: 'Easy', normal: 'Normal', hard: 'Hard' }
const DIFF_DESC: Record<Difficulty, string> = {
  easy: 'Short common words',
  normal: 'Mixed vocabulary',
  hard: 'Longer complex words',
}

function TabBtn({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      className={[
        'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
        active
          ? 'bg-[var(--ink)] text-[var(--paper)]'
          : 'text-[var(--muted)] hover:text-[var(--ink)]',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function WordDisplay({ word, isActive, isPast, currentInput }: {
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
          <span className={
            c.state === 'correct'
              ? isPast ? 'text-[var(--ink)] opacity-40' : 'text-[var(--ink)]'
              : c.state === 'incorrect'
                ? 'text-[var(--error)]'
                : 'opacity-25'
          }>
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

interface TypingAreaProps {
  currentPb?: number
  onResult?: (wpm: number) => void
}

export function TypingArea({ currentPb = 0, onResult }: TypingAreaProps) {
  const {
    mode, difficulty, testState, words, wordIdx, currentInput,
    timeLeft, result, liveWpm, liveAccuracy,
    handleInput, handleKeyDown, reset, changeMode, changeDifficulty,
  } = useTypingTest()

  const inputRef = useRef<HTMLInputElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)
  const activeWordRef = useRef<HTMLSpanElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const resultRecorded = useRef(false)

  const focusInput = useCallback(() => inputRef.current?.focus(), [])
  useEffect(() => { focusInput() }, [focusInput])

  // Record result once when test finishes
  useEffect(() => {
    if (testState === 'finished' && result && !resultRecorded.current) {
      resultRecorded.current = true
      onResult?.(result.wpm)
    }
    if (testState === 'idle') resultRecorded.current = false
  }, [testState, result, onResult])

  // Scroll active word into top band
  useEffect(() => {
    const container = wordsContainerRef.current
    const word = activeWordRef.current
    if (!container || !word) return
    const lineH = word.offsetHeight
    if (word.offsetTop - container.scrollTop > lineH * 1.8) {
      container.scrollTop = word.offsetTop - lineH
    }
  }, [wordIdx])

  const isNewPb = result !== null && result.wpm > 0 && result.wpm > currentPb
  const isRunning = testState === 'running'
  const level = getLevel(result?.wpm ?? currentPb)

  // ── Results screen ──────────────────────────────────────────────────
  if (testState === 'finished' && result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4" onClick={focusInput}>
        {isNewPb && (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--warning)] animate-pulse">
            ★ new personal best
          </div>
        )}

        <div className="text-center">
          <p className="text-[var(--muted)] text-[0.65rem] font-bold uppercase tracking-[0.2em] mb-1">wpm</p>
          <p className="display-font font-bold text-[var(--accent)] leading-none"
            style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }}>
            {result.wpm}
          </p>
          <p className="text-xs mt-1 font-semibold" style={{ color: level.color }}>{level.label}</p>
        </div>

        <div className="flex gap-6 sm:gap-10 text-center">
          {([
            ['accuracy', `${result.accuracy}%`],
            ['raw', String(result.rawWpm)],
            ['time', `${result.mode}s`],
            ['level', DIFF_LABEL[result.difficulty]],
          ] as const).map(([label, val]) => (
            <div key={label}>
              <p className="text-[var(--muted)] text-[0.6rem] font-bold uppercase tracking-[0.18em] mb-0.5">{label}</p>
              <p className="text-xl sm:text-2xl font-bold text-[var(--ink)]">{val}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <button
            onClick={() => { reset(); focusInput() }}
            className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-[var(--paper)] font-bold text-sm hover:opacity-80 transition-opacity"
          >
            try again
          </button>
          <div className="flex gap-1">
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => { changeDifficulty(d); focusInput() }}
                className={['px-3 py-2.5 rounded-full text-xs font-bold transition-all',
                  d === result.difficulty ? 'bg-[var(--glass-strong)] border border-[var(--line-strong)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]',
                ].join(' ')}>
                {DIFF_LABEL[d]}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {MODES.map(m => (
              <button key={m} onClick={() => { changeMode(m); focusInput() }}
                className={['px-3 py-2.5 rounded-full text-xs font-bold transition-all',
                  m === result.mode ? 'bg-[var(--glass-strong)] border border-[var(--line-strong)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]',
                ].join(' ')}>
                {m}s
              </button>
            ))}
          </div>
        </div>

        <input ref={inputRef} readOnly
          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); reset(); focusInput() }
          }}
          className="absolute" style={{ opacity: 0, top: -9999, left: -9999, width: 1, height: 1 }}
          aria-label="typing input"
        />
      </div>
    )
  }

  // ── Test screen ──────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-1 flex-col justify-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 gap-5"
      onClick={focusInput}
    >
      {/* Selectors row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Difficulty */}
        <div className="flex items-center gap-0.5 bg-[var(--glass)] border border-[var(--line)] rounded-full px-1 py-1">
          {DIFFICULTIES.map(d => (
            <TabBtn key={d} active={d === difficulty} onClick={() => changeDifficulty(d)}>
              {DIFF_LABEL[d]}
            </TabBtn>
          ))}
        </div>
        {/* Mode */}
        <div className="flex items-center gap-0.5 bg-[var(--glass)] border border-[var(--line)] rounded-full px-1 py-1">
          {MODES.map(m => (
            <TabBtn key={m} active={m === mode} onClick={() => changeMode(m)}>
              {m}s
            </TabBtn>
          ))}
        </div>
      </div>

      {/* Timer + live stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-4 h-6">
          {isRunning && (
            <>
              <span className="tabular-nums text-sm font-semibold text-[var(--muted)]">
                {liveWpm} <span className="text-xs font-normal">wpm</span>
              </span>
              <span className="tabular-nums text-sm font-semibold text-[var(--muted)]">
                {liveAccuracy}<span className="text-xs font-normal">%</span>
              </span>
            </>
          )}
          {!isRunning && testState === 'idle' && (
            <span className="text-xs text-[var(--muted)] hidden sm:block"
              title={DIFF_DESC[difficulty]}>
              {DIFF_DESC[difficulty]}
            </span>
          )}
        </div>
        <span className={[
          'display-font text-5xl font-bold tabular-nums leading-none transition-colors',
          isRunning && timeLeft <= 5 ? 'text-[var(--error)]' : 'text-[var(--ink)]',
        ].join(' ')}>
          {testState === 'idle' ? mode : timeLeft}
        </span>
      </div>

      {/* Word display */}
      <div className="relative">
        <div
          ref={wordsContainerRef}
          className="overflow-hidden h-[8.5rem] cursor-text select-none"
          style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)' }}
        >
          <div className="flex flex-wrap gap-x-[0.55rem] gap-y-[0.5rem] text-xl leading-[2.1rem] font-medium">
            {words.map((word, wi) => (
              <span key={wi} ref={wi === wordIdx ? activeWordRef : null}>
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

        {/* Focus overlay — shown when input is blurred */}
        {!isFocused && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg"
            style={{ background: 'color-mix(in srgb, var(--paper) 75%, transparent)', backdropFilter: 'blur(3px)' }}
          >
            <span className="text-base font-bold text-[var(--ink)]">Click here to start typing</span>
            <span className="text-xs text-[var(--muted)]">or press any key</span>
          </div>
        )}
      </div>

      {/* Hint / restart row */}
      <div className="flex items-center justify-center h-5">
        {testState === 'idle' && isFocused && (
          <p className="text-xs text-[var(--muted)] select-none">
            start typing to begin the timer
          </p>
        )}
        {isRunning && (
          <button
            onClick={e => { e.stopPropagation(); reset(); focusInput() }}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Escape') { e.preventDefault(); reset(); return }
          handleKeyDown(e)
        }}
        className="absolute"
        style={{ opacity: 0, top: -9999, left: -9999, width: 1, height: 1 }}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        tabIndex={0}
        aria-label="typing input"
      />
    </div>
  )
}
