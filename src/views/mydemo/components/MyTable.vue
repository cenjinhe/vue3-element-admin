<template>
  <div class="table-page">
    <!-- 搜索和过滤区域 -->
    <div
      class="search-bar"
      style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center"
    >
      <!-- 名称搜索框 -->
      <el-input
        v-model="nameSearch"
        placeholder="请输入名称搜索"
        clearable
        style="width: 200px"
        @input="handleSearch"
      />
      <!-- 状态过滤下拉框 -->
      <el-select
        v-model="statusFilter"
        placeholder="请选择状态过滤"
        clearable
        style="width: 150px"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="正常" value="正常" />
        <el-option label="禁用" value="禁用" />
      </el-select>
    </div>

    <!-- 表格：绑定分页后的数据，添加排序事件 -->
    <el-table
      :data="tableDataSlice"
      border
      style="width: 100%"
      :default-sort="{ prop: 'id', order: 'ascending' }"
      @sort-change="handleSortChange"
    >
      <!-- ID列：默认排序 -->
      <el-table-column label="ID" prop="id" align="center" />
      <!-- 名称列：排序 + 搜索 -->
      <el-table-column label="名称" prop="name" align="center" sortable />
      <!-- 状态列：排序 + 过滤 -->
      <el-table-column label="状态" prop="status" align="center" sortable />
    </el-table>

    <!-- 分页器：保持原有分页逻辑 -->
    <div class="pagination" style="margin-top: 16px; text-align: right">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredTableData.length"
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
]);

// 2. 分页核心变量
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数

// 3. 搜索/过滤/排序相关变量
const nameSearch = ref(""); // 名称搜索关键词
const statusFilter = ref(""); // 状态过滤值
const sortProp = ref("id"); // 排序字段
const sortOrder = ref("ascending"); // 排序方向（ascending/descending）

// 4. 第一步：过滤数据（先过滤搜索和筛选条件）
const filteredTableData = computed(() => {
  let result = [...tableData.value];

  // 名称搜索过滤（模糊匹配）
  if (nameSearch.value) {
    result = result.filter((item) =>
      item.name.toLowerCase().includes(nameSearch.value.toLowerCase())
    );
  }

  // 状态过滤（精确匹配）
  if (statusFilter.value) {
    result = result.filter((item) => item.status === statusFilter.value);
  }

  // 排序处理
  result.sort((a, b) => {
    if (sortOrder.value === "ascending") {
      return a[sortProp.value] > b[sortProp.value] ? 1 : -1;
    } else {
      return a[sortProp.value] < b[sortProp.value] ? 1 : -1;
    }
  });

  return result;
});

// 5. 第二步：分页处理（基于过滤排序后的数据）
const tableDataSlice = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredTableData.value.slice(startIndex, endIndex);
});

// 6. 事件处理函数
// 名称搜索事件
const handleSearch = () => {
  currentPage.value = 1; // 搜索后重置为第一页
};

// 状态过滤事件
const handleFilter = () => {
  currentPage.value = 1; // 过滤后重置为第一页
};

// 排序事件
const handleSortChange = (sort) => {
  sortProp.value = sort.prop; // 更新排序字段
  sortOrder.value = sort.order; // 更新排序方向
  currentPage.value = 1; // 排序后重置为第一页
};

// 每页条数改变事件
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 切换每页条数后重置为第一页
};

// 页码改变事件
const handleCurrentChange = (val) => {
  currentPage.value = val;
};
</script>

<style scoped>
.pagination {
  padding-right: 20px;
}
.search-bar {
  padding-left: 20px;
}
</style>
