<template>
    <div class="start-screen">
      <video autoplay muted loop class="background-video">
        <source src="../assets/OXOplayer.mp4" type="video/mp4" />
      </video>
      <div class="heading">
        <div class="title">
          <FTitle class="title"> Tic Tac Toe player</FTitle>
          <FButtonIcon name="tooltip" color="blue-light" class="tooltip" @click="toggleCard" />
      </div>
      <FSubTitle class="subtitle"> AI Education </FSubTitle>
    </div>


    <FButton label="Start" type="primary" class="start-button" on-dark @click="$emit('start-game')"/>

    <FSlideTransition :show="showCard">
      <FCard v-if="showCard" @close="toggleCard" @update:locale="setLocale" class="card">
        {{ CMS.data.explanation_short[CMS.locale] }}
        <template #footer> <div v-if="CMS.data.logo" v-html="CMS.data.logo"></div> </template>
      </FCard>
    </FSlideTransition>
    <div class="backdrop" :class="{ 'backdrop-active': showCard }"></div>
    <FFooter />
    </div>
  </template>
  
  <script setup lang="ts">
  import {  FButton, FTitle, FSubTitle, FButtonIcon, FFooter, FSlideTransition, FCard } from 'fari-component-library'
  import { useGameStore } from '@/stores/game'
  import { storeToRefs } from 'pinia'
  import { ref, onMounted } from 'vue'

  defineEmits(['start-game'])

  const { CMS } = storeToRefs(useGameStore())
  const { getCMSData, setLocale } = useGameStore()

  const showCard = ref(false)


onMounted(getCMSData)
const toggleCard = () => (showCard.value = !showCard.value)
  
  </script>
  
  <style scoped lang="scss">

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}
  .start-screen {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-image: url('../assets/robot-bg.png'), radial-gradient(circle, rgba(75,118,212,0.6) 0%, rgba(24,62,145,1) 70%);
    background-size: 110%;
    justify-content: space-around;
    align-items: center;
    flex: 0 0 auto;
    position: relative;
    z-index: 0;
  }

  .heading {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem;
  margin-bottom: auto;

  .title {
    gap: 1rem;
    display: flex;

  }
}

.start-button {
  margin-bottom: auto;
  width: fit-content;
}
.card {
  position: absolute;
  top: 25%;
  left: 20%;
  z-index: 2;
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


  </style>
  