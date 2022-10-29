<template>
  <div class="f-tag-list" :style="{left: $store.state.asideWidth}">
    <el-tabs
      v-model="activeTabsValue"
      type="card"
      style="min-width: 100px"
      @tab-remove="removeTab"
      @tab-change="changeTab"
    >
      <el-tab-pane
        v-for="item in activeTabs"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/'"
      >
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 44px"></div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import router from "../../router";

const cookie = useCookies()
const route = useRoute()

// let tabIndex = 2;
const activeTabsValue = ref(route.path);
const activeTabs = ref([
  {
    title: "后台首页",
    path: '/'
  }
]);

// 初始化标签导航列表
function initTabList(){
  let tbs = cookie.get('tabList')
  if (tbs) {
    activeTabs.value = tbs
  }
}
initTabList()

// 点击菜单添加对应标签导航
const addTab = obj => {
  let tab = activeTabs.value.findIndex(item => item.path === obj.path) == -1

  if (tab) {
    activeTabs.value.push(obj)
  }
  cookie.set('tabList', activeTabs.value)
};

// 删除标签导航栏
const removeTab = t => {
  const tabs = activeTabs.value;
  let a = activeTabsValue.value;
  if (a === t) {
    tabs.forEach((tab, index) => {
      if (tab.path === t) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          a = nextTab.path;
        }
      }
    });
  }

  activeTabsValue.value = a;
  activeTabs.value = tabs.filter((tab) => tab.path !== t);
};

// 标签导航发生变化
function changeTab(e){
  router.push(e)
}

// 关闭其他 和 关闭所有
function handleClose(e) {
  if (e === 'clearAll') {
    // 切换回首页
    activeTabsValue.value = '/'
    // 过滤只剩下首页
    activeTabs.value = [
      {
        title: "后台首页",
        path: '/'
      }
    ]
  } else if (e === 'clearOther') {
    // 过滤只剩下首页和当前激活
    activeTabs.value = activeTabs.value.filter(x => x.path === '/' || x.path === activeTabsValue.value)
    cookie.set('tabList', activeTabs.value)
  }
}

onBeforeRouteUpdate((to) => {
  activeTabsValue.value = to.path
  addTab({
    title: to.meta.title,
    path: to.path
  })
})
</script>

<style scoped lang="scss">
.f-tag-list{
  @apply fixed bg-gray-100 flex items-center px-2;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
}
.tag-btn{
  @apply bg-white rounded ml-auto flex items-center justify-center px-2;
  height: 32px;
}
:deep(.el-tabs__header) {
  border: 0 !important;
  @apply mb-0;
}
:deep(.el-tabs__nav) {
  border: 0 !important;
}
:deep(.el-tabs__item) {
  border: 0 !important;
  @apply bg-white mx-1 rounded;
  line-height: 32px;
  height: 32px;
}
:deep(.el-tabs__nav-next),:deep(.el-tabs__nav-prev) {
  height: 32px;
  line-height: 32px;
}
:deep(.is-disabled){
  cursor: not-allowed;
  @apply text-gray-300;
}
</style>