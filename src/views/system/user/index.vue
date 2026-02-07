<template>
  <div class="app-container">
    <!-- 搜索筛选栏 -->
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="用户名">
        <el-input
          v-model="searchForm.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
          <el-option label="超级管理员" value="admin" />
          <el-option label="编辑" value="editor" />
          <el-option label="查看者" value="viewer" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="searchForm.phone"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserList">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
        <el-button
          type="success"
          @click="handleAdd"
          v-hasPermi="['system:user:add']"
          >新增用户</el-button
        >
        <el-button
          type="danger"
          @click="handleBatchDelete"
          v-hasPermi="['system:user:delete']"
          :disabled="selectedIds.length === 0"
          >批量删除</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 用户列表 -->
    <el-table
      v-loading="loading"
      :data="userList"
      border
      stripe
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" min-width="100" />
      <el-table-column prop="email" label="邮箱" min-width="150" />
      <el-table-column prop="phone" label="手机号" min-width="110" />
      <el-table-column prop="role_name" label="角色" min-width="100">
        <template #default="scope">
          <el-tag :type="getRoleTagType(scope.row.role)">
            {{ scope.row.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" min-width="200">
        <template #default="scope">
          {{ parseTime(scope.row.created_at, "{y}-{m}-{d} {h}:{i}:{s}") }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            v-hasPermi="['system:user:edit']"
            :disabled="scope.row.role === 'admin'"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:user:delete']"
            :disabled="scope.row.role === 'admin'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="mt-4"
    />

    <!-- 新增/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            placeholder="请输入用户名"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码（不少于6位）"
          />
        </el-form-item>
        <el-form-item label="密码" v-if="isEdit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="不填则保持原密码"
          />
          <div class="text-gray-500 text-xs mt-1">提示：不输入则不修改密码</div>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="admin" />
            <el-option label="编辑" value="editor" />
            <el-option label="查看者" value="viewer" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="UserManagement">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { parseTime } from '@/utils/parseTime'
import { userApi } from "@/api/system";
import type {
  UserInfo,
  UserListParams,
  UserForm,
  UserRole,
  BatchDeleteParams,
} from "@/types/system";

// 加载状态
const loading = ref<boolean>(false);
// 用户列表
const userList = ref<UserInfo[]>([]);
// 分页参数
const pageNum = ref<number>(1);
const pageSize = ref<number>(10);
const total = ref<number>(0);
// 选中的用户ID（批量操作）
const selectedIds = ref<number[]>([]);
// 搜索表单
const searchForm = reactive<UserListParams>({
  page: pageNum.value,
  size: pageSize.value,
  username: "",
  role: undefined,
  phone: "",
});
// 弹窗相关
const dialogVisible = ref<boolean>(false);
const dialogTitle = ref<string>("");
const isEdit = ref<boolean>(false);
// 表单相关
const userFormRef = ref();
const userForm = reactive<UserForm>({
  id: undefined,
  username: "",
  password: "",
  email: "",
  phone: "",
  role: "viewer",
});

// 表单校验规则
const userRules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, max: 20, message: "用户名长度2-20位", trigger: "blur" },
  ],
  password: [{ min: 6, max: 20, message: "密码长度6-20位", trigger: "blur" }],
  email: [{ type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
});

// 根据角色获取标签类型
const getRoleTagType = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "danger";
    case "editor":
      return "warning";
    case "viewer":
      return "success";
    default:
      return "info";
  }
};

// 获取用户列表
const getUserList = async () => {
  loading.value = true;
  try {
    const params: UserListParams = {
      page: pageNum.value,
      size: pageSize.value,
      username: searchForm.username || undefined,
      role: searchForm.role,
      phone: searchForm.phone || undefined,
    };
    const res = await userApi.getUserList(params);
    userList.value = res.data;
    total.value = res.count;
  } catch (err: any) {
    ElMessage.error(err.response?.data?.detail || "获取用户列表失败");
  } finally {
    loading.value = false;
  }
};

// 重置搜索表单
const resetSearch = () => {
  searchForm.username = "";
  searchForm.role = undefined;
  searchForm.phone = "";
  pageNum.value = 1;
  getUserList();
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getUserList();
};

// 页码改变
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getUserList();
};

// 多选框选中事件
const handleSelectionChange = (val: UserInfo[]) => {
  selectedIds.value = val.map((item) => item.id);
};

// 新增用户
const handleAdd = () => {
  dialogTitle.value = "新增用户";
  isEdit.value = false;
  dialogVisible.value = true;
  resetForm();
};

// 编辑用户
const handleEdit = async (row: UserInfo) => {
  dialogTitle.value = "编辑用户";
  isEdit.value = true;
  dialogVisible.value = true;
  resetForm();
  try {
    const res = await userApi.getUserDetail(row.id);
    userForm.id = res.id;
    userForm.username = res.username;
    userForm.email = res.email || "";
    userForm.phone = res.phone || "";
    userForm.role = res.role;
    userForm.password = "";
  } catch (err: any) {
    ElMessage.error(err.response?.data?.detail || "获取用户详情失败");
  }
};

// 删除单个用户
const handleDelete = (row: UserInfo) => {
  ElMessageBox.confirm("此操作将永久删除该用户，是否继续？", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await userApi.deleteUser(row.id);
        ElMessage.success("删除成功");
        getUserList();
      } catch (err: any) {
        ElMessage.error(err.response?.data?.detail || "删除失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除用户
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    return ElMessage.warning("请选择要删除的用户");
  }
  ElMessageBox.confirm(
    `确定要删除选中的${selectedIds.value.length}个用户吗？`,
    "温馨提示",
    { type: "warning" }
  ).then(async () => {
    try {
      const params: BatchDeleteParams = { ids: selectedIds.value };
      await userApi.batchDeleteUser(params);
      ElMessage.success("批量删除成功");
      getUserList();
      selectedIds.value = [];
    } catch (err: any) {
      ElMessage.error(err.response?.data?.detail || "批量删除失败");
    }
  });
};

// 提交表单（新增/编辑）
const submitForm = async () => {
  if (!userFormRef.value) return;
  try {
    // 表单校验
    await userFormRef.value.validate();
    // 提交请求
    if (isEdit.value && userForm.id) {
      await userApi.editUser(userForm.id, userForm);
      ElMessage.success("编辑用户成功");
    } else {
      await userApi.addUser(userForm);
      ElMessage.success("新增用户成功");
    }
    // 关闭弹窗并刷新列表
    dialogVisible.value = false;
    getUserList();
  } catch (err: any) {
    if (err.name !== "ValidationError") {
      ElMessage.error(err.response?.data?.detail || "操作失败");
    }
  }
};

// 重置表单
const resetForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields();
  }
  userForm.id = undefined;
  userForm.username = "";
  userForm.password = "";
  userForm.email = "";
  userForm.phone = "";
  userForm.role = "viewer";
};

// 页面加载初始化
onMounted(() => {
  getUserList();
});
</script>

<style scoped>
.text-gray-500 {
  color: #94a3b8;
}
.text-xs {
  font-size: 12px;
}
</style>