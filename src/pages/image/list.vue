<template>
  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
    </el-header>
    <el-container>
      <image-aside ref='imageAsideRef' @change="handleAsideChange" />
      <image-main ref='imageMainRef'/>
    </el-container>
  </el-container>
</template>

<script setup>
  import imageAside from '~/components/imageAside.vue'
  import imageMain from '~/components/imageMain.vue'
  import { ref } from 'vue';

  const windowHeight = window.innerHeight || document.body.clientHeight
  const h = windowHeight - 64 - 44 - 40

  const imageAsideRef = ref(null)

  const handleOpenCreate = () => {
    imageAsideRef.value.handleCreate()
  }

  const imageMainRef = ref(null)
  const handleAsideChange = id => {
    imageMainRef.value.loadData(id)
  }
</script>

<style scoped lang="scss">
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>