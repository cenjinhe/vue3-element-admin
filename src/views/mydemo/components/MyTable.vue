<template>
  <div class="table-page">
    <!-- 表格：绑定分页后的数据 -->
    <el-table :data="tableDataSlice" border style="width: 100%">
      <!-- 示例列：根据实际业务定义 -->
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column label="状态" prop="status" align="center" />
    </el-table>

    <!-- 分页器：控制每页10行 -->
    <div class="pagination" style="margin-top: 16px; text-align: right">
      <!-- 绑定当前页码 -->
      <!-- 绑定每页条数（设为10） -->
      <!-- 总数据量 -->
      <!-- 可选每页条数（默认选中10） -->
      <!-- 分页器布局 -->
      <!-- 每页条数改变时触发 -->
      <!-- 每页条数改变时触发 -->
      <!-- 页码改变时触发 -->
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 1. 模拟原始数据（实际项目从接口获取）
const tableData = ref([
  { id: 1, name: "数据1", status: "正常" },
  { id: 2, name: "数据2", status: "正常" },
  { id: 3, name: "数据3", status: "禁用" },
  { id: 4, name: "数据4", status: "正常" },
  { id: 5, name: "数据5", status: "正常" },
  { id: 6, name: "数据6", status: "禁用" },
  { id: 7, name: "数据7", status: "正常" },
  { id: 8, name: "数据8", status: "正常" },
  { id: 9, name: "数据9", status: "禁用" },
  { id: 10, name: "数据10", status: "正常" },
  { id: 11, name: "数据11", status: "正常" },
  { id: 12, name: "数据12", status: "禁用" },
  { id: 13, name: "数据13", status: "正常" },
  { id: 14, name: "数据14", status: "正常" },
  { id: 15, name: "数据15", status: "禁用" },
  { id: 16, name: "数据16", status: "正常" },
  // ... 可添加更多测试数据（建议超过10条，方便看分页效果）
]);

// 2. 分页核心变量
const currentPage = ref(1); // 当前页码（默认第1页）
const pageSize = ref(10); // 每页条数（固定为10，也可通过分页器切换）

// 3. 计算属性：获取当前页要显示的数据（切片处理）
const tableDataSlice = computed(() => {
  // 起始索引 = (当前页码 - 1) * 每页条数
  const startIndex = (currentPage.value - 1) * pageSize.value;
  // 结束索引 = 起始索引 + 每页条数
  const endIndex = startIndex + pageSize.value;
  // 返回当前页数据（slice 不改变原数组）
  return tableData.value.slice(startIndex, endIndex);
});

// 4. 分页器事件：每页条数改变时更新页码（避免数据超出）
const handleSizeChange = (val) => {
  pageSize.value = val; // 更新每页条数
  currentPage.value = 1; // 重置为第1页
};

// 5. 分页器事件：页码改变时触发（自动更新表格数据，因 tableDataSlice 依赖 currentPage）
const handleCurrentChange = (val) => {
  currentPage.value = val;
};
</script>

<style scoped>
/* 可选：调整分页器样式 */
.pagination {
  padding-right: 20px;
}
</style>
