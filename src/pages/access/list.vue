<template>
  <el-card shadow="never" class="border-0">
    <listHeader @create="handleCreate" @refresh='getData'/>
    <el-tree 
      v-loading="loading" 
      :data="tableData" 
      :props="{label:'name',children: 'child'}" 
      node-key="id"
      :default-expanded-keys="defaultCheckedKeys"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{data.menu ? '菜单' : '权限'}}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="ml-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{data.name}}</span>

          <div class="ml-auto">
            <el-switch v-model="data.status" :active-value="1" :inactive-value="0" @change="handleStatusChange($event, data)">
            </el-switch>
            <el-button text type="primary" size="small" @click.stop="handleEdit(data)">修改</el-button>
            <el-button text type="primary" size="small" @click.stop="addChild(data.id)">增加</el-button>
            <el-button text type="primary" size="small" @click="handleDelete(data.id)">删除</el-button>
          </div>
        </div>
      </template>
    </el-tree>

    <formDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" label-width="80px" :inline="false">
        <el-form-item label="上级菜单">
          <!-- <el-input v-model="form.rule_id"></el-input> -->
          <el-cascader 
            v-model="form.rule_id" 
            :options="options" 
            :props="{value: 'id', label:'name',children: 'child', checkStrictly: true, emitPath: false}" 
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单/规则">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="form.name" style="width: 30%"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-if="form.menu == 1">
          <iconSelect v-model="form.icon"/>
        </el-form-item>
        <el-form-item label="前端路由" v-if="form.menu == 1 && form.rule_id > 0">
          <el-input v-model="form.frontpath"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" v-if="form.menu == 0">
          <el-input v-model="form.condition"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" v-if="form.menu == 0">
          <el-select v-model="form.method" class="m-2" placeholder="请选择请求方式">
            <el-option v-for="item in ['GET','POST','PUT','DELETE']"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.order" />
        </el-form-item>
      </el-form>
    </formDrawer>
  </el-card>
</template>

<script setup>
import listHeader from "~/components/listHeader.vue";
import {getRuleList, createRule, updateRule,updateRuleStatus,deleteRule} from '~/api/rule'
import {useInitTable, useInitForm} from '~/composables/useCommon'
import { ref } from "vue";
import formDrawer from '~/components/formDrawer.vue'
import iconSelect from '~/components/iconSelect.vue'

let defaultCheckedKeys = ref([])
const options = ref([])
const {
  loading,
  tableData,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  getList: getRuleList,
  onGetListSuccess: res => {
    options.value = res.rules
    tableData.value = res.list
    defaultCheckedKeys.value = res.list.map(o => o.id)
  },
  delete: deleteRule,
  updateStatus: updateRuleStatus
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
    rule_id: 0,
    menu: 0,
    name: '',
    condition: '',
    method: 'GET',
    status: 1,
    order: 50,
    icon: '',
    frontpath: ''
  },
  getData,
  create: createRule,
  update: updateRule
})

const addChild = id => {
  handleCreate()
  form.rule_id = id
  form.status = 1
}
</script>

<style scoped lang="scss">
:deep(.el-tree-node__label){
  flex: 1;
}
:deep(.el-tree-node__content){
  padding: 20px 0;
}
.custom-tree-node{
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
</style>