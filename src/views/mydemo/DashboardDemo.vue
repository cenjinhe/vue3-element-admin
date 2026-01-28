<template>
  <div class="dashboard-container">
    <!-- 功能按钮区 -->
    <div class="button-group">
      <el-button type="primary" @click="handleBtnClick('today')">今日数据</el-button>
      <el-button type="success" @click="handleBtnClick('week')">本周数据</el-button>
      <el-button type="warning" @click="handleBtnClick('month')">本月数据</el-button>
      <el-button type="danger" @click="resetChart">重置图表</el-button>
    </div>

    <!-- 图表展示区 -->
    <div class="chart-container">
      <!-- 饼状图：按类别统计 -->
      <div class="chart-item">
        <h3>类别占比统计</h3>
        <div ref="pieChart" class="chart" style="width: 100%; height: 400px;"></div>
      </div>

      <!-- 柱状图：按时间统计 -->
      <div class="chart-item">
        <h3>月度销量统计</h3>
        <div ref="barChart" class="chart" style="width: 100%; height: 400px;"></div>
      </div>

      <!-- 折线图：趋势统计 -->
      <div class="chart-item">
        <h3>销量趋势统计</h3>
        <div ref="lineChart" class="chart" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

// 图表实例引用
const pieChart = ref(null)
const barChart = ref(null)
const lineChart = ref(null)

// 数据源（按时间维度区分）
const chartData = ref({
  today: {
    pie: [
      { name: '产品A', value: 35 },
      { name: '产品B', value: 25 },
      { name: '产品C', value: 20 },
      { name: '产品D', value: 15 },
      { name: '产品E', value: 5 }
    ],
    bar: [
      { name: '09:00', value: 12 },
      { name: '10:00', value: 18 },
      { name: '11:00', value: 25 },
      { name: '12:00', value: 15 },
      { name: '13:00', value: 8 }
    ],
    line: [
      { name: '09:00', value: 12 },
      { name: '10:00', value: 18 },
      { name: '11:00', value: 25 },
      { name: '12:00', value: 15 },
      { name: '13:00', value: 8 }
    ]
  },
  week: {
    pie: [
      { name: '产品A', value: 40 },
      { name: '产品B', value: 20 },
      { name: '产品C', value: 18 },
      { name: '产品D', value: 12 },
      { name: '产品E', value: 10 }
    ],
    bar: [
      { name: '周一', value: 85 },
      { name: '周二', value: 92 },
      { name: '周三', value: 78 },
      { name: '周四', value: 105 },
      { name: '周五', value: 98 }
    ],
    line: [
      { name: '周一', value: 85 },
      { name: '周二', value: 92 },
      { name: '周三', value: 78 },
      { name: '周四', value: 105 },
      { name: '周五', value: 98 }
    ]
  },
  month: {
    pie: [
      { name: '产品A', value: 38 },
      { name: '产品B', value: 22 },
      { name: '产品C', value: 15 },
      { name: '产品D', value: 15 },
      { name: '产品E', value: 10 }
    ],
    bar: [
      { name: '1日', value: 65 },
      { name: '5日', value: 78 },
      { name: '10日', value: 92 },
      { name: '15日', value: 85 },
      { name: '20日', value: 105 },
      { name: '25日', value: 98 },
      { name: '30日', value: 88 }
    ],
    line: [
      { name: '1日', value: 65 },
      { name: '5日', value: 78 },
      { name: '10日', value: 92 },
      { name: '15日', value: 85 },
      { name: '20日', value: 105 },
      { name: '25日', value: 98 },
      { name: '30日', value: 88 }
    ]
  }
})

// 当前选中的时间维度
const activeTime = ref('today')
// 当前选中的产品类别（用于图表联动）
const activeCategory = ref('all')

// 初始化饼状图
const initPieChart = () => {
  const pieInstance = echarts.init(pieChart.value)
  const data = chartData.value[activeTime.value].pie
  // 过滤选中类别的数据（联动逻辑）
  const filterData = activeCategory.value === 'all' 
    ? data 
    : data.filter(item => item.name === activeCategory.value)
  
  const option = {
    tooltip: { trigger: 'item' },
    legend: {
      top: '0%',
      left: 'center'
    },
    series: [
      {
        name: '类别占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: filterData
      }
    ]
  }
  pieInstance.setOption(option)

  // 监听饼图点击事件，实现联动
  pieInstance.on('click', (params) => {
    activeCategory.value = params.name
    ElMessage.success(`已选中：${params.name}`)
  })

  // 自适应窗口大小
  window.addEventListener('resize', () => pieInstance.resize())
}

// 初始化柱状图
const initBarChart = () => {
  const barInstance = echarts.init(barChart.value)
  const data = chartData.value[activeTime.value].bar
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{ type: 'category', data: data.map(item => item.name) }],
    yAxis: [{ type: 'value' }],
    series: [
      {
        name: '销量',
        type: 'bar',
        data: data.map(item => item.value)
      }
    ]
  }
  barInstance.setOption(option)
  window.addEventListener('resize', () => barInstance.resize())
}

// 初始化折线图
const initLineChart = () => {
  const lineInstance = echarts.init(lineChart.value)
  const data = chartData.value[activeTime.value].line
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: [{ type: 'category', boundaryGap: false, data: data.map(item => item.name) }],
    yAxis: [{ type: 'value' }],
    series: [
      {
        name: '销量趋势',
        type: 'line',
        stack: 'Total',
        data: data.map(item => item.value)
      }
    ]
  }
  lineInstance.setOption(option)
  window.addEventListener('resize', () => lineInstance.resize())
}

// 初始化所有图表
const initAllCharts = () => {
  initPieChart()
  initBarChart()
  initLineChart()
}

// 按钮点击事件：切换时间维度
const handleBtnClick = (type) => {
  activeTime.value = type
  activeCategory.value = 'all' // 切换时间维度时重置类别筛选
  ElMessage.info(`已切换至${type === 'today' ? '今日' : type === 'week' ? '本周' : '本月'}数据`)
}

// 重置图表
const resetChart = () => {
  activeTime.value = 'today'
  activeCategory.value = 'all'
  ElMessage.success('图表已重置为初始状态')
}

// 监听时间维度/选中类别变化，重新渲染图表
watch([activeTime, activeCategory], () => {
  initAllCharts()
}, { immediate: false })

// 页面挂载时初始化图表
onMounted(() => {
  initAllCharts()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.button-group {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 20px;
}

.chart-item {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-item h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}
</style>
