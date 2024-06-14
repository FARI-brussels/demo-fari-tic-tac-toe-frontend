import { defineStore } from 'pinia'
import { CANVAS_CENTER, CANVAS_SIZE } from '../types/Game'
import type { Locale } from '../types/Locale'
import type {
  DrawGridRequest,
  DrawGridResponse,
  PlayMoveRequest,
  PlayMoveResponse,
  GameState,
  Player,
  HumanPlayer,
  RobotPlayer
} from '../types/Game'

export const useGameStore = defineStore('game', {
  state: () =>
    ({
      game: {
        human: {
          type: 'human',
          symbol: undefined,
          points: 0,
          active: false
        } as HumanPlayer,
        robot: {
          type: 'robot',
          symbol: undefined,
          points: 0,
          active: false
        } as RobotPlayer,
        started: false,
        finished: false
      },
      locale: 'en',
      loading: false,
      gridMessage: null,
      winner: null,
      error: null
    }) as GameState,
  actions: {
    async drawGrid(
      { center = CANVAS_CENTER, size = CANVAS_SIZE }: DrawGridRequest = {
        center: CANVAS_CENTER,
        size: CANVAS_SIZE
      }
    ) {
      try {
        this.resetState()
        this.game.robot.active = true
        const response = await fetch('http://localhost:3000/draw_grid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ center, size })
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data: DrawGridResponse = await response.json()

        console.log('Response received:', data)

        this.gridMessage = data.message
        this.game.started = true

        this.game.human.active = true
        this.game.robot.active = false
      } catch (error: any) {
        console.error('Error:', error)

        if (
          error.message.includes('A listener indicated an asynchronous response by returning true')
        ) {
          this.error = 'Asynchronous response issue. Please try again.'
        } else {
          this.error = error.message
        }
        this.error = error.message
      }
    },
    async playMove(image: PlayMoveRequest) {
      this.loading = true
      this.error = null
      this.game.human.active = false
      this.game.robot.active = true
      this.game.human.points++
      try {
        const response = await fetch('http://localhost:3000/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image })
        })

        console.log({ response })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: PlayMoveResponse = await response.json()

        console.log({ data })
        this.gridState = data.grid_state
        this.move = data.move
        this.game.finished = data.game_is_finished
        this.winner = data.winner
        this.game.robot.points++
        this.game.human.active = true
        this.game.robot.active = false
      } catch (error: any) {
        console.error('Error:', error)
        this.error = error.message
      }
    },
    resetState() {
      this.gridMessage = null
      this.gridState = null
      this.move = null
      this.game.started = false
      this.game.finished = false
      this.winner = null
      this.error = null

      this.game.human = this.resetPlayerStats(this.game.human) as HumanPlayer
      this.game.robot = this.resetPlayerStats(this.game.robot) as RobotPlayer
    },
    resetPlayerStats({ type }: Player): HumanPlayer | RobotPlayer {
      return {
        type,
        points: 0,
        active: false,
        symbol: undefined
      }
    },
    setLocale(locale: Locale): any {
      this.locale = locale
    }
  }
})
