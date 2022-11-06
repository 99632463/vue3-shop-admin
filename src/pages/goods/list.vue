<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane
        v-for="(item, index) in tabbars"
        :key="index"
        :label="item.name"
        :name="item.key"
      >
      </el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <search :model="searchForm" @search='getData' @reset='resetSearchForm'>
        <searchItem label="关键词">
          <el-input
            v-model="searchForm.title"
            clearable
            placeholder="商品昵称"
          ></el-input>
        </searchItem>
        <template #show>
          <searchItem label="商品分类">
            <el-select v-model="searchForm.category_id" placeholder="商品分类" clearable>
              <el-option v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </searchItem>
        </template>
      </search>

      <!-- 新增/刷新 -->
      <listHeader
         layout="create,delete,refresh" 
         @create="handleCreate" 
         @refresh="getData" 
         @delete='handleMultiDelete'
      >
        <el-button size="small" @click="handleMultiStatusChange(1)">上架</el-button>
        <el-button size="small" @click="handleMultiStatusChange(0)">下架</el-button>
      </listHeader>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        ref="tableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex">
              <el-image
                class="mr-3 rounded"
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
              ></el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥：{{ row.min_price }}</span>
                  <el-divider direction="vertical"></el-divider>
                  <span class="text-gray-500 text-xs"
                    >￥：{{ row.min_oprice }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类：{{ row.category ? row.category.name : "未分类" }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间: {{ row.create_time }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际销量"
          width="70"
          prop="sale_count"
          align="center"
        >
        </el-table-column>
        <el-table-column label="商品状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">
              {{ row.status ? "上架" : "仓库" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="120" align="center" v-if="searchForm.tab != 'delete'">
          <template #default="{ row }">
            <div class="flex flex-col" v-if="row.ischeck == 0">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button class="mt-2 !ml-0" type="danger" size="small" plain
                >审核拒绝</el-button
              >
            </div>
            <span v-else>{{ row.ischeck == 1 ? "通过" : "拒绝" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总库存"
          width="90"
          prop="stock"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab != 'delete'">
              <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
              <el-button type="primary" size="small" text @click="handleSetGoodsSkus(scope.row)">商品规格</el-button>
              <el-button type="primary" size="small" text @click="handleSetGoodsBanner(scope.row)">设置轮播图</el-button>
              <el-button type="primary" size="small" text>商品详情</el-button>
              <el-button
                type="primary"
                size="small"
                text
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
            </div>
            <span v-else>暂无操作</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex items-center justify-center mt-5">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="limit"
          @current-change="getData"
        />
      </div>

      <formDrawer
        ref="formDrawerRef"
        :title="drawerTitle"
        @submit="handleSubmit"
      >
        <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
          <el-form-item label="商品名称">
            <el-input
              v-model="form.title"
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <chooseImage v-model="form.cover"/>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="form.category_id" placeholder="商品分类">
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="商品描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位">
            <el-input
              v-model="form.unit"
              placeholder="单位"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <el-form-item label="总库存">
            <el-input
              type="number"
              v-model="form.stock"
              style="width: 40%"
            >
              <template #append>
                件
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警">
            <el-input
              type="number"
              v-model="form.min_stock"
              style="width: 40%"
            >
              <template #append>
                件
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价">
            <el-input
              type="number"
              v-model="form.min_price"
              style="width: 40%"
            >
              <template #append>
                元
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价">
            <el-input
              type="number"
              v-model="form.min_oprice"
              style="width: 40%"
            >
              <template #append>
                元
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </formDrawer>
    </el-card>

    <banners ref="bannerRef" />
    <skus ref="skusRef" />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getGoodsList,
  updateGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods,
} from "~/api/goods";
import {getCategoryList} from "~/api/category"
import formDrawer from "~/components/formDrawer.vue";
import chooseImage from "~/components/chooseImage.vue";
import listHeader from "~/components/listHeader.vue";
import search from "~/components/search.vue";
import searchItem from "~/components/searchItem.vue";
import banners from "./banners.vue";
import skus from "./skus.vue";
import { useInitTable, useInitForm } from "~/composables/useCommon";

const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  tableRef,
  handleSelectionChange,
  handleMultiDelete,
  handleMultiStatusChange
} = useInitTable({
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  delete: deleteGoods,
  updateStatus: updateGoodsStatus,
});

// 表单部分
const {
  formDrawerRef,
  formRef,
  form,
  editId,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit,
} = useInitForm({
  form: {
    "title": null, //商品名称
    "category_id": null, //商品分类
    "cover": null, //商品封面
    "desc": null, //商品描述
    "unit": "件", //商品单位
    "stock": 100, //总库存
    "min_stock": 10, //库存预警
    "status": 1, //是否上架 0仓库1上架
    "stock_display": 1, //库存显示 0隐藏1禁用
    "min_price": 0, //最低销售价
    "min_oprice": 0 //最低原价
  },
  getData,
  create: createGoods,
  update: updateGoods,
});

const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];

// 商品分类
const category_list = ref([])
getCategoryList().then(res => {
  category_list.value = res
})

// 轮播图
const bannerRef = ref(null)
const handleSetGoodsBanner = (row) =>{
  bannerRef.value.open(row)
}

// 规格
const skusRef = ref(null)
const handleSetGoodsSkus = (row) =>{
  skusRef.value.open(row)
}
</script>