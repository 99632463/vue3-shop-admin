<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增/刷新 -->
    <listHeader @create='handleCreate' @refresh='getData'/>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="primary" size="small" text @click="handleDelete(scope.row.id)">删除</el-button>
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

    <formDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
        <el-form-item label="公告标题">
          <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input v-model="form.content" placeholder="请输入公告内容" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </formDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {getNoticeList, createNotice, updateNotice, deleteNotice} from '~/api/notice'
import formDrawer from '~/components/formDrawer.vue'
import listHeader from "~/components/listHeader.vue";
import {useInitTable, useInitForm} from '~/composables/useCommon'

const {
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNotice
})

// 表单部分
const {
  formDrawerRef,
  formRef,
  form,
  editId,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit
} = useInitForm({
  form: {
    title: '',
    content: ''
  },
  getData,
  create: createNotice,
  update: updateNotice
})
</script>