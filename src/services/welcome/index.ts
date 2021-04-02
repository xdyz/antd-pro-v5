import { request } from 'umi'

export const getHomePage = () => {
  return request('/home_page')
}

