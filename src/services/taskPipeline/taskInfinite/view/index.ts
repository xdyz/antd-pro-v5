import {request} from 'umi'


// 获取所有视图
export const getAllViews = () => {
  return request('/views', {
    method: 'get'
  })
}

// 获取具体视图信息
export const getViewInfo = (id: number) => {
  return request(`/views/${id}`, {
    method: 'get'
  })
}

// 创建视图
export const createView = (data: TaskPipelineViews.CreateViewParams) => {
  return request('/views', {
    method: 'post',
    data
  })
}

// 编辑视图

export const editView = (data: TaskPipelineViews.EditViewParams) => {
  return request(`/views/${data.id}`, {
    method: 'put',
    data
  })
}

// 删除视图

export const deleteView = (id?: number) => {
  return request(`/views/${id}`, {
    method: 'delete'
  })
}

// 上传图片接口
export const uploadIcon = (data: FormData) => {
  return request('/views/icons', {
    method: 'post',
    data
  })
}