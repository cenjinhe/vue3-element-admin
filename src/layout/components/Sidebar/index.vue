<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- 侧边栏 Logo 渲染：仅当 showLogo 为 true 时显示，传递折叠状态 -->
    <logo v-if="showLogo" :collapse="isCollapse" />

    <!-- 滚动容器：解决菜单过多时的滚动问题，wrap-class 是自定义滚动样式类 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- unique-opened 控制是否允许多菜单同时展开 -->
      <!-- :collapse="isCollapse" 控制侧边栏是否折叠（true=折叠，false=展开） -->
      <!-- 指定默认展开的子菜单列表-修改1：添加 :default-openeds="openedMenus" 属性 -->
      <el-menu
        class="left-menu"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        :default-openeds="defaultOpenedMenus"
      >
        <!-- 循环渲染菜单项：基于权限过滤后的路由列表 -->
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-top-route="true"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapState } from "pinia";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
// import variables from '@/styles/variables.modules.scss';
import store from "@/store";

export default defineComponent({
  name: "Sidebar",
  components: {
    SidebarItem,
    Logo,
  },
  data() {
    return {
      variables: {
        menuBg: "#304156",            // 菜单背景色
        menuText: "#fff",             // 菜单默认文字色
        menuActiveText: "#409EFF",    // 菜单激活文字色（Element Plus 主题色）
      },
    };
  },
  computed: {
    ...mapState(store.app, ["sidebar"]),  // 映射 app 模块的 sidebar 状态（控制侧边栏开关）
    ...mapState(store.permission, {
      permission_routes: "routes",        // 映射 permission 模块的 routes（权限过滤后的路由列表）
    }),
    ...mapState(store.settings, {
      secondMenuPopup: "secondMenuPopup", // 映射 settings 模块的二级菜单弹窗配置
    }),
    // 指定默认展开的子菜单列表-修改2：新增 defaultOpenedMenus 计算属性，收集所有有子菜单的路径
    defaultOpenedMenus() {
      // 递归遍历菜单列表，收集所有需要展开的子菜单 index（路径）
      const getMenuKeys = (menus) => {
        let keys = [];
        menus.forEach((menu) => {
          // 只收集有子菜单且未隐藏的菜单路径
          if (menu.children && menu.children.length > 0 && !menu.meta?.hidden) {
            keys.push(menu.path); // 添加当前菜单的 index
            // 递归收集子菜单的路径（支持多级菜单）
            keys = keys.concat(getMenuKeys(menu.children));
          }
        });
        return keys;
      };
      // 基于 permission_routes 生成展开列表
      return getMenuKeys(this.permission_routes);
    },
    // 当前激活的菜单项路径
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    // 是否显示侧边栏 Logo
    showLogo() {
      return store.settings().sidebarLogo;
    },
    // 侧边栏是否折叠
    isCollapse() {
      if (this.secondMenuPopup) {
        return true;
      }
      return !this.sidebar.opened;
    },
  }
});
</script>
