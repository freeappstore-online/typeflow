export type TestMode = 15 | 30 | 60 | 120
export type TestState = 'idle' | 'running' | 'finished'
export type CharState = 'untyped' | 'correct' | 'incorrect'
export type Difficulty = 'easy' | 'normal' | 'hard'
export type Theme = 'light' | 'dark'

export interface CharData {
  char: string
  state: CharState
}

export interface WordData {
  word: string
  chars: CharData[]
  typed: string
}

export interface TestResult {
  wpm: number
  rawWpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  mode: TestMode
  difficulty: Difficulty
}

export interface Stats {
  pb: number
  testsCompleted: number
}

export interface LevelInfo {
  label: string
  color: string
  next: number | null
}
