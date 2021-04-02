import { request } from 'umi'


/**
 * 获取所有的webhooks
 * @returns 
 */
export const getAllGitWebHooks = () => {
  return request('/git_webhooks')
}

/**
 * 获取某个webhook的信息
 * @param [number] id webhooks
 * @returns 
 */
export const getOneGitWebHookInfo = (id: number) => {
  return request(`/git_webhooks/${id}`)
}

/**
 * 新建webhook
 * @param data 
 * @returns 
 */
export const createGitWebHook = (data: SystemWebHooks.CreateGitWebHookParams) => {
  return request('/git_webhooks', {
    method: 'post',
    data
  })
}

/**
 * 编辑webhook
 * @param data 
 * @returns 
 */
export const editGitWebHook = (data: SystemWebHooks.EditGitWebHookParams) => {
  return request(`/git_webhooks/${data.id}`, {
    method: 'put',
    data
  })
}

/**
 * 删除一个webhook
 * @param [number] id 
 * @returns 
 */
export const deleteGitWebhook = (id: number) => {
  return request(`/git_webhooks/${id}`, {
    method: 'delete'
  })
}
