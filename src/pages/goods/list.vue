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
      <el-form :model="searchForm" label-width="80px" class="mb-3">
        <el-row :gutter="20">
          <el-col :span="8" :offset="0">
            <el-form-item label="关键词">
              <el-input
                v-model="searchForm.title"
                clearable
                placeholder="商品昵称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :offset="8">
            <div class="flex items-center justify-end">
              <el-button type="primary" @click="getData">搜索</el-button>
              <el-button @click="resetSearchForm">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <!-- 新增/刷新 -->
      <listHeader @create="handleCreate" @refresh="getData" />

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div>
              测试
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属角色" align="center">
          <template #default="{ row }">
            {{ row.role?.name || "-" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1"
              :inactive-value="0"
              :loading="row.statusLoading"
              :disabled="row.super == 1"
              @change="handleStatusChange($event, row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              text
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              text
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
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
          <el-form-item label="用户名">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <chooseImage v-model="form.avatar" />
          </el-form-item>
          <el-form-item label="所属角色">
            <el-select v-model="form.role_id" placeholder="选择所属角色">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-form>
      </formDrawer>
    </el-card>
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
import formDrawer from "~/components/formDrawer.vue";
import chooseImage from "~/components/chooseImage.vue";
import listHeader from "~/components/listHeader.vue";
import { useInitTable, useInitForm } from "~/composables/useCommon";

const roles = ref([]);

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
  handleStatusChange,
} = useInitTable({
  getList: getGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
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
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
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
</script>