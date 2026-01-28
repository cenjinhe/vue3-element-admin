import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/cjh/user/api/login/',
    method: 'post',
    data
  });
}

export function register(data) {
  return request({
    url: '/cjh/user/api/register/',
    method: 'post',
    data
  });
}

export function logout(token) {
  return request({
    url: '/cjh/user/api/logout/',
    method: 'post',
    params: { token }
  });
}

export function getInfo(token) {
  return request({
    url: '/cjh/user/api/get_user_info/',
    method: 'get',
    params: { token }
  });
}
