import type { Settings as LayoutSettings } from '@ant-design/pro-layout'
import { PageLoading } from '@ant-design/pro-layout'
import type { RequestConfig, RunTimeLayoutConfig } from 'umi'
import { history } from 'umi'
import RightContent from '@/components/RightContent'
import { getUserInfo } from '@/services/login/index'
import { authHeaderInterceptor, errorHandler } from '@/utils/request'
import Icon from '@/assets/images/Icon.png'
import Avatar from '@/assets/images/avatar.png'
import defaultSettings from '../config/defaultSettings'
import Cookies from 'js-cookie'

const loginPath = '/user/login'

export type CurrentViewInfoParams = {
  id?: number
  page?: number
}

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>
  currentUser?: Login.CurrentUser
  fetchUserInfo?: () => Promise<Login.CurrentUser | undefined>
}> {
  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    if (res?.data) {
      return { avatar: Avatar, ...(res?.data ?? {}) }
    }
    history.push(loginPath)

    return undefined
  }

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo()
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings
    }
  }
  return {
    fetchUserInfo,
    settings: defaultSettings
  }
}



// const dispatch = useDispatch()
// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: Icon,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    // footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath)
      }
    },
    ...initialState?.settings,
    menuHeaderRender: undefined,
    childrenRender: (children) => {
      return (
        <>
          {children}
        </>
      )
    }
  }
}

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  prefix: '/api/v1',
  requestInterceptors: [authHeaderInterceptor],
  errorHandler
}

const loginPath1: string[] = ['/user', '/user/login']
export function render(oldRender: () => void) {
  const token = Cookies.get('Authorization')
  // 没有token
  if (!token) {
    history.replace(loginPath)
    oldRender()
    return
  }
  if (loginPath1.includes(window.location.pathname)) {
    history.replace('/welcome')
    oldRender()
  }
  oldRender()
}
