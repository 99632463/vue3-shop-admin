<template>
  <el-drawer
    title="设置商品规格"
    v-model="dialogVisiable"
    size="70%"
    :destroy-on-close="true"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0">单规格</el-radio>
          <el-radio :label="1">多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input v-model="form.sku_value.oprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input v-model="form.sku_value.pprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input v-model="form.sku_value.cprice" style="width: 35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width: 35%">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input v-model="form.sku_value.volume" style="width: 35%">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <skuCard />
      </template>
      <el-form-item>
        <el-button v-loading="loading" type="primary" @click="submit"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import { readGoods, updateGoodsSkus } from "~/api/goods";
import skuCard from './components/skuCard.vue'
import {initSkuCardList, goodsId} from '~/composables/useSku'

const form = reactive({
  sku_type: 0,
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  },
});
const dialogVisiable = ref(false);
const loading = ref(false);

const submit = () => {
  loading.value = true;
  updateGoodsSkus(goodsId.value, form)
    .then((res) => {
      dialogVisiable.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

const open = (row) => {
  goodsId.value = row.id;
  dialogVisiable.value = true;
  readGoods(goodsId.value).then((res) => {
    form.sku_type = res.sku_type;
    form.sku_value = res.sku_value || {
      oprice: 0,
      pprice: 0,
      cprice: 0,
      weight: 0,
      volume: 0,
    };

    initSkuCardList(res)
  });
};

defineExpose({
  open,
});
</script>