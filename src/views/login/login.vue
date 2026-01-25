<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">系统登录</h2>
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
        <!-- 给这个form-item添加自定义class，让这两个元素分别居左和居右 -->
        <el-form-item class="form-item-actions">
          <span></span>
          <el-link type="primary" @click="goToRegister" class="register-link">
            没有账号？去注册
          </el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
// const userStore = useUserStore()
const loginFormRef = ref(null)

// 登录表单
const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  remember: false
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

// 初始化：读取记住的密码（示例）
onMounted(() => {
  const rememberUser = localStorage.getItem('rememberUser')
  if (rememberUser) {
    const { username, password } = JSON.parse(rememberUser)
    loginForm.username = username
    loginForm.password = password
    loginForm.remember = true
  }
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
    // 调用 Pinia 登录方法
    // const success = await userStore.loginAction(loginForm)
    // if (success) {
    //   // 记住密码
    //   if (loginForm.remember) {
    //     localStorage.setItem(
    //       'rememberUser',
    //       JSON.stringify({
    //         username: loginForm.username,
    //         password: loginForm.password
    //       })
    //     )
    //   } else {
    //     localStorage.removeItem('rememberUser')
    //   }
      // 跳转到首页
      router.push('/dashboard')
    // }
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

.form-item-actions {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 80px !important;
}

.form-item-actions :deep(.el-form-item__content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.register-link {
  float: none;
}

.login-btn-item {
  text-align: center;
}

.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

// ========== 新增：去掉浏览器 autofill 蓝色背景 ==========
// 覆盖 Element Plus 输入框的 autofill 样式
:deep(.el-input) {
  // 1. 基础 autofill 样式（大部分浏览器）
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    // 去掉蓝色背景（设置为和输入框默认背景一致）
    -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
    // 去掉文字颜色变化（可选，保持默认黑色）
    -webkit-text-fill-color: #333 !important;
    // 禁用过渡动画（避免闪烁）
    transition: background-color 5000s ease-in-out 0s;
    // 重置边框（如果有蓝色边框也会被覆盖）
    border-color: #dcdfe6 !important;
  }

  // 2. 兼容火狐/Edge 浏览器
  input:autofill,
  input:autofill:hover,
  input:autofill:focus {
    background-color: #ffffff !important;
    color: #333 !important;
    border-color: #dcdfe6 !important;
  }
}

// 3. 聚焦时也保持样式统一（可选，避免聚焦后又出现特殊样式）
:deep(.el-input__wrapper) {
  --el-input-focus-border-color: #409eff !important; // 保留 Element 原生聚焦边框色
  --el-input-hover-border-color: #c0c4cc !important; // 保留 hover 边框色
  background-color: #ffffff !important; // 确保输入框背景始终为白色
}
</style>
