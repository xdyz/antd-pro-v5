import {request} from 'umi'

export const getMenus = () => {
  return request('/menus')
}

export const createNewMenu = (data: SystemMenus.MenuTreeDataType) => {
  return request('/menus', {
    method: 'post',
    data
  })
}

export const deleteMenu = (id?: number) => {
  return request(`/menus/${id}`, {
    method: 'delete'
  })
}
