import { request } from 'umi'


// 获取分页用户
export async function getUsers(params?: SystemUsers.UsersParamsType) {
  return request('/users', {
    params,
  })
}

// 编辑用户
export async function editUser(user_id: number, params: SystemUsers.EditFormColumn) {
  return request(`/users/${user_id}`, {
    method: 'PUT',
    data: params,
  })
}

// 新增用户

export async function createUser(params: SystemUsers.CreateFormColumn) {
  return request('/users', {
    method: 'POST',
    data: params,
  })
}

// 删除用户

export async function delUser(user_id: number) {
  return request(`/users/${user_id}`, {
    method: 'DELETE'
  })
}
