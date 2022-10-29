<template>
  <div v-if="modelValue">
    <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
  </div>

  <div class="choose-image-btn" @click="open">
    <el-icon :size="25"><Plus /></el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%" top="5vh">
    <el-container class="bg-white rounded" :style="{ height: '70vh' }">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate"
          >新增图片分类</el-button
        >
      </el-header>
      <el-container>
        <image-aside ref="imageAsideRef" @change="handleAsideChange" />
        <image-main ref="imageMainRef" @choose='handleChoose'/>
      </el-container>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submit">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import imageAside from '~/components/imageAside.vue'
import imageMain from '~/components/imageMain.vue'
import { ref } from 'vue';

const imageAsideRef = ref(null)
const dialogVisible = ref(false);
const imageMainRef = ref(null)

const handleOpenCreate = () => {
  imageAsideRef.value.handleCreate()
}

const handleAsideChange = id => {
  imageMainRef.value.loadData(id)
}

const props = defineProps({
  modelValue: [String, Array]
})
const emit = defineEmits(['update:modelValue'])

let urls = []
const handleChoose = (e) => {
  urls = e.map(o => o.url)
}

const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};

const submit = () => {
  if (urls.length) {
    emit('update:modelValue', urls[0])
  }
  close()
};
</script>

<style scoped lang="scss">
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>