<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增/刷新 -->
    <listHeader @create='handleCreate' @refresh='getData'/>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="380" />
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
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
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
        <el-form-item label="角色名称">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.desc" placeholder="请输入角色描述" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
    </formDrawer>

    <formDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
      <el-tree-v2 
        ref="elTreeRef"
        :data="ruleList" 
        node-key="id"
        :check-strictly="checkStrictly"
        :props="{label:'name',children: 'child'}"  
        show-checkbox 
        :height="treeHeight"
        :default-expanded-keys="defaultExpandedKeys"
        @check="handleCheckChange"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small">
              {{data.menu ? '菜单' : '权限'}}
            </el-tag>
            <span class="ml-2 text-sm">{{data.name}}</span>
          </div>
        </template>
      </el-tree-v2>
    </formDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import {getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules} from '~/api/role'
import { getRuleList } from '~/api/rule'
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
  handleDelete,
  handleStatusChange
} = useInitTable({
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus
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
    name: '',
    desc: '',
    status: 1
  },
  getData,
  create: createRole,
  update: updateRole
})

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
// 当前用户拥护的权限 id
const ruleIds = ref([])
const checkStrictly = ref(false)

const openSetRule = row => {
  roleId.value = row.id
  treeHeight.value = window.innerHeight - 180
  checkStrictly.value = true
  getRuleList(1).then(res => {
    ruleList.value = res.list
    defaultExpandedKeys.value = res.list.map(o => o.id)
    setRuleFormDrawerRef.value.open()

    ruleIds.value = row.rules.map(o => o.id)
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value)
      checkStrictly.value = false
    }, 150)
  })
}
const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value.setLoading(true)
  setRoleRules(roleId.value, ruleIds.value)
    .then(res => {
      setRuleFormDrawerRef.value.close()
      getData()
    }).finally(() => {
      setRuleFormDrawerRef.value.setLoading(false)
    })
}

const handleCheckChange = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1]
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}
</script>