<template>
  <el-drawer title="设置轮播图" v-model="dialogVisiable" size="50%"
    :destroy-on-close="true">
    <el-form :model="form" label-width="80px" >
      <el-form-item label="轮播图">
        <chooseImage v-model="form.banners" :limit='9'/>
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    
  </el-drawer>
</template>

<script setup>
import {ref, reactive} from 'vue'
import chooseImage from '~/components/chooseImage.vue';
import {readGoods, setGoodsBanner} from '~/api/goods'

const form = reactive({
  banners: []
})
const dialogVisiable = ref(false)
const loading = ref(false)

const submit = () => {
  loading.value = true
  setGoodsBanner(goodsId.value, form).then(res => {
    dialogVisiable.value = false
  }).finally(() => {
    loading.value = false
  })
}

const goodsId = ref(0)
const open = (row) =>{
  goodsId.value = row.id
  dialogVisiable.value = true
  readGoods(goodsId.value).then(res => {
    form.banners = res.goodsBanner.map(o => o.url)
  })
}

defineExpose({
  open
})
</script>