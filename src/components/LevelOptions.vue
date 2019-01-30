<template>
  <el-form :model="options" label-width="120px">
    <el-form-item label="Добавить:">
      <el-radio-group v-model="options.elementType">
        <el-radio label="Стену"></el-radio>
        <el-radio label="Букву"></el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'LevelOptions',
  data: () => ({
    options: { elementType: '' },
  }),
};
</script>

<style>
</style>
