<template>
  <el-container>
    <el-header>
      <!-- 头部 -->
      <f-header></f-header>
    </el-header>
    <el-container>
      <el-aside class="el-aside" :width="$store.state.asideWidth">
        <!-- 侧边栏 -->
        <f-menu></f-menu>
      </el-aside>
      <el-main class="overflow-x-hidden">
        <!-- 标签导航 -->
        <tag-list></tag-list>
        <!-- 动态内容区域 -->
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="10">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import fHeader from './components/fHeader.vue'
import fMenu from './components/fMenu.vue'
import tagList from './components/tagList.vue'
</script>

<style scoped>
.el-aside{
  transition: all 0.2s;
}
.fade-enter-from{
  opacity: 0;
  transform: translateX(-100%);
}
.fade-enter-to{
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-from{
  opacity: 1;
  transform: translateX(0);
}
.fade-leave-to{
  opacity: 0;
  transform: translateX(100%);
}
.fade-enter-active, .fade-leave-active{
  transition: all 0.3s;
}
.fade-enter-active{
  transition-delay: 0.3s;
}
</style>