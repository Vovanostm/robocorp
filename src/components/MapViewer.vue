<template>
  <div>
    <el-input :value="map" type="textarea" @change="$emit('update:map', $event)"></el-input>
  </div>
</template>

<script>
export default {
  name: 'MapViewer',
  props: {
    map: {
      type: String,
      default: '',
    },
  },
  data: () => ({ _map: '' }),
};
</script>

<style>
</style>
