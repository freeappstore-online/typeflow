import { useRef, useEffect, useCallback, type KeyboardEvent } from 'react'
import { useTypingTest } from '../useTypingTest'
import type { TestMode, WordData } from '../types'

const MODES: TestMode[] = [15, 30, 60, 120]

function WordDisplay({ word, isActive, currentInput }: {
  word: WordData
  isActive: boolean
  currentInput: string
}) {
  const typed = isActive ? currentInput : word.typed
  const extra = typed.slice(word.word.length)

  return (
    <span className="inline-block">
      {word.chars.map((c, ci) => {
        const isCaret = isActive && ci === typed.length
        return (
          <span
            key={ci}
            className={[
              isCaret ? 'border-l-2 border-[var(--accent)]' : '',
              c.state === 'correct' ? 'text-[var(--ink)]' : '',
              c.state === 'incorrect' ? 'text-[var(--error)]' : '',
              c.state === 'untyped' ? 'text-[var(--muted)]' : '',
            ].join(' ')}
          >
            {c.char}
          </span>
        )
      })}
      {/* Extra characters beyond word length */}
      {extra.split('').map((ch, i) => (
        <span key={`x${i}`} className="text-[var(--error)] opacity-70">{ch}</span>
      ))}
      {/* Caret at end when cursor is past all chars */}
      {isActive && typed.length >= word.word.length + extra.length && (
        <span className="border-l-2 border-[var(--accent)]">&nbsp;</span>
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

  // Scroll active word into view within the container
  useEffect(() => {
    const container = wordsContainerRef.current
    const word = activeWordRef.current
    if (!container || !word) return
    const wordBottom = word.offsetTop + word.offsetHeight
    if (wordBottom > container.scrollTop + container.clientHeight - 4) {
      container.scrollTop = word.offsetTop - word.offsetHeight - 4
    }
  }, [wordIdx])

  // Results screen
  if (testState === 'finished' && result) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4">
        <div className="text-center">
          <p className="text-[var(--muted)] text-sm font-semibold uppercase tracking-widest mb-1">wpm</p>
          <p className="display-font text-8xl font-bold text-[var(--accent)] leading-none">{result.wpm}</p>
        </div>

        <div className="flex gap-10 text-center">
          <div>
            <p className="text-[var(--muted)] text-xs font-semibold uppercase tracking-widest mb-0.5">accuracy</p>
            <p className="text-3xl font-bold text-[var(--ink)]">{result.accuracy}%</p>
          </div>
          <div>
            <p className="text-[var(--muted)] text-xs font-semibold uppercase tracking-widest mb-0.5">raw</p>
            <p className="text-3xl font-bold text-[var(--ink)]">{result.rawWpm}</p>
          </div>
          <div>
            <p className="text-[var(--muted)] text-xs font-semibold uppercase tracking-widest mb-0.5">time</p>
            <p className="text-3xl font-bold text-[var(--ink)]">{result.mode}s</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-[var(--accent)] text-white font-semibold text-sm hover:opacity-90"
          >
            try again
          </button>
          <div className="flex gap-1.5">
            {MODES.map(m => (
              <button
                key={m}
                onClick={() => changeMode(m)}
                className={[
                  'px-4 py-2.5 rounded-full text-sm font-semibold',
                  m === result.mode
                    ? 'bg-[var(--glass-strong)] border border-[var(--line-strong)] text-[var(--ink)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]',
                ].join(' ')}
              >
                {m}s
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const showStats = testState === 'running'

  return (
    <div
      className="flex flex-1 flex-col justify-center px-2 sm:px-4 lg:px-8 max-w-3xl mx-auto w-full"
      onClick={focusInput}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        {/* Mode selector */}
        <div className="flex gap-1">
          {MODES.map(m => (
            <button
              key={m}
              onClick={e => { e.stopPropagation(); changeMode(m) }}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all',
                m === mode
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--ink)]',
              ].join(' ')}
            >
              {m}s
            </button>
          ))}
        </div>

        {/* Timer + live stats */}
        <div className="flex items-center gap-5">
          {showStats && (
            <>
              <span className="text-xs font-bold tabular-nums text-[var(--muted)]">
                {liveWpm} <span className="font-normal">wpm</span>
              </span>
              <span className="text-xs font-bold tabular-nums text-[var(--muted)]">
                {liveAccuracy}<span className="font-normal">%</span>
              </span>
            </>
          )}
          <span className={[
            'text-2xl font-bold tabular-nums display-font transition-colors',
            testState === 'running' && timeLeft <= 5 ? 'text-[var(--error)]' : 'text-[var(--ink)]',
          ].join(' ')}>
            {testState === 'idle' ? mode : timeLeft}
          </span>
        </div>
      </div>

      {/* Word display */}
      <div
        ref={wordsContainerRef}
        className="relative overflow-hidden h-[9.5rem] cursor-text select-none"
        style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 85%, transparent 100%)' }}
      >
        <div className="flex flex-wrap gap-x-3 gap-y-3 text-xl leading-relaxed tracking-wide font-medium">
          {words.map((word, wi) => (
            <span
              key={wi}
              ref={wi === wordIdx ? activeWordRef : null}
            >
              <WordDisplay
                word={word}
                isActive={wi === wordIdx}
                currentInput={currentInput}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Hint */}
      {testState === 'idle' && (
        <p className="mt-6 text-center text-xs text-[var(--muted)] select-none">
          start typing to begin
        </p>
      )}

      {/* Reset hint when running */}
      {testState === 'running' && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={e => { e.stopPropagation(); reset() }}
            className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            esc to restart
          </button>
        </div>
      )}

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
