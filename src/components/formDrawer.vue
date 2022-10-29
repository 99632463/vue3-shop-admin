<template>
  <el-drawer v-model="showDrawer" :title="title" :size="size" :destroy-on-close="destroyOnClose">
    <div class="formDrawer">
      <div class="body">
        <slot /> 
      </div>
      <div class="actions">
        <el-button :loading="loading" type="primary" @click="submit">{{confirmText}}</el-button>
        <el-button type="default" @click="close">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
const showDrawer = ref(false)

const loading = ref(false)

defineProps({
  title: String,
  size: {
    title: String,
    default: '45%'
  },
  destroyOnClose: Boolean,
  confirmText:{
    title: String,
    default: '提交'
  }
})

const open = () => showDrawer.value = true
const close = () => showDrawer.value = false

const setLoading = (status) => {
  loading.value = status
}

const emit = defineEmits(['submit'])
const submit = () => {
  emit('submit')
}

defineExpose({
  open,
  close,
  setLoading
})
</script>

<style scoped lang="scss">
.formDrawer{
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
  .body{
    flex: 1;
    overflow-y: auto;
  }
  .actions{
    height: 50px;
    @apply flex items-center;
  }
}
</style>