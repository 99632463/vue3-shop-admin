<template>
  <el-row class="min-h-screen login-container">
    <el-col :lg="16" :sm="12" class="left">
      <div>
        <div class="welcome">欢迎光临</div>
        <div class="text-gray-200 text-sm">欢迎来到 vite 学习 欢迎来到 vite 学习 </div>
      </div>
    </el-col>
    <el-col :lg="8" :sm="12" class="right">
      <h5 class="welcome">欢迎回来</h5>
      <div class="title">
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>账号密码登录</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>
      <el-form ref="myForm" :model="form" :rules="rules" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="请输入密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            class="w-[250px]" 
            round 
            color="#626aef" 
            type="primary" 
            :loading="loading"
            @click="onSubmit"
            >
              登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { toast } from '~/composables/utils'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const form = reactive({
  username: '',
  password: '',
})
const rules = {
  username: [
    {
      required: true, 
      message: '用户名不能为空', 
      trigger: 'blur' 
    }
  ],
  password: [
    {
      required: true, 
      message: '密码不能为空', 
      trigger: 'blur' 
    }
  ]
}
const myForm = ref(null)
const loading = ref(false)

const onSubmit = () => {
  myForm.value.validate(valid => {
    if(!valid) return
    loading.value = true
    store.dispatch('login', form)
      .then(() => {
        // 提示成功
        toast('登录成功')
        // 跳转到首页
        router.push('/')
      }).finally(() => {
        loading.value = false
      })
  })
}

const onKeyUp = (e) => {
  if (e.key === 'Enter') {
    onSubmit()
  }
}

onMounted(() => {
  document.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keyup', onKeyUp)
})

</script>

<style scoped lang="scss">
.login-container{
  .left{
    @apply bg-indigo-500 flex justify-center items-center;
    .welcome{
      @apply font-bold text-5xl text-light-50 mb-4;
    }
  }
  .right{
    @apply bg-light-50 flex justify-center items-center flex-col;
    .welcome{
      @apply font-bold text-3xl text-gray-800;
    }
    .title{
      @apply flex items-center text-gray-300 my-5 space-x-2;
    }
  }
}
</style>