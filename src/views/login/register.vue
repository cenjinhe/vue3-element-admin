<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">{{ formTitle }}</h2>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        autocomplete="off"
      >
        <el-form-item label="用户名" prop="username">
          <!--用户名框加readonly + @focus解除只读，可彻底规避浏览器的自动填充逻辑。-->
          <!--将所有输入框的autocomplete="on"改为"new-password"（这个值是浏览器对密码框自动填充的 “禁用标识”，非密码框也适用）-->
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            tabindex="2"
            autocomplete="new-password"
            size="large"
            clearable
            readonly
            @focus="e => e.target.removeAttribute('readonly')"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="registerForm.phone"
            placeholder="请输入手机号(可选)"
            tabindex="1"
            autocomplete="new-password"
            size="large"
            readonly
            @focus="e => e.target.removeAttribute('readonly')"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            placeholder="请输入密码"
            :type="passwordType"
            tabindex="3"
            autocomplete="new-password"
            size="large"
          />
          <span class="show-pwd" @click="showPwd(0)">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            placeholder="请确认密码"
            :type="confirmPasswordType"
            tabindex="4"
            autocomplete="new-password"
            size="large"
          />
          <span class="show-pwd" @click="showPwd(1)">
            <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item class="register-btn-item">
          <el-button
            type="primary"
            class="register-btn"
            @click="handleRegister"
            :loading="loading"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="goToLogin" class="login-link">
            已有账号？去登录
          </el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import store from '@/store'

const router = useRouter()
const loading = ref(false)
const registerFormRef = ref(null)

// 注册表单
const formTitle = ref('用户注册')
const registerForm = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/, message: '密码需包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 显示密码
const passwordType = ref('password')
const confirmPasswordType = ref('password')
const showPwd = (idx) => {
  // 切换值
  if (idx === 0) passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
  if (idx === 1) confirmPasswordType.value = confirmPasswordType.value === 'password' ? 'text' : 'password'
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 注册处理
const handleRegister = async () => {
  // 表单验证
  const valid = await registerFormRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    store.user().register({
      username: registerForm.username,
      phone: registerForm.phone,
      password: registerForm.password
    })
    .then(respone => {
      const message = '注册成功！前往登录'
      ElMessage({
        message: message,
        type: 'success',
        duration: 3 * 1000
      });
      router.push('/login')
    })
    .catch(error => {
      console.error('注册失败详情：', error)
      const message = error?.response?.data?.message || error.message || '注册失败'
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

.register-container {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-card {
  width: 450px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: #1989fa;
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

.login-link {
  float: right;
}

.register-btn-item {
  text-align: center;
}

.register-btn {
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
