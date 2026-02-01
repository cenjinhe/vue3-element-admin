import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

interface IAppState {
  sidebar: {
    opened: boolean;            // 侧边栏是否展开（true=展开，false=折叠）
    withoutAnimation: boolean;  // 侧边栏切换时是否禁用动画
  };
  device: 'desktop' | 'mobile'; // 设备类型，仅允许这两个值
  size: 'large' | 'default' | 'small';  // 应用尺寸，仅允许这三个值
}

export default defineStore({
  id: 'app',
  state: ():IAppState => ({
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: Cookies.get('size') || 'default'
  }),
  getters: {},
  actions: {
    // 侧边栏开关 (注:不是侧边栏的子菜单)
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened;
      this.sidebar.withoutAnimation = false;
      if (this.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
    },
    // 关闭侧边栏（支持禁用动画）
    closeSidebar({ withoutAnimation }) {
      Cookies.set('sidebarStatus', 0);
      this.sidebar.opened = false;
      this.sidebar.withoutAnimation = withoutAnimation;
    },
    // 切换设备
    toggleDevice(device) {
      this.device = device;
    },
    // 设置尺寸
    setSize(size) {
      this.size = size;
      Cookies.set('size', size);
    }
  }
});
