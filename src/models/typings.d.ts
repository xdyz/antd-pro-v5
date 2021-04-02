declare namespace ModelTypes {
  type SocketDataBuildParams = {
    id: number
    number: number
    status: number
    progress_estimate: number
    task_id: number
  }

  type MachinTask = {
    id: number
    name: string
    display_name: string
    executing_build_count: number
  }

  type MachinNode = {
    id: number
    name: string
  }

  type MachineBuilds = {
    id: number
    number: number
    progress_estimate: number
    status: number
  }

  type MachineExecutions = {
    id: number
    stage_name: string
    node: MachinNode
    task: MachinTask
    status: number
    build: MachineBuilds
  }

  type MachineView = {
    display_name: string
    executing_build_count: number
    icon: string
    id: number
    name: string
    tags: string[]
  }

  type SocketDataParams = {
    type: string
    build: SocketDataBuildParams
    execution: MachineExecutions
    task: MachinTask
    view: MachineView
  }

  type GlobalSocketState = {
    curSocket?: WebSocket
    data?: SocketDataParams
  }

  type ConnectState = {
    globalSocket: GlobalSocketState
  }
}
