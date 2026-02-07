import request from '@/utils/request'
import type { UserListParams,
              UserListResponse,
              UserInfo,
              UserForm,
              BatchDeleteParams
            } from '@/types/system'

/**
 * 用户管理接口
 */
export const userApi_bak = {
    /** 获取用户列表 */
    getUserList: (params: UserListParams) => {
        return request<UserListResponse>({
            url: '/api/users/',
            method: 'get',
            params
        })
    },

    /** 获取单个用户详情 */
    getUserDetail: (id: number) => {
        return request<UserInfo>({
            url: `/api/users/${id}/`,
            method: 'get'
        })
    },

    /** 新增用户 */
    addUser: (data: UserForm) => {
        return request<{ msg: string }>({
            url: '/api/users/',
            method: 'post',
            data
        })
    },

    /** 编辑用户 */
    editUser: (id: number, data: UserForm) => {
        return request<{ msg: string }>({
            url: `/api/users/${id}/`,
            method: 'put',
            data
        })
    },

    /** 删除单个用户 */
    deleteUser: (id: number) => {
        return request<{ msg: string }>({
            url: `/api/users/${id}/`,
            method: 'delete'
        })
    },

    /** 批量删除用户 */
    batchDeleteUser: (data: BatchDeleteParams) => {
        return request<{ msg: string }>({
            url: '/api/users/batch_delete/',
            method: 'post',
            data
        })
    }
}


/**
 * 用户管理接口（前端模拟假数据版）
 */
export const userApi = {
  /** 获取用户列表（模拟假数据） */
//   getUserList: (params: UserListParams) => {
//     // 模拟异步请求（延迟500ms，模拟网络请求）
//     return new Promise<UserListResponse>((resolve) => {
//       setTimeout(() => {
//         // 生成模拟的用户列表数据
//         const mockUserList: UserInfo[] = [
//           {
//             id: 1,
//             username: 'admin',
//             email: 'admin@example.com',
//             phone: '13800138000',
//             role: 'admin',
//             role_name: '超级管理员',
//             create_time: '2026-02-01 10:00:00',
//             update_time: '2026-02-01 10:00:00'
//           },
//           {
//             id: 2,
//             username: 'editor01',
//             email: 'editor01@example.com',
//             phone: '13800138001',
//             role: 'editor',
//             role_name: '编辑',
//             create_time: '2026-02-02 10:00:00',
//             update_time: '2026-02-02 10:00:00'
//           },
//           {
//             id: 3,
//             username: 'viewer01',
//             email: 'viewer01@example.com',
//             phone: '13800138002',
//             role: 'viewer',
//             role_name: '查看者',
//             create_time: '2026-02-03 10:00:00',
//             update_time: '2026-02-03 10:00:00'
//           },
//           {
//             id: 4,
//             username: 'viewer02',
//             email: 'viewer02@example.com',
//             phone: '13800138003',
//             role: 'viewer',
//             role_name: '查看者',
//             create_time: '2026-02-04 10:00:00',
//             update_time: '2026-02-04 10:00:00'
//           }
//         ]

//         // 模拟分页逻辑（根据传入的page/size筛选数据）
//         const page = params.page || 1
//         const size = params.size || 10
//         const startIndex = (page - 1) * size
//         const endIndex = startIndex + size
//         const paginatedList = mockUserList.slice(startIndex, endIndex)

//         // 模拟筛选逻辑（根据username/role/phone筛选）
//         let filteredList = [...mockUserList]
//         if (params.username) {
//           filteredList = filteredList.filter(item => 
//             item.username.includes(params.username!)
//           )
//         }
//         if (params.role) {
//           filteredList = filteredList.filter(item => 
//             item.role === params.role
//           )
//         }
//         if (params.phone) {
//           filteredList = filteredList.filter(item => 
//             item.phone?.includes(params.phone!)
//           )
//         }

//         // 最终分页后的筛选数据
//         const finalList = filteredList.slice(startIndex, endIndex)

//         // 返回符合UserListResponse类型的模拟数据
//         resolve({
//           count: filteredList.length, // 总条数（筛选后）
//           next: null, // 无下一页（模拟）
//           previous: null, // 无上一页（模拟）
//           results: finalList
//         })
//       }, 500) // 延迟500ms，模拟网络请求
//     })
//   },
    /** 获取用户列表 */
    getUserList: (params: UserListParams) => {
        return request<UserListResponse>({
            url: '/cjh/user/api/users/',
            method: 'get',
            params
        })
    },

  /** 获取单个用户详情（模拟） */
  getUserDetail: (id: number) => {
    return new Promise<UserInfo>((resolve) => {
      setTimeout(() => {
        const mockUser: UserInfo = {
          id,
          username: `user${id}`,
          email: `user${id}@example.com`,
          phone: `1380013800${id}`,
          role: id === 1 ? 'admin' : id === 2 ? 'editor' : 'viewer',
          role_name: id === 1 ? '超级管理员' : id === 2 ? '编辑' : '查看者',
          create_time: '2026-02-07 10:00:00',
          update_time: '2026-02-07 10:00:00'
        }
        resolve(mockUser)
      }, 300)
    })
  },

  /** 新增用户（模拟） */
  addUser: (data: UserForm) => {
    return new Promise<{ msg: string }>((resolve) => {
      setTimeout(() => {
        resolve({ msg: '新增用户成功' })
      }, 300)
    })
  },

  /** 编辑用户（模拟） */
  editUser: (id: number, data: UserForm) => {
    return new Promise<{ msg: string }>((resolve) => {
      setTimeout(() => {
        resolve({ msg: '编辑用户成功' })
      }, 300)
    })
  },

  /** 删除单个用户（模拟） */
  deleteUser: (id: number) => {
    return new Promise<{ msg: string }>((resolve) => {
      setTimeout(() => {
        resolve({ msg: '删除用户成功' })
      }, 300)
    })
  },

  /** 批量删除用户（模拟） */
  batchDeleteUser: (data: BatchDeleteParams) => {
    return new Promise<{ msg: string }>((resolve) => {
      setTimeout(() => {
        resolve({ msg: `成功删除${data.ids.length}个用户` })
      }, 300)
    })
  }
}