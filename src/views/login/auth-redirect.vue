<!--作用是处理 OAuth / 第三方登录后的回调逻辑 —— 从 URL 参数中提取授权码并存储到本地，然后关闭当前窗口-->
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthRedirect',
  created() {
    // 步骤1：提取 URL 中 ? 后的参数（授权码/回调参数）
    const hash = window.location.search.slice(1);
    // 步骤2：判断 localStorage 是否可用（兼容低版本浏览器）
    if (window.localStorage) {
      // 步骤3：将参数存储到 localStorage，key 为 x-admin-oauth-code
      window.localStorage.setItem('x-admin-oauth-code', hash);
      // 步骤4：关闭当前窗口（授权回调窗口）
      window.close();
    }
  },
  // render 是 Vue 组件的渲染函数，替代 <template> 模板，直接用 JS 生成 DOM；
  render: function(h) {
    return h(); // avoid warning message
  }
});
</script>
