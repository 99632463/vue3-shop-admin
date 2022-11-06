<template>
  <div v-if="modelValue">
    <el-image
      v-if="typeof modelValue === 'string'"
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
    ></el-image>
    <div v-else class="flex flex-wrap">
      <div
        v-for="(url, index) in modelValue"
        :key="index"
        class="relative mx-1 mb-2 w-[100px] h-[100px]"
      >
        <el-icon 
          class="absolute right-[5px] top-[5px] cursor-pointer bg-white rounded-full" 
          style="z-index: 10"
          @click="removeImage(url)"
        >
          <CircleClose />
        </el-icon>
        <el-image
          :src="url"
          fit="cover"
          class="w-[100px] h-[100px] rounded border mr-2"
        ></el-image>
      </div>
    </div>
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
        <image-main :limit="limit" ref="imageMainRef" @choose="handleChoose" />
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
import imageAside from "~/components/imageAside.vue";
import imageMain from "~/components/imageMain.vue";
import { ref } from "vue";

const imageAsideRef = ref(null);
const dialogVisible = ref(false);
const imageMainRef = ref(null);

const handleOpenCreate = () => {
  imageAsideRef.value.handleCreate();
};

const handleAsideChange = (id) => {
  imageMainRef.value.loadData(id);
};

const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1
  }
});
const emit = defineEmits(["update:modelValue"]);

let urls = [];
const handleChoose = (e) => {
  urls = e.map((o) => o.url);
};

const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};

const submit = () => {
  let value = []
  if(props.limit == 1){
    value = urls[0]
  } else {
    value = [...props.modelValue, ...urls]
    if(value.length > props.limit){
      return alert(`最多还能选择${props.limit - props.modelValue.length}张`)
    }
  }
  if (value) {
    emit("update:modelValue", value);
  }
  close();
};

const removeImage = (url) => {
  emit("update:modelValue", props.modelValue.filter(u => u != url));
}
</script>

<style scoped lang="scss">
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>