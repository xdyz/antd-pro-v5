declare namespace PackerNode {
  type CreateNodeParams = {
    id?: number,
    name: string,
    max_execution_count: number,
  }

  type EditNodeParams = {
    id: number,
    executions: any,
    name: string,
    max_execution_count: number,
  }

  type NodesParams = {
    id: number,
    name: string,
    max_execution_count: number,
    executions: Login.MachineExecutions[]
  }
}