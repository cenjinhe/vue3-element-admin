import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  });
}

export function logout(token) {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post',
    params: { token }
  });
}


// // 登录接口
// export function login(data) {
//   return request({
//     url: '/api/user/login',  // 后端登录接口地址
//     method: 'post',
//     data
//   })
// }

//
// // 注册接口
// export function register(data) {
//   return request({
//     url: '/api/user/register',  // 后端注册接口地址
//     method: 'post',
//     data
//   })
// }
//
// // 获取用户信息（登录后验证）
// export function getUserInfo() {
//   return request({
//     url: '/api/user/info',
//     method: 'get'
//   })
// }
//
// // 退出登录
// export function logout() {
//   return request({
//     url: '/api/user/logout',
//     method: 'post'
//   })
// }