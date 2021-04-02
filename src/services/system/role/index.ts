import { request } from 'umi'


// 获取分页角色
export async function getAll(params?: SystemRoles.GetAllRolesType) {
  return request('/roles', {
    params,
  })
}

// 增加角色
export async function addRoles(data: SystemRoles.RoleDataType) {
  return request('/roles', {
    method: 'post',
    data,
  })
}

// 编辑角色
export async function editRoles(data: SystemRoles.RoleDataType, role_name?: string) {
  return request(`/roles/${role_name}`, {
    method: 'put',
    data,
  })
}


// 删除角色
export async function delRoles(role_name?: string) {
  return request(`/roles/${role_name}`, {
    method: 'delete',
  })
}


// 获取单个角色信息
export async function getOneRole(role_name: string) {
  return request(`/roles/${role_name}`)
}