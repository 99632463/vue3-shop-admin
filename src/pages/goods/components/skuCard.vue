<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="index"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon @click="handleChooseSku(item)"><more /></el-icon>
            </template>
          </el-input>
          <el-button
            class="ml-auto"
            size="small"
            @click="sortCard('up', index)"
            :disabled="index == 0"
          >
            <el-icon><Top /></el-icon>
          </el-button>
          <el-button
            size="small"
            @click="sortCard('down', index)"
            :disabled="index == sku_card_list.length - 1"
          >
            <el-icon><Bottom /></el-icon>
          </el-button>
          <el-button size="small" @click="handleDelete(item)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </template>
      <skuCardItem :skuCardId="item.id" />
    </el-card>
    <el-button
      v-loading="btnLoading"
      type="success"
      size="small"
      @click="addSkusCardEvent"
      >添加规格</el-button
    >
  </el-form-item>

  <chooseSku ref="chooseSkuRef"/>
</template>

<script setup>
import {ref} from 'vue'
import skuCardItem from "./skuCardItem.vue";
import {
  sku_card_list,
  btnLoading,
  addSkusCardEvent,
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading,
  handleChooseSetGoodsSkusCard
} from "~/composables/useSku";
import chooseSku from "~/components/chooseSku.vue";

const chooseSkuRef = ref(null)

const handleChooseSku = (item) => {
  chooseSkuRef.value.open((value) => {
    handleChooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list
    })
  })
}
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>