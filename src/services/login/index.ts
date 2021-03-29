import { request } from 'umi';

export const login = (data: Login.Login) => {
  return request('/auth/login', {
    method: 'POST',
    data
  })
}