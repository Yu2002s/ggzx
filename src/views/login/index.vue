<template>
  <div class="login-container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login-form"
          ref="loginRuleFormRef"
          :rules="rules"
          :model="loginForm"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              type="password"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              @click="login"
              type="primary"
              class="login-btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { ref, reactive } from 'vue'

// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
// 引入获取当前时间的函数
import { getTime } from '@/utils/time'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 定义变量控制按钮加载
const loading = ref(false)

const loginRuleFormRef = ref<FormInstance>()

interface LoginRuleForm {
  username: string
  password: string
}

// 收集账号与密码的数据
const loginForm = reactive<LoginRuleForm>({
  username: 'admin',
  password: 'atguigu123',
})

// 表单校验规则
const rules = reactive<FormRules<LoginRuleForm>>({
  username: [
    {
      required: true, // 必填
      message: '用户名不能为空',
      trigger: 'blur', // 焦点改变时进行校验
    },
    {
      min: 5, // 文本长度最少6位
      max: 10,
      message: '用户名长度至少6位至10位',
      trigger: 'blur', // 文本内容改变时进行校验
    },
  ],
  password: [
    {
      min: 6,
      max: 15,
      required: true,
      message: '密码长度必须为6到15位',
      trigger: 'blur',
    },
  ],
})

// 登录按钮回调
const login = async () => {
  // 表单校验
  await loginRuleFormRef.value?.validate(async (valid) => {
    if (!valid)
      return ElNotification.error({
        title: '登录失败',
        message: '表单验证失败',
      })

    // 表单校验通过以后，进行登录
    loading.value = true
    // 点击登录按钮以后干什么？

    // 通知仓库发登录请求
    try {
      // 保证登录成功
      await userStore.userLogin(loginForm)
      // 跳转到首页
      // 判断登录的时候，路由路径当中的query参数是否有redirect参数，没有则跳转到首页
      const redirect = route.query.redirect as string
      await router.push(redirect || '/')
      // 登录成功的提示信息
      ElNotification({
        type: 'success',
        title: `HI，${getTime()}好`,
        message: '登录成功',
      })
    } catch (error) {
      // 登录失败的提示信息
      ElNotification({
        type: 'error',
        message: (error as Error).message,
      })
      console.log(error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: url(@/assets/images/background.jpg) no-repeat;
  background-size: cover;

  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url(@/assets/images/login_form.png) no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>
