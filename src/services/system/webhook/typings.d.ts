declare namespace SystemWebHooks {
  type CreateGitWebHookParams = {
    repo_url: string
  }

  type EditGitWebHookParams = CreateGitWebHookParams & {
    token: string,
    id: number
  }

  type ModalStateParams = {
    webhookVisiable: boolean,
    webhookTitle: boolean
  }
  
  type ModalActionParams = {
    type: string
  }
}