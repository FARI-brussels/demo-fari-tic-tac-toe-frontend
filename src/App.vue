<template>
  <div class="layout bg-color-blue">
  <div class="gameboard">
    <TicTacToeCanvas :disabled="drawingDisabled" ref="gameBoard"/>
    <div class="button-container">
        <FButtonIcon @click="undo" name="cross" color="red"></FButtonIcon>
        <FButtonIcon @click="endTurn" name="check" color="green"></FButtonIcon>
    </div>
  </div>
    <GameStats v-bind="game" />

    <FSlideTransition :show="showError">
      <FContainer v-if="showError" class="dialog">
        <h1 class="title"> Unrecognized move </h1>
        <p> It seems like your move was not recognized by the robot, can you try again?  </p>
        <FButton @click=" () => showError = false" label="OK" color="green"/>
      </FContainer> 
      </FSlideTransition>

  </div>
</template>

<script setup lang="ts">
import TicTacToeCanvas from './components/TicTacToeCanvas.vue'
import GameStats from './components/GameStats.vue'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import { useGameStore } from './stores/game'
import { FContainer, FButton, FButtonIcon, FSlideTransition } from 'fari-component-library'

const showError = ref(false)

const { game, loading, error, locale } = storeToRefs(useGameStore())
const { getData, setLocale } = useGameStore()

onMounted(getData)

const gameBoard = ref()
const drawingDisabled = ref(false)

function endTurn() {
  const image = gameBoard.value.canvas.toDataURL('image/png')
  showError.value = true
  game.value.robot.points++
  drawingDisabled.value = false
}

function undo() {
  gameBoard.value?.undo()
  // showError.value = false
  drawingDisabled.value = false;
}

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
</style>
