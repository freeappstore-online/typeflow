import { useState, useEffect, useCallback, useRef } from 'react'
import type { TestMode, TestState, WordData, TestResult, CharState, Difficulty } from './types'
import { generateWords } from './words'

const WORD_COUNT = 200

function buildWordData(words: string[]): WordData[] {
  return words.map(word => ({
    word,
    chars: word.split('').map(char => ({ char, state: 'untyped' as CharState })),
    typed: '',
  }))
}

function computeResult(words: WordData[], wordIdx: number, mode: TestMode, difficulty: Difficulty): TestResult {
  let correct = 0
  let incorrect = 0
  for (let i = 0; i < wordIdx; i++) {
    for (const c of words[i].chars) {
      if (c.state === 'correct') correct++
      else if (c.state === 'incorrect') incorrect++
    }
    correct++ // space between words
  }
  for (const c of words[wordIdx].chars) {
    if (c.state === 'correct') correct++
    else if (c.state === 'incorrect') incorrect++
  }
  const total = correct + incorrect
  const wpm = Math.round((correct / 5) / (mode / 60))
  const rawWpm = Math.round((total / 5) / (mode / 60))
  const accuracy = total === 0 ? 100 : Math.round((correct / total) * 100)
  return { wpm, rawWpm, accuracy, correctChars: correct, incorrectChars: incorrect, mode, difficulty }
}

export function useTypingTest() {
  const [mode, setMode] = useState<TestMode>(30)
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [testState, setTestState] = useState<TestState>('idle')
  const [words, setWords] = useState<WordData[]>(() => buildWordData(generateWords(WORD_COUNT, 'normal')))
  const [wordIdx, setWordIdx] = useState(0)
  const [currentInput, setCurrentInput] = useState('')
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [result, setResult] = useState<TestResult | null>(null)

  const stateRef = useRef({ words, wordIdx, mode, difficulty, testState })
  stateRef.current = { words, wordIdx, mode, difficulty, testState }

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const finish = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    const { words, wordIdx, mode, difficulty } = stateRef.current
    setResult(computeResult(words, wordIdx, mode, difficulty))
    setTestState('finished')
  }, [])

  const startTimer = useCallback((seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { finish(); return 0 }
        return prev - 1
      })
    }, 1000)
    setTimeLeft(seconds)
  }, [finish])

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const handleInput = useCallback((value: string) => {
    const { testState, words, wordIdx, mode } = stateRef.current
    if (testState === 'finished') return

    if (testState === 'idle') {
      setTestState('running')
      startTimer(mode)
    }

    if (value.endsWith(' ')) {
      const typed = value.trimEnd()
      if (typed.length === 0) return

      const newWords = words.map((w, i) => {
        if (i !== wordIdx) return w
        return {
          ...w, typed,
          chars: w.chars.map((c, ci) => ({
            ...c,
            state: (ci < typed.length
              ? typed[ci] === c.char ? 'correct' : 'incorrect'
              : 'incorrect') as CharState,
          })),
        }
      })

      const nextIdx = wordIdx + 1
      if (nextIdx >= newWords.length) { setWords(newWords); finish(); return }
      setWords(newWords)
      setWordIdx(nextIdx)
      setCurrentInput('')
      return
    }

    const capped = value.slice(0, words[wordIdx].word.length + 8)
    const newWords = words.map((w, i) => {
      if (i !== wordIdx) return w
      return {
        ...w, typed: capped,
        chars: w.chars.map((c, ci) => ({
          ...c,
          state: (ci >= capped.length ? 'untyped' : capped[ci] === c.char ? 'correct' : 'incorrect') as CharState,
        })),
      }
    })
    setWords(newWords)
    setCurrentInput(capped)
  }, [startTimer, finish])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const { words, wordIdx } = stateRef.current
    if (e.key === 'Backspace' && stateRef.current.testState !== 'finished') {
      const input = (e.currentTarget as HTMLInputElement).value
      if (input === '' && wordIdx > 0) {
        const prevIdx = wordIdx - 1
        const prevTyped = words[prevIdx].typed
        const newWords = words.map((w, i) => {
          if (i !== prevIdx) return w
          return {
            ...w,
            chars: w.chars.map((c, ci) => ({
              ...c,
              state: (ci >= prevTyped.length ? 'untyped' : prevTyped[ci] === c.char ? 'correct' : 'incorrect') as CharState,
            })),
          }
        })
        setWords(newWords)
        setWordIdx(prevIdx)
        setCurrentInput(prevTyped)
      }
    }
  }, [])

  const reset = useCallback((newMode?: TestMode, newDifficulty?: Difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const m = newMode ?? stateRef.current.mode
    const d = newDifficulty ?? stateRef.current.difficulty
    setMode(m)
    setDifficulty(d)
    setTimeLeft(m)
    setWords(buildWordData(generateWords(WORD_COUNT, d)))
    setWordIdx(0)
    setCurrentInput('')
    setTestState('idle')
    setResult(null)
  }, [])

  const changeMode = useCallback((m: TestMode) => reset(m), [reset])
  const changeDifficulty = useCallback((d: Difficulty) => reset(undefined, d), [reset])

  const elapsed = mode - timeLeft
  let liveWpm = 0
  let liveAccuracy = 100
  if (testState === 'running' && elapsed > 0) {
    let correct = 0, incorrect = 0
    for (let i = 0; i < wordIdx; i++) {
      for (const c of words[i].chars) {
        if (c.state === 'correct') correct++
        else if (c.state === 'incorrect') incorrect++
      }
      correct++
    }
    for (const c of words[wordIdx].chars) {
      if (c.state === 'correct') correct++
      else if (c.state === 'incorrect') incorrect++
    }
    const total = correct + incorrect
    liveWpm = Math.round((correct / 5) / (elapsed / 60))
    liveAccuracy = total === 0 ? 100 : Math.round((correct / total) * 100)
  }

  return {
    mode, difficulty, testState, words, wordIdx, currentInput,
    timeLeft, result, liveWpm, liveAccuracy,
    handleInput, handleKeyDown, reset, changeMode, changeDifficulty,
  }
}
