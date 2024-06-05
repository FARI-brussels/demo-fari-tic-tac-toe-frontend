import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { GameStats, CANVAS_CENTER } from '../types/Game'
import type { Locale } from '../types/Locale'

interface State {
  game: GameStats
  loading: boolean
  locale: Locale
  error: unknown
}

export const useGameStore = defineStore('game', {
  state: () =>
    ({
      game: {
        human: {
          type: 'human',
          symbol: undefined,
          points: 0,
          active: false
        },
        robot: {
          type: 'robot',
          symbol: undefined,
          points: 0,
          active: true
        }
      },
      locale: 'en',
      loading: false,
      error: null
    }) as State,
  actions: {
    connect() {
      console.log('connected!')
    },
    async getData() {
      this.loading = true
      this.error = null

      try {
        //implement
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    setLocale(locale: Locale): any {
      this.locale = locale
    }
  }
})
