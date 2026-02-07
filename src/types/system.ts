/** 用户角色类型 */
export type UserRole = 'admin' | 'editor' | 'viewer'

/** 用户信息类型 */
export interface UserInfo {
    id: number
    username: string
    email: string | null
    phone: string | null
    role: UserRole
    role_name: string
    create_time: string
    update_time: string
}

/** 用户列表请求参数 */
export interface UserListParams {
    page: number
    size: number
    username?: string
    role?: UserRole
    phone?: string
}

/** 用户列表响应类型 */
export interface UserListResponse {
    count: number
    next: string | null
    previous: string | null
    results: UserInfo[]
}

/** 新增/编辑用户表单类型 */
export interface UserForm {
    id?: number
    username: string
    password: string
    email: string
    phone: string
    role: UserRole
}

/** 批量删除请求参数 */
export interface BatchDeleteParams {
    ids: number[]
}
