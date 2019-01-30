<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <GameInstance msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GameInstance from '@/components/GameInstance.vue'; // @ is an alias to /src

@Component({
  components: {
    GameInstance,
  },
})
export default class Home extends Vue {}
</script>
