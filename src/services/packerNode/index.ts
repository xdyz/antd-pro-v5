import { request } from 'umi'

export const getAllNodes = () => {
  return request('/nodes')
}

export const createNodes = (data: PackerNode.CreateNodeParams) => {
  return request('/nodes', {
    method: 'post',
    data
  })
}

export const editNodes = (node_id: number, data: PackerNode.EditNodeParams) => {
  return request(`/nodes/${node_id}`, {
    method: 'put',
    data
  })
}
export const deleteNodes = (node_id: number) => {
  return request(`/nodes/${node_id}`, {
    method: 'delete'
  })
}
