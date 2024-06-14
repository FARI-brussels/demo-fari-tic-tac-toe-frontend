<template>
  <div class="layout bg-color-blue">
    <div class="gameboard">
      <TicTacToeCanvas :disabled="drawingDisabled" ref="gameBoard" />
      <div class="button-container">
        <FButtonIcon @click="undo" name="undo" color="red" :disabled="drawingDisabled" />
        <FButtonIcon @click="endTurn" name="check" color="green" :disabled="drawingDisabled" />
      </div>
    </div>
    <GameStats
      v-bind="game"
      @start-game="startGame"
      @restart-game="startGame"
      @exit-game="resetState"
      :loading="true"
    />

    <FSlideTransition :show="showError">
      <FContainer v-if="showError" class="dialog">
        <h1 class="title">Uh-ooh 🫢</h1>
        <p>Something went wrong, try again?</p>
        <!-- <h1 class="title"> Unrecognized move </h1>
        <p> It seems like your move was not recognized by the robot, can you try again?  </p> -->
        <FButton @click="() => (showError = false)" label="OK" color="green" />
      </FContainer>
    </FSlideTransition>

    <FSlideTransition :show="showWinner">
      <FContainer v-if="showWinner" class="dialog">
        <h1 class="title">Winner: {{ winner }}</h1>
        <div class="trophy-container">
          <img
            v-if="winner === 'robot'"
            src="./assets/trophy-robot-transparent.png"
            class="trophy"
          />
          <img
            v-else-if="winner === 'human'"
            src="./assets/trophy-human-transparent.png"
            class="trophy"
          />
        </div>

        <p v-if="winner === 'robot'" class="text-winner">Better luck next time!</p>
        <p v-else-if="winner === 'human'" class="text-winner">You win! Congratulations!</p>

        <div class="action-button-container">
          <FButton @click="() => (showWinner = false)" label="Close" color="green" />
          <FButton
            @click="
              () => {
                showWinner = false
                startGame()
              }
            "
            label="Restart"
            color="blue"
          />
        </div>
      </FContainer>
    </FSlideTransition>
  </div>
</template>

<script setup lang="ts">
import TicTacToeCanvas from './components/TicTacToeCanvas.vue'
import GameStats from './components/GameStats.vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useGameStore } from './stores/game'
import { FContainer, FButton, FButtonIcon, FSlideTransition } from 'fari-component-library'
import confetti from 'canvas-confetti'

const showError = ref(false)
const showWinner = ref(false)

const { game, error, locale, winner } = storeToRefs(useGameStore())
const { drawGrid, setLocale, resetState, playMove } = useGameStore()

const gameBoard = ref()
const drawingDisabled = ref(true)

async function endTurn() {
  const image = gameBoard.value.canvas.toDataURL('image/png')
  await playMove(image)
  drawingDisabled.value = false
}

function undo() {
  gameBoard.value?.undo()
  showError.value = false
  drawingDisabled.value = false
}

async function startGame() {
  await drawGrid()
  drawingDisabled.value = false
}

watch(winner, (val) => {
  if (!val) return
  showWinner.value = true
  confetti({ particleCount: 1000, spread: 800 })
})

watch(error, (val) => {
  if (!val) return
  showError.value = true
})
</script>

<style scoped lang="scss">
.layout {
  padding: 8rem 6.4rem;
  width: 100vw;
  height: 100vh;
  display: flex;
  gap: 2rem;
}

.dialog {
  width: 810px;
  text-align: center;
  position: fixed;

  top: 35%;
  left: 30%;

  border-radius: 36px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
  .title {
    color: var(--F_Blue, #183e91);
    font-family: Inter;
    font-size: 48px;
    font-style: normal;
    font-weight: 900;
    line-height: 60px; /* 125% */
    letter-spacing: -0.96px;
    margin-bottom: 1.5rem;
  }
}
p {
  color: black;
}

.gameboard {
  position: relative;
}

.button-container {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  justify-content: end;
  gap: 1.5rem;
}

.trophy-container {
  margin: 3rem;
  .trophy {
    width: 200px;
    height: 200px;
  }
}

.action-button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.text-winner {
  font-size: 24px;
  font-weight: 600;
  margin-top: 1rem;
}
</style>
