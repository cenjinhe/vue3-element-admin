<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">{{ formTitle }}</h2>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="80px"
        class="login-form"
        autocomplete="off"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            tabindex="1"
            size="large"
            autocomplete="on"
            readonly
            @focus="e => e.target.removeAttribute('readonly')"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            :type="passwordType"
            tabindex="2"
            autocomplete="on"
            size="large"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item class="login-btn-item">
          <el-button
            type="primary"
            class="login-btn"
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="goToRegister" class="register-link">
            没有账号？去注册
          </el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { login } from '@/api/user'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
// const userStore = useUserStore()
const loginFormRef = ref(null)

// 登录表单
const formTitle = ref('用户登录')
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 显示密码
const passwordType = ref('password')
const showPwd = () => {
  // 切换值
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

// 跳转到注册页
const goToRegister = () => {
  router.push('/register')
}

// 登录处理
const loading = ref(false)
const handleLogin = async () => {
  // 表单验证
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await login(loginForm).then(respone => {
      const message = '登录成功！跳转到首页'
      ElMessage({
        message: message,
        type: 'dashboard',
        duration: 3 * 1000
      });
      router.push('/dashboard')
    }).catch(error => {
      console.error('登录失败详情：', error)
      const message = error?.response?.data?.message || error.message || '登录失败'
      ElMessage({
        message: message,
        type: 'warning',
        duration: 5 * 1000
      });
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;

.login-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 450px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: #1989fa;
}

.login-form {
  margin-top: 20px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}

.register-link {
  float: right;
}

.login-btn-item {
  text-align: center;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

// ========== 去掉浏览器 autofill 蓝色背景 ==========
:deep(.el-input) {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    -webkit-text-fill-color: #333 !important;
    transition: background-color 5000s ease-in-out 0s;
    border-color: #dcdfe6 !important;
  }
  input:autofill,
  input:autofill:hover,
  input:autofill:focus {
    background-color: #ffffff !important;
    color: #333 !important;
    border-color: #dcdfe6 !important;
  }
}

:deep(.el-input__wrapper) {
  --el-input-focus-border-color: #409eff !important;
  --el-input-hover-border-color: #c0c4cc !important;
  background-color: #ffffff !important;
}
</style>
