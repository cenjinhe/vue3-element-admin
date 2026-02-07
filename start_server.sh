#!/bin/zsh


# ===================== 验证基础依赖 ===================
# 检查node是否可用
check_node() {
    if ! command -v node &> /dev/null; then
        echo "未找到node, 请先安装node"
        exit 0
    fi
}

# ===================== 安装依赖（若不存在） =============
install_node_modules() {
    if [ ! -d "${NODE_MODULES_DIR}" ]; then
        echo "🔧 node_modules目录不存在, 正在安装: npm install"
        npm install || echo "安装失败"
        echo "✅ npm install 安装成功"
    else
        echo "ℹ️  node_modules目录已存在"
    fi
}

# ===================== 编译vue项目 ============================
build_vue_project() {
    echo "🔧 正在编译vue项目: npm run build"
    npm run build:test &> /dev/null || { echo "编译失败"; exit 0; }
    echo "✅ vue项目编译成功"

    echo "🔧 正在移动dist到$WEB_ROOT"
    mkdir -p "$WEB_ROOT" || { echo "创建WEB_ROOT目录失败"; exit 0; }
    rm -rf "$WEB_ROOT/dist" || { echo "清理旧dist目录失败"; exit 0; }
    mv "$SCRIPT_DIR/dist" "$WEB_ROOT/" || { echo "移动dist目录失败"; exit 0; }
}

# ===================== 启动服务 ===============================
dev_vue_project() {
    echo "🚀 正在启动服务: http://${RUN_HOST}:${RUN_PORT}/"
    npm run dev:test
}

# ===================== 安装nginx（若不存在） =============
install_nginx() {
    if ! command -v nginx &> /dev/null; then
        echo "🔧 nginx未找到, 正在安装nginx"
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux系统
            if [ -x "$(command -v apt-get)" ]; then
                sudo apt-get update && sudo apt-get install -y nginx
            elif [ -x "$(command -v yum)" ]; then
                sudo yum install -y nginx
            else
                echo "不支持的Linux发行版, 请手动安装nginx"
                exit 0
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS系统
            if ! command -v brew &> /dev/null; then
                echo "Homebrew未找到, 请先安装Homebrew: https://brew.sh/"
                exit 0
            fi
            brew install nginx
        else
            echo "不支持的操作系统, 请手动安装nginx"
            exit 0
        fi
    fi
}

# ===================== 重启nginx（带上config参数） =============
startup_nginx() {
    NGINX_CONFIG_PATH="$SCRIPT_DIR/nginx.conf"
    echo "🔧 正在nginx服务"
    # 第一步：停止现有 Nginx 进程
    if pgrep -x "nginx" > /dev/null; then
        echo "🔧 停止nginx服务"
        nginx -s stop -c "$NGINX_CONFIG_PATH" 2>/dev/null
        pkill -9 nginx >/dev/null 2>&1
        echo "✅ Nginx 已停止"
    fi

    # 第二步：检查端口是否被占用
    if lsof -i :"$LISTEN_PORT" > /dev/null; then
        echo "❌ 端口 $LISTEN_PORT 被占用，正在强制释放..."
        # 杀死占用端口的进程
        lsof -t -i :"$LISTEN_PORT" | xargs kill -9 >/dev/null 2>&1
        if lsof -i :"$LISTEN_PORT" > /dev/null; then
            echo "❌ 端口 $LISTEN_PORT 释放失败，请手动处理"
            exit 1
        else
            echo "✅ 端口 $LISTEN_PORT 已释放"
        fi
    fi

    # 第三步：启动 nginx 服务
    nginx -c "$NGINX_CONFIG_PATH" || { echo "启动nginx失败"; exit 0; }
    echo "✅ nginx启动成功"
    echo "🚀 访问服务: http://${RUN_HOST}:$LISTEN_PORT/#/login"
}

# ===================== 基础配置 =============================
SCRIPT_DIR=$(cd "$(dirname "${0}")" && pwd)
NODE_MODULES_DIR="$SCRIPT_DIR/node_modules"
WEB_ROOT="/opt/homebrew/var/www/vue3-element-admin"
RUN_HOST="127.0.0.1"
RUN_PORT="8001"
LISTEN_PORT="9200"  # Nginx 配置的监听端口

# ===================== 主流程 ===============================
# 开发模式连接测试服务器
check_node
install_node_modules
dev_vue_project

# 打包到测试服务器
# check_node
# install_node_modules
# build_vue_project
# install_nginx
# startup_nginx