<template>
  <el-dialog :title="title" :visible="!!msg" width="30%" center @close="$emit('update:msg', '')">
    <span>{{msg}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('update:msg', '')">Хорошо</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ModalError',
  props: {
    msg: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style>
</style>
