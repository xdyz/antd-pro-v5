import {request} from 'umi'


// 获取构建信息
/**
 * 
 * @param task_id 任务id
 * @param build_id 构建id
 */
export const getBuildInfo = (task_id: number, build_id: number) => {
  return request(`/tasks/${task_id}/builds/${build_id}`)
}

// 获取构建详情各个模块信息
export const getBuildBlocks = (task_id: number, build_id: number) => {
  return request(`/tasks/${task_id}/builds/${build_id}/page`)
}


// 获取多个构建
/**
 * 
 * @param task_id 任务id
 */
export const getAllBuildList = (task_id: number) => {
  return request(`/tasks/${task_id}/builds`)
}


// 构建任务
export const buildTask = (task_id: number, data: TaskPipelineConstruct.FormInfo) => {
  return request(`/tasks/${task_id}/builds`, {
    method: 'post',
    data
  })
}

// 获取构建表单 渲染出来

export const getBuildFormUI = (task_id: number, params?: TaskPipelineConstruct.BuildFormUI) => {
  return request(`/tasks/${task_id}/parameters`, {
    method: 'get',
    params
  })
}



// 获取构建历史列表 more
export const getLoadMoreBuildList = (task_id: number, params: TaskPipelineConstruct.GetMoreBuildListParams) => {
  return request(`/tasks/${task_id}/page`, {
    params
  })
}