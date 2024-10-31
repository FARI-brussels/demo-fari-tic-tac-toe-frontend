import { defineStore } from 'pinia'
import { CANVAS_CENTER, CANVAS_SIZE } from '../types/Game'
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
      socket: null,
      reconnectInterval: null,
      gameboardImage: null,
      robotVision: null,
      canvasState: undefined,
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
        started: false
      },
      loading: false,
      gridMessage: null,
      winner: null,
      finished: false,
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
    updateGameBoard(gameBoard: HTMLCanvasElement) {
      this.gameboardImage = gameBoard.toDataURL('image/png')
    },
    async playMove(image: PlayMoveRequest | string) {
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

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

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
    async start() {
      await fetch('http://localhost:3000/start')
      await this.connectWebSocket()
    },
    async stop() {
      await fetch('http://localhost:3000/stop')
    },
    drawBoundingBoxes(
      bboxes: Array<{
        x1: number
        y1: number
        x2: number
        y2: number
        class: string
        confidence: number
      }>
    ) {
      const container = document.querySelector('.robot-vision-container')

      if (container) {
        container.innerHTML = ''

        bboxes.forEach(
          (bbox: {
            x1: number
            y1: number
            x2: number
            y2: number
            class: string
            confidence: number
          }) => {
            const { x1, y1, x2, y2, class: cls, confidence } = bbox

            // Apply the 0.52 multiplier
            const scaledX1 = x1 * 0.52
            const scaledY1 = y1 * 0.52
            const scaledX2 = x2 * 0.52
            const scaledY2 = y2 * 0.52

            const box = document.createElement('div')
            box.style.position = 'absolute'
            box.style.border = '2px solid red'
            box.style.left = `${scaledX1}px`
            box.style.top = `${scaledY1}px`
            box.style.width = `${scaledX2 - scaledX1}px`

            box.style.height = `${scaledY2 - scaledY1}px`
            box.textContent = `${cls} (${confidence}%)`
            box.style.color = 'white'
            box.style.fontSize = '12px'
            box.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'

            container.appendChild(box)
          }
        )
      }
    },
    async connectWebSocket() {
      this.socket = new WebSocket('ws://0.0.0.0:8080')

      this.socket.onmessage = (event) => {
        try {
          const bboxes = JSON.parse(event.data)
          console.log(bboxes)
          this.drawBoundingBoxes(bboxes) // Function to render the bounding boxes on the UI
        } catch (e) {
          console.error('Error parsing JSON data:', e)
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...')

        if (!this.reconnectInterval)
          this.reconnectInterval = window.setInterval(this.connectWebSocket, 5000)
      }

      this.socket.onopen = () => {
        console.log('WebSocket connection opened')
        if (this.reconnectInterval) {
          window.clearInterval(this.reconnectInterval)
          this.reconnectInterval = null
        }

        setInterval(() => this.gameboardImage && this.fetchImageAndSend(this.gameboardImage), 100)
      }

      this.socket.onerror = (error) => console.error('WebSocket error:', error)
    },
    async fetchImageAndSend(url: string) {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
              this.socket.send(reader.result)
            }
          }
          reader.readAsArrayBuffer(blob) // Read as binary
        })
        .catch((error) => console.error('Error fetching image:', error))
    }
  }
})
