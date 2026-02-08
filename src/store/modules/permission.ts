import { defineStore } from 'pinia';
import { asyncRoutes, constantRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';

interface IPermissionState {
  routes: Array<RouteRecordRaw>;
  addRoutes: Array<RouteRecordRaw>;
}

/**
 * 使用meta.role来判断当前用户是否拥有权限
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles:string[], route:RouteRecordRaw):boolean {
  // 如果路由有meta和meta.roles属性，则判断用户角色是否在其中
  if (route.meta && route.meta.roles) {
    // 将meta.roles转换为字符串数组
    const rolesArr = route.meta.roles as string[];
    // 判断用户角色是否在meta.roles中
    return roles.some(role => rolesArr.includes(role));
  } else {
    // 如果路由没有meta.roles属性，则默认允许访问
    return true;
  }
}

/**
 * 通过递归过滤异步路由表
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes:RouteRecordRaw[], roles: string[]): Array<RouteRecordRaw> {
  const res:Array<RouteRecordRaw> = [];

  // 遍历路由表，判断每个路由是否有访问权限
  routes.forEach(route => {
    // 复制路由对象，避免修改原始路由表
    const tmp = { ...route };
    // 如果用户有访问权限，则将路由添加到结果数组中
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        // 递归过滤子路由
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      // 将符合条件的路由添加到结果数组中
      res.push(tmp);
    }
  });

  return res;
}

export default defineStore({
  id: 'permission',
  state: ():IPermissionState => ({
    routes: [],
    addRoutes: []
  }),
  getters: {},
  actions: {
    // 设置可访问的路由
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    // 生成可访问的路由
    generateRoutes(roles: string[]) {
      console.log('用户角色:', roles);
      let accessedRoutes;
      // 如果用户角色包含admin，则直接使用所有异步路由，否则过滤出有访问权限的路由
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        // 过滤出有访问权限的路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      // 设置可访问的路由
      this.setRoutes(accessedRoutes);
      // 返回可访问的路由
      return accessedRoutes;
    }
  }
});
