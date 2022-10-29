<template>
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-1"><eleme-filled /></el-icon>
      帝杀编程
    </span>
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')"><fold /></el-icon>
    <el-icon class="icon-btn" @click="handleRefresh"><refresh /></el-icon>
    <div class="ml-auto flex items-center">
      <el-icon class="icon-btn" @click="toggle"><full-screen /></el-icon>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50">
          <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <form-drawer title="修改密码" ref="formDrawerRef" @submit="updatePwdSubmit">
    <el-form ref="myForm" :model="form">
      <el-form-item label="旧密码">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码">
        </el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.password" placeholder="请输入新密码">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.repassword" placeholder="请再次输入新密码">
        </el-input>
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import { useFullscreen } from "@vueuse/core";
import formDrawer from "~/components/formDrawer.vue";
import { useRepassword, userLogout } from "~/composables/userManager";
import {onBeforeRouteUpdate} from 'vue-router'

const { isFullscreen, toggle } = useFullscreen();

//修改密码
const {
  formDrawerRef,
  form,
  updatePwdSubmit,
  openRepasswordForm
} = useRepassword()

// 退出登录
const {
  handleLogout
} = userLogout()

function handleCommand(val) {
  if (val === "rePassword") {
    openRepasswordForm()
  }
  if (val === "logout") {
    handleLogout();
  }
}

function handleRefresh() {
  window.location.reload();
}
</script>

<style scoped lang="scss">
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 right-0 left-0;
  height: 64px;
  z-index: 1000;
}
.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}
.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}
.icon-btn:hover {
  @apply bg-indigo-600;
}
.dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}
</style>