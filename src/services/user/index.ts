import { request } from 'umi';

export const getUserInfo = () => {
  return request<User.CurrentUser>('/user/info')
}