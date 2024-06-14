import type { Locale } from './Locale'
export interface Player {
  symbol: 'X' | 'O' | undefined
  points: number
  active: boolean
  type: 'human' | 'robot'
}

export interface HumanPlayer extends Player {
  type: 'human'
}

export interface RobotPlayer extends Player {
  type: 'robot'
}

export interface GameStats {
  human: HumanPlayer
  robot: RobotPlayer
  started: boolean
  finished: boolean
  loading: boolean
}

export const CANVAS_CENTER = [0.2, 0.1] as const
export const CANVAS_SIZE = [0.1, 0.1] as const
// export const CANVAS_CENTER = [ 540, 414 ] as const;
// export const CANVAS_SIZE = [0.1] as const

type GridItem = 'X' | 'O' | ' '

type GridRow = [GridItem, GridItem, GridItem]

export type Grid = [GridRow, GridRow, GridRow]

export interface DrawGridRequest {
  center: readonly [number, number]
  size: readonly [number, number]
}

export interface DrawGridResponse {
  message: string
}

export interface PlayMoveRequest {
  image: string
}

export interface PlayMoveResponse {
  grid_state: string[][]
  move: string
  game_is_finished: boolean
  winner: 'human' | 'robot' | null
}

export interface GameState {
  loading: boolean
  game: GameStats
  locale: Locale
  error: any
  gridMessage: string | null
  winner: 'human' | 'robot' | null
  gridState: string[][] | null
  move: string | null
}
