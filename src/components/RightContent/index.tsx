import { Tag, Space } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import React from 'react'
import { useModel, SelectLang } from 'umi'
import Avatar from './AvatarDropdown'
import HeaderSearch from '../HeaderSearch'
import styles from './index.less'

export type SiderTheme = 'light' | 'dark'

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
}

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState')

  if (!initialState || !initialState.settings) {
    return null
  }

  const { navTheme, layout } = initialState.settings
  let className = styles.right

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="任务管线"
        options={[
          { label: <span>任务管线</span>, value: '/taskPipeline/infinite' },
          {
            label: <span>用户管理</span>,
            value: '/system/users',
          },
          {
            label: <span>角色</span>,
            value: '/system/roles',
          },
          {
            label: <span>WebHook</span>,
            value: '/system/webhooks',
          },
        ]}
        // onSearch={value => {

        //   history.push({path: value})
        // }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started')
        }}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </Space>
  )
}
export default GlobalHeaderRight
