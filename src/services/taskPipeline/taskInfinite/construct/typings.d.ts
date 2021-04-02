declare namespace TaskPipelineConstruct {
  type FormInfo = {
    parameters: Record<string, any>
  }

  type GetMoreBuildListParams = {
    type: string,
    page?: number,
    per_page?: number,
    build_id?: number
  }

  type BuildFormUI = {
    refresh: boolean
  }


  type BlockListParams = {
    name: string,
    type: string,
    columns: string[],
    items: Record<string, any>[]
  }


  type TaskInfo = {
    id: number,
    number: number,
    task_id: number,
    status: number,
    parameters: Record<string, any>
  }

  type UrlParams = {
    task_id: string,
    build_id: string
  }
}