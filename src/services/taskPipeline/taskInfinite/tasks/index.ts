import {request} from 'umi'


// 获取任务详情
export const getTaskInfo = (id: number) => {
  return request(`/tasks/${id}`)
}

// 新增任务
export const createTask = (data: TaskPipelineTasks.CreateTasksParams) => {
  return request('/tasks', {
    method: 'post',
    data
  })
}


// 配置任务
export const editTask = (data: TaskPipelineTasks.EditTasksParams) => {
  return request(`/tasks/${data.id}`, {
    method: 'put',
    data
  })
}


// 删除任务
export const deleteTask = (id?: number) => {
  return request(`/tasks/${id}`, {
    method: 'delete'
  })
}


// 获取任务构建参数
export const getTaskBuildParams = (id: number) => {
  return request(`/tasks/${id}/parameters`)
}

// 获取多个任务
/**
 * 
 * @param view_id 视图id
 */
export const getPageTasks = (view_id: number, params: TaskPipelineTasks.GetPageTasksParams) => {
  return request(`/views/${view_id}/tasks`, {
    params
  })
}

// 获取多个任务订阅者
export const getAllTaskSubscribers = (task_id: number) => {
  return request(`/tasks/${task_id}/subscribers`)
}

/**
 * 新增订阅者
 * @param {number} task_id 任务id
 * @returns 
 */
export const createTaskSubscribers = (task_id?: number) => {
  return request(`/tasks/${task_id}/subscriber`, {
    method: 'post'
  })
}

/**
 * 取消订阅
 * @param task_id 
 * @returns 
 */

export const deleteTaskSubscribers = (task_id?: number) => {
  return request(`/tasks/${task_id}/subscriber`, {
    method: 'delete'
  })
}


export const getPageBlocks = (task_id?: number) => {
  return request(`/tasks/${task_id}/page`)
}
