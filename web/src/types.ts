export type TestMode = 15 | 30 | 60 | 120

export type TestState = 'idle' | 'running' | 'finished'

export type CharState = 'untyped' | 'correct' | 'incorrect'

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
}
