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

      },
      loading: false,
      gridMessage: null,
      winner: null,
      finished: false,
      error: null,
      CMS: {
        locale: 'en',
        data: {
          logo: '',
          research_head: '',
          research_lead: '',
          explanation_short: {
            en: '',
            'fr-FR': '',
            nl: ''
          }
        },
      }
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
        this.game.started = true

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
  
      try {
        const response = await fetch('http://localhost:3000/play', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image })
        })

        if (!response.ok) 
          throw new Error(`HTTP error! status: ${response.status}`)

        this.game.human.points++
        
        const data: PlayMoveResponse = await response.json()

        this.gridState = data.grid_state
        this.move = data.move
        this.finished = data.game_is_finished
        this.winner = data.winner
        this.game.robot.points++
        this.game.human.active = true
        this.game.robot.active = false
        this.loading = false

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
      this.finished = false
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
    async getCMSData() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('http://localhost:3000/api/data')
        const parsed = await response.json()

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        parsed.forEach((e: { [k: string]: string }) => {
          const { research_head, research_lead, logo, locale, explanation_short } = e

          if (logo) this.CMS.data.logo = logo
          if (research_head) this.CMS.data.research_head = research_head
          if (research_lead) this.CMS.data.research_lead = research_lead
          if (locale) this.CMS.data.explanation_short[locale as Locale] = explanation_short
        })
      } catch (error) {
        this.error = 'Error fetching data'
      } finally {
        this.loading = false
      }
    },
    setLocale(locale: Locale): any {
      this.CMS.locale = locale
    }
  }
})
