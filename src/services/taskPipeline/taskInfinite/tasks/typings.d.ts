declare namespace TaskPipelineTasks {
  type CreateTasksParams = {
    name: string
    display_name: string
    tags: string[]
    script: string
    source_task_id?: number
    override_parameters?: any
  }

  type EditTasksParams = {
    name: string
    display_name: string
    tags: string[]
    script: string
    override_parameters?: any
    source_task_id: number
    id: number
  }

  type GetPageTasksParams = {
    page: number
    per_page: number
  }

  type LastBuildParams = {
    number?: number
    status?: number
    id?: number
    executing_build_count?: number
  }

  type TasksListParams = {
    id: number
    name: string
    display_name: string
    tags: string[]
    executing_build_count: number
    average_duration: number
    last_build: LastBuildParams | null
  }

  type UrlParams = {
    task_id: string
  }

  type TaskInfo = {
    id: number
    name: string
    tags: string[]
    display_name: string
    enabled: boolean
    source_task_id?: number
    override_parameters?: Record<string, any>
    script: string
  }

  type BlockListParams = {
    name: string
    type: string
    unit?: string
    items: Record<string, any>[]
  }

  type ResultData = TaskInfo & {
    page: {
      blocks: BlockListParams[]
    }
  }
}
