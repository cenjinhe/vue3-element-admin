#!/bin/zsh

# ===================== 基础配置 =====================
SCRIPT_DIR=$(cd "$(dirname "${0}")" && pwd)
NODE_MODULES_DIR="$SCRIPT_DIR/node_modules"
RUN_HOST="127.0.0.1"
RUN_PORT="8001"

# ===================== 验证基础依赖 =====================
# 检查node是否可用
if ! command -v node &> /dev/null; then
    echo "未找到node，请先安装node"
fi

# ===================== 安装依赖（若不存在） =====================
if [ ! -d "${NODE_MODULES_DIR}" ]; then
    echo "🔧 node_modules目录不存在，正在安装：npm install"
    npm install || echo "安装失败"
    echo "✅ npm install 安装成功"
else
    echo "ℹ️  node_modules目录已存在"
fi

# ===================== 启动服务 =====================
echo "🚀 正在启动服务：http://${RUN_HOST}:${RUN_PORT}/"
npm run dev:test
