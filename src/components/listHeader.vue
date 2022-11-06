<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button v-if="btns.includes('create')" type="primary" size="small" @click="$emit('create')"
        >新增</el-button
      >
      <el-button v-if="btns.includes('delete')" type="danger" size="small" @click="$emit('delete')"
        >批量删除</el-button
      >
      <slot />
    </div>
    <el-button v-if="btns.includes('refresh')" text @click="$emit('refresh')">
      <el-icon :size="20"><Refresh /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  layout: {
    type: String,
    default: 'create,refresh'
  }
})

const btns = computed(() => props.layout.split(','))
defineEmits(["create", "refresh", "delete"]);
</script>