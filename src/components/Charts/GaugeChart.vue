<template>
  <!-- 仪表图容器：必须设置宽高 -->
  <div class="gauge-chart" :style="{ width, height }" ref="chartRef"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts"; // 引入 ECharts 核心

// 1. 接收父组件传递的 props（可根据需求扩展）
const props = defineProps({
  // 核心数值（如完成率、体温）
  value: {
    type: Number,
    required: true,
    default: 0,
  },
  // 指标名称（如“完成率”“CPU使用率”）
  indicatorName: {
    type: String,
    default: "",
  },
  // 数值范围（min-max）
  range: {
    type: Array,
    default: () => [0, 100], // 默认 0-100
  },
  // 表盘的位置
  center: {
    type: Array,
    default: () => ["50%", "60%"], // 居中
  },
  // 表盘分段颜色（支持3段：低-中-高）
  colors: {
    type: Array,
    default: () => ["#67C23A", "#FF9F43", "#F56C6C"], // 绿-橙-红
  },
  offsetCenter: {
    type: Array,
    default: () => [0, "60%"], // 相对于中心的偏移（向下60%）
  },
  // 指针是否显示
  pointerShow: {
    type: Boolean,
    default: false,
  },
  // 刻度分割数
  splitNumber: {
    type: Number,
    default: 10,
  },
  // 刻度文字（axisLabel）是否显示
  showAxisLabele: {
    type: Boolean,
    default: true,
  },
  // 小刻度（axisTick）是否显示
  showAxisTick: {
    type: Boolean,
    default: false,
  },
  // 大刻度/分隔线（splitLine）是否显示
  showSplitLine: {
    type: Boolean,
    default: false,
  },
  // 进度条
  progress: {
    type: Object,
    default: () => ({
      show: false, // 是否显示进度
      width: 30,
    }),
  },
  // 组件宽高（支持像素/百分比）
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "300px",
  },
});

// 2. 核心变量：ECharts 实例 + DOM 容器
const chartRef = ref(null); // 绑定 DOM 容器
let chartInstance = null; // 存储 ECharts 实例

// 3. 初始化 ECharts 实例
const initChart = () => {
  // 避免重复初始化
  if (chartInstance) return;

  // 1. 获取 DOM 容器并创建实例
  chartInstance = echarts.init(chartRef.value);

  // 2. 设置 ECharts 配置（核心：仪表图参数）
  const option = getChartOption();

  // 3. 渲染图表
  chartInstance.setOption(option);

  // 4. 监听窗口 resize，自动适配
  window.addEventListener("resize", handleResize);
};

// 4. 生成 ECharts 配置项（复用前文仪表图参数逻辑）
const getChartOption = () => {
  const [min, max] = props.range;
  const [colorLow, colorMid, colorHigh] = props.colors;

  return {
    // 可选：图表标题（如需显示在组件外，可移到 props 控制）
    title: {
      text: `${props.indicatorName}`,
      left: "center",
      top: 10,
      textStyle: { fontSize: 16 },
    },
    series: [
      {
        type: "gauge", // 声明为仪表图
        center: props.center,
        min, // 数值最小值
        max, // 数值最大值
        splitNumber: props.splitNumber,
        startAngle: 180, // 表盘起始角度（180° 为下半圆，225° 为更常见的“扇形”）
        endAngle: 0,
        pointer: {
          show: props.pointerShow, // 是否显示指针
          length: "80%", // 指针长度（相对表盘半径）
          width: 8, // 指针宽度
        },
        progress: props.progress,
        temStyle: {
          color: "#FFAB91",
        },
        // 表盘样式：分段配色（按比例划分）
        axisLine: {
          lineStyle: {
            width: 30, // 表盘厚度
            // color: [
            //   [0.3, colorLow], // 0-30%：低色
            //   [0.7, colorMid], // 30%-70%：中色
            //   [1, colorHigh], // 70%-100%：高色
            // ],
          },
        },
        axisTick: {
          show: props.showAxisTick,
          distance: -45,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: "#999",
          },
        },
        splitLine: {
          show: props.showSplitLine,
          distance: 0,
          length: 14,
          lineStyle: {
            width: 3,
            color: "#999",
          },
        },
        axisLabel: {
          show: props.showAxisLabele,
          distance: 0,
          color: "#999",
          fontSize: 20,
        },
        // 中心文字（显示“指标名+数值”）
        detail: {
          formatter: `{value}`, // 可自定义格式（如 '{value}%'）
          fontSize: 24,
          offsetCenter: props.offsetCenter, // 相对于中心的偏移（向下60%）
        },
        // 核心数据（由 props.value 驱动）
        data: [{ name: props.indicatorName, value: props.value }],
      },
    ],
  };
};

// 5. 监听 props 变化，更新图表（如数值变化时指针动）
watch(
  [() => props.value, () => props.range, () => props.colors],
  () => {
    if (chartInstance) {
      // 增量更新配置（只更新变化的部分，性能更优）
      chartInstance.setOption(getChartOption());
    }
  },
  { deep: true } // 监听数组/对象内部变化
);

// 6. 窗口 resize 时适配图表
const handleResize = () => {
  chartInstance?.resize();
};

// 7. 生命周期钩子：初始化 + 销毁
onMounted(() => {
  // 确保 DOM 渲染完成后再初始化
  initChart();
});

onUnmounted(() => {
  // 销毁实例 + 移除监听，避免内存泄漏
  chartInstance?.dispose();
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.gauge-chart {
  /* 避免容器晃动，可加默认样式 */
  margin: 0 auto;
}
</style>
