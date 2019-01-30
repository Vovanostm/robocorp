<template>
  <div>
    <h3>Карта:</h3>
    <map-viewer :map.sync="gameMap"></map-viewer>
    <el-button @click="genMap" type="primary">Сгенерировать</el-button>
    <el-button @click="confirmMap" type="secondary">Применить</el-button>
  </div>
</template>

<script>
import MapViewer from '@/components/MapViewer.vue';
export default {
  name: 'MapEditor',
  components: { MapViewer },
  props: {
    game: {
      type: Object,
      default: {},
    },
  },
  data: () => ({ gameMap: '' }),
  methods: {
    genMap() {
      this.gameMap = JSON.stringify(this.game.printMap());
    },
    confirmMap() {
      const map = JSON.parse(this.gameMap);
      this.game.readMap(map);
    },
  },
};
</script>

<style>
</style>
