const Layout = () => import('@/layout/index.vue');


const systemRouter = {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
        title: '系统管理',
        icon: 'user',
        alwaysShow: true, // will always show the root menu
        roles: ['admin'] // 仅admin角色可见
    },
    children: [
        {
            path: 'user',
            name: 'UserManagement',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
                title: '用户管理',
                roles: ['admin'], // 仅admin可访问
                permissions: ['system:user:list', 'system:user:add', 'system:user:edit', 'system:user:delete']
            }
        }
    ]
}
export default systemRouter