declare namespace TaskPipelineViews {
  type CreateViewParams = {
    name: string,
    display_name: string,
    tags: string[],
    icon: string
  }

  type EditViewParams = {
    id?: number | null,
    name: string,
    display_name: string,
    executing_build_count?: number
    tags: string[],
    icon: string
  }
}