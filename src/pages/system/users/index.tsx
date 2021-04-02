import type { MutableRefObject } from 'react'
import React, { useRef, useState, useEffect } from 'react'
import { Button, Popconfirm, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { getUsers, delUser } from '@/services/system/users'
import { getAll } from '@/services/system/role'

import { notifyInfoTip } from '@/utils/utils'
import styles from './index.less'

import CreateForm from './components/CreateForm'

const { Option } = Select

/**
 *  去除getUsersList 方法中 rest 输入型参数为空字符串导致搜索有问题
 * @param rest Protable 中 requst 方法传递回来的params
 */
const filterRest = (rest: SystemUsers.RestItemType) => {
  const restObj: SystemUsers.RestItemType = {}
  Object.keys(rest).forEach((item: string) => {
    if (rest[item] !== '') {
      restObj[item] = rest[item]
    }
  })
  return restObj
}
const getUsersList = async (params: SystemUsers.GetUsersParamsType) => {
  const { current, pageSize, ...rest } = params
  const filterRestObj = filterRest(rest)
  const res = await getUsers(
    {
      page: current,
      size: pageSize,
      ...filterRestObj,
    }
  )
  const result = {
    data: [],
    total: 0,
  }
  if (res?.code === 0) {
    const { list, total } = res.data
    Object.assign(result, {
      data: list,
      total,
      success: true,
    })
  }
  return result
}

// 删除
const currentDelUser = async (id: number, actionRef: MutableRefObject<ActionType | undefined>) => {
  const res = await delUser(id)
  if (!res?.error) {
    notifyInfoTip('用户', '删除', true)
    actionRef.current?.reload()
  } else {
    notifyInfoTip('用户', '删除', false, res.message)
  }
}
// 获取角色
const getAllRoles = async (setRoleArrData: (data: SystemUsers.RoleDataType[]) => void) => {
  const res = await getAll()
  if (res?.data) {
    setRoleArrData(res?.data ?? [])
  }
}

const Users: React.FC<Record<string, never>> = () => {
  const staticForm = {
    username: '',
    nickname: '',
    password: '',
    email: '',
    roles: null,
  }
  const actionRef = useRef<ActionType>()
  const [modalVisiable, setmodalVisiable] = useState<boolean>(false)
  const [modalTitleState, setmodalmodalTitleState] = useState<boolean>(true)
  const [roleArrData, setRoleArrData] = useState<SystemUsers.RoleDataType[]>([])
  const [formInfo, setformInfo] = useState<SystemUsers.EditFormColumn>(staticForm)

  useEffect(() => {
    getAllRoles(setRoleArrData)
  }, [])

  const columns: ProColumns<SystemUsers.EditFormColumn>[] = [
    {
      title: '账号名称',
      dataIndex: 'username',
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInTable: true,
      search: false,
    },
    {
      title: '用户名称',
      dataIndex: 'nickname',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      ellipsis: true,
      renderFormItem: () => {
        return (
          <Select placeholder="请选择">
            {roleArrData &&
              roleArrData.map((item) => (
                <Option key={item.id} value={item.name}>
                  {item.name}
                </Option>
              ))}
          </Select>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime'
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      fixed: 'right',
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              size="small"
              key="editButton"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                setmodalVisiable(true)
                setformInfo(row)
                setmodalmodalTitleState(false)
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              key={row.id}
              title={
                <div>
                  是否<span className={styles.delColor}>&nbsp;删除&nbsp;</span>用户{' '}
                  <span className={styles.delColor}>{row.nickname}</span> ?
                </div>
              }
              onConfirm={() => currentDelUser(row.id as number, actionRef)}
            >
              <Button type="link" key="deleteButton" size="small">
                删除
              </Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]

  return (
    <div className={styles.editWrapper}>
      <PageContainer>
        <ProTable<SystemUsers.EditFormColumn>
          actionRef={actionRef}
          rowKey="id"
          pagination={{
            pageSize: 10
          }}
          columns={columns}
          toolBarRender={() => [
            <Button
              key="createButton"
              type="primary"
              onClick={() => {
                setmodalmodalTitleState(true)
                setmodalVisiable(true)
              }}
            >
              <PlusOutlined /> 新建
            </Button>
          ]}
          request={async (params) => getUsersList(params)}
        />

        <CreateForm
          modalTitleState={modalTitleState}
          modalVisiable={modalVisiable}
          formInfo={formInfo}
          roleArrData={roleArrData}
          onCancel={() => {
            setformInfo(staticForm)
            setmodalVisiable(false)
            actionRef.current?.reload()
          }}
        />
      </PageContainer>
    </div>
  )
}

export default Users
