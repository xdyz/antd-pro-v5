declare namespace WelcomeTypes  {
  type ItemsParams = {
    type: string,
    name: string,
    items: Record<string, any>[]
  }
  
  type HomePageBlocksParams = {
    name: string,
    type: string,
    priority: number,
    items: ItemsParams[]
  }
}