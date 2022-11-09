<template>
  <el-dialog title="规格选择" v-model="dialogVisiable" width="80%" top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="220px" class="image-aside">
        <div class="top">
          <div
            class="sku-list"
            :class="{ active: activeId == item.id }"
            v-for="(item, index) in tableData"
            :key="index"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
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
      <el-main>
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
            {{item}}
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <template #footer>
      <span>
        <el-button @click="dialogVisiable = false">Cancel</el-button>
        <el-button type="primary" @click="submit">OK</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getSkusList } from "~/api/skus";
import { useInitTable } from "~/composables/useCommon";

const dialogVisiable = ref(false);
const activeId = ref(0);
const { loading, currentPage, limit, total, tableData, getData } = useInitTable(
  {
    getList: getSkusList,
    onGetListSuccess: res => {
      tableData.value = res.list
      total.value = res.totalCount

      if(tableData.value.length > 0){
        handleChangeActiveId(tableData.value[0].id)
      }
    }
  }
);

const callbackFunction = ref(null)
const open = (callback = null) => {
  callbackFunction.value = callback
  getData(1);
  dialogVisiable.value = true;
};

const list = ref([])
const form = reactive({
  name: '',
  list: []
})

const handleChangeActiveId = (id) => {
  activeId.value = id
  list.value = []
  let item = tableData.value.find(o => o.id == id)
  if(item){
    list.value = item.default.split(',')
    form.name = item.name
  }
}

const submit = () => {
  if(typeof callbackFunction.value === 'function') {
    callbackFunction.value(form)
  }
  dialogVisiable.value = false
};

defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
  .top {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 50px;
    overflow-y: auto;
    .sku-list {
      @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
      border-bottom: 1px solid #f4f4f4;
      &:hover {
        @apply bg-blue-50;
      }
    }
    .active{
      @apply bg-blue-50;
    }
  }
  .bottom {
    @apply flex justify-center items-center;
    position: absolute;
    height: 50px;
    right: 0;
    left: 0;
    bottom: 0;
  }
}
</style>