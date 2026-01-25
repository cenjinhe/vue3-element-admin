<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="register-title">用户注册</h2>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
        class="register-form"
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
            placeholder="请输入手机号"
            tabindex="1"
            autocomplete="new-password"
            size="large"
            clearable
            readonly
            @focus="e => e.target.removeAttribute('readonly')"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            tabindex="3"
            autocomplete="new-password"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            tabindex="4"
            autocomplete="new-password"
            size="large"
            clearable
          />
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
import { register } from '@/api/user'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
// import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
// const userStore = useUserStore()
const loading = ref(false)
const registerFormRef = ref(null)

// 注册表单
const registerForm = reactive({
  username: 'admin',
  phone: '18967262058',
  password: '123abc',
  confirmPassword: '123abc'
})

// 表单验证规则
const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
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
    await register({
      'user_name': registerForm.username,
      'phone': registerForm.phone,
      'hashed_password': registerForm.password
    }).then(respone => {
      const message = '注册成功！前往登录'
      ElMessage({
        message: message,
        type: 'success',
        duration: 3 * 1000
      });
      router.push('/login')
    }).catch(error => {
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

<style scoped>
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

.register-form {
  /*margin-top: 20px;*/
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
</style>
