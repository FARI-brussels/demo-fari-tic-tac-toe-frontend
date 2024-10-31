<template>
  <div class="layout bg-color-blue">
    <FButtonIcon
      name="chevron-left"
      color="blue-light"
      small
      class="back-button"
      @click="$emit('exit-game')"
    />
    <div class="gameboard">
      <TicTacToeCanvas ref="gameBoard" />
      <div class="game-buttons">
        <FButtonIcon @click="undo" name="undo" color="red" :disabled="!game.human.active" />
        <FButtonIcon @click="endTurn" name="check" color="green" :disabled="!game.human.active" />
      </div>

      <FDropdown
        @select="handleSelect"
        name="menu"
        color="blue"
        location="top-left"
        :items="[
          { label: game.started ? 'Restart' : 'Start Game', value: 'start' },
          { label: 'Exit Game', value: 'exit' }
        ]"
        class="dropdown-button"
      />
    </div>
    <GameStats v-bind="{ ...game, state: gameboardImage }" />

    <FSlideTransition :show="showError">
      <FContainer v-if="showError" class="dialog">
        <h1 class="title">Uh-ooh 🫢</h1>
        <p>Something went wrong, try again?</p>
        <FButton @click="() => (showError = false)" label="OK" color="green" />
      </FContainer>
    </FSlideTransition>

    <FSlideTransition :show="showWinner">
      <FContainer v-if="showWinner" class="dialog-winner">
        <h1 v-if="winner" class="title color-primary">The winner is: the {{ winner }}</h1>
        <h1 v-else class="title color-primary">Draw!</h1>

        <p v-if="winner === 'robot'" class="text-winner">
          Unfortunately, the robot won. You can always try again
        </p>
        <p v-else-if="winner === 'human'" class="text-winner">Congratulations! You won!</p>
        <p v-else-if="!winner" class="text-winner">Game is finished. Nobody won.</p>

        <div v-if="winner" class="trophy-container">
          <AnimationContainer :animation-data="animationData" />
        </div>

        <div class="action-button-container">
          <FButton @click="() => (showWinner = false)" label="Close" outline type="secondary" />
          <FButton @click="startGame" label="Restart" type="primary" />
        </div>
      </FContainer>
    </FSlideTransition>

    <div class="backdrop" :class="{ 'backdrop-active': showError || showWinner }"></div>
  </div>
</template>

<script setup lang="ts">
import { TicTacToeCanvas, GameStats, AnimationContainer } from '@/components'
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import {
  FContainer,
  FButton,
  FButtonIcon,
  FSlideTransition,
  FDropdown
} from 'fari-component-library'
import animationData from '@/assets/trophy'

const emit = defineEmits(['exit-game'])

const showError = ref(false)
const showWinner = ref(false)

const { game, error, winner, finished, gameboardImage } = storeToRefs(useGameStore())
const { drawGrid, resetState, playMove, updateGameBoard } = useGameStore()

const gameBoard = ref()

let intervalId = undefined

function setUpdateInterval() {
  intervalId = setInterval(() => gameBoard.value && updateGameBoard(gameBoard.value.canvas), 100)
}

onMounted(setUpdateInterval)
onUnmounted(() => clearInterval(intervalId))

async function endTurn() {
  updateGameBoard(gameBoard.value.canvas)
  const image = gameboardImage.value
  if (image) await playMove(image)
}

function undo() {
  gameBoard.value?.undo()
  showError.value = false
}

async function startGame() {
  showError.value = false
  showWinner.value = false
  gameBoard.value.clearCanvas()
  await drawGrid()
}

async function handleSelect(value: string | number) {
  if (value === 'start') startGame()
  if (value === 'restart') startGame()
  if (value === 'exit') {
    resetState()
    emit('exit-game')
  }
}

watch(finished, (isFinished) => {
  if (!isFinished) showWinner.value = false
  else showWinner.value = true
})

watch(error, (val) => {
  if (!val) return
  showError.value = true
})

defineExpose({
  gameBoard
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

.back-button {
  position: absolute;
  top: 2rem;
  left: 4rem;
}

.backdrop {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(24, 62, 145, 0.4);
  backdrop-filter: blur(0);
  z-index: 1;
  transition: all 100ms;

  &-active {
    visibility: visible;
    opacity: 1;
    backdrop-filter: blur(2px);
    transition: all 300ms;
  }
}

.dialog,
.dialog-winner {
  width: 810px;
  text-align: center;
  position: fixed;
  top: 35%;
  left: 30%;
  border-radius: 36px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
  z-index: 2;
  .title {
    color: var(--F_Blue, #183e91);
    font-family: Inter;
    font-size: 48px;
    font-style: normal;
    font-weight: 900;
    line-height: 60px;
    letter-spacing: -0.96px;
    margin-bottom: 1.5rem;
  }
}

.dialog-winner {
  top: 25%;
}

p {
  color: black;
}

.gameboard {
  position: relative;
}

.game-buttons {
  display: flex;
  position: absolute;
  bottom: 2rem;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
}

.dropdown {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
}

.trophy-container {
  display: flex;
  justify-content: center;
}

.action-button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.text-winner {
  font-size: 20px;
  margin-top: 1rem;
}
</style>
