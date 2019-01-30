<template>
  <div id="app">
    <GameInstance msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import hash from 'object-hash';
import GameInstance from './components/GameInstance.vue';

export default {
  name: 'app',
  components: {
    GameInstance,
  },
};
</script>

<style>
</style>
