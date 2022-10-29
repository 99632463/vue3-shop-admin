<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <aside-list 
        :active="activeId === item.id" 
        v-for="(item, index) in list" 
        :key="index" 
        @edit="handleEdit(item)"
        @click="handleChangeActiveId(item.id)"
      >
        {{item.name}}
      </aside-list>
    </div>
    <div class="bottom">
      <el-pagination 
        background 
        layout="prev, next" 
        :total="total" 
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>

  <formDrawer :title="drawTitle" ref="formDrawerRef" @submit="handleSubmit ">
    <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
      <el-form-item label="分类名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
      </el-form-item>
    </el-form>
  </formDrawer>
</template>
  
<script setup>
import asideList from '~/components/asideList.vue'
import { ref, reactive, computed } from 'vue';
import { getImageClassList, createImageClass, updateImageClass } from '~/api/imageClass'
import formDrawer from '~/components/formDrawer.vue'

const list = ref([])
let loading = ref(false)
const activeId = ref(0) // 选中图库分类id

// pagination
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

function getData(p = null){
  if (typeof p === 'number') {
    currentPage.value = p
  }

  loading.value = true
  getImageClassList(currentPage.value).then(res => {
    total.value = res.totalCount
    list.value = res.list 
    const item = list.value[0]
    if(item){
      // activeId.value = item.id
      handleChangeActiveId(item.id)
    }
  }).finally(() => {
    loading.value = false
  })
}
getData()

let formDrawerRef = ref(null)
let editId = ref(0)
const drawTitle = computed(() => editId.value ? '修改' : '新增')
const form = reactive({
  name: '',
  order: 50
})

const handleCreate = () => {
  editId.value = 0
  form.name = ''
  form.order = 50
  formDrawerRef.value.open()
}

const handleEdit = (item) => {
  editId.value = item.id
  form.name = item.name
  form.order = item.order
  formDrawerRef.value.open()
}

function handleSubmit() {
  formDrawerRef.value.setLoading(true)
  const func = editId.value ? updateImageClass(editId.value, form) : createImageClass(form)
  func.then(res => {
    getData(editId.value ? currentPage.value : 1)
    formDrawerRef.value.close()
  }).finally(() => {
    formDrawerRef.value.setLoading(false)
  })
}

// 切换分类
const emit = defineEmits(['change'])
function handleChangeActiveId(id) {
  activeId.value = id
  emit('change', id)
}

defineExpose({
  handleCreate,
})

</script>
  
<style scoped lang="scss">
.image-aside{
  border-right: 1px solid #eeeeee;
  position: relative;
  .top{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
  }
  .bottom{
    @apply flex justify-center items-center;
    position: absolute;
    height: 50px;
    right: 0;
    left: 0;
    bottom: 0;
  }
}
</style>
  