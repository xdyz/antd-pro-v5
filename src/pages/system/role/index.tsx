import React, { useState, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { Button, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getAll, delRoles } from '@/services/system/role/index'
import { notifyInfoTip } from '@/utils/utils'
import RoleForm from './components/RoleForm'
import styles from './index.less'



const filterSearchParams = (rest: SystemRoles.GetRolesParamsType) => {
  const info = {}
  Object.keys(rest).forEach((item) => {
    if (rest[item]) {
      info[item] = rest[item]
    }
  })
  return info
}

const getAllRoles = async (params: SystemRoles.GetRolesParamsType) => {
  const { current, pageSize, ...rest } = params
  const restParams = filterSearchParams(rest)
  const res = await getAll({
    page: current,
    per_page: pageSize,
    ...restParams,
  })
  const { data, total } = res
  return {
    total,
    data: data ?? [],
    success: true,
  }
}

const delRole = async (role_name: string | undefined, onCancelModal: () => void) => {
  const res = await delRoles(role_name)
  if (res) {
    notifyInfoTip('角色', '删除', true)
    onCancelModal()
  } else {
    notifyInfoTip('角色', '删除', false, res.message)
  }
}

const Roles: React.FC<Record<string, never>> = () => {
  const defaultFormInfo = {
    id: undefined,
    name: '',
    privileges: [],
    root: false
  }
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalTitleState, setModalTitleState] = useState<boolean>(true)
  const actionRef = useRef<ActionType>()
  const [formInfo, setFormInfo] = useState<SystemRoles.FormInfoParams>(defaultFormInfo)
  const onCancelModal = () => {
    setModalVisible(false)
    setFormInfo(defaultFormInfo)
    actionRef.current?.reload()
  }
  const editRole = (row: SystemRoles.FormInfoParams) => {
    setFormInfo(row)
    setModalTitleState(false)
    setModalVisible(true)
  }

  const columns: ProColumns<SystemRoles.RoleDataType>[] = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      hideInForm: true,
      render: (_, row) => {
        return (
          <>
            <Button
              type="link"
              key="edit"
              size="small"
              style={{ paddingLeft: '0px' }}
              onClick={() => {
                const { privileges, ...rest } = row 
                const privilegesArr = Object.keys(privileges).map(key => {
                  return {
                    key,
                    ...privileges[key]
                  }
                })

                const params = {
                  privileges: privilegesArr,
                  ...rest
                }  as SystemRoles.FormInfoParams
                editRole(params)
              }}
            >
              编辑
            </Button>
            <Popconfirm
              trigger="click"
              title={
                <div>
                  是否 <span className={styles.delColor}>删除</span> 角色 <span className={styles.delColor}>{row.name}</span> ?
                </div>
              }
              onConfirm={() => delRole(row.name, onCancelModal)}
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
    <PageContainer>
      <ProTable
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setModalTitleState(true)
              setModalVisible(true)
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        request={(params) => getAllRoles(params)}
      />
      <RoleForm
        dialogVisible={modalVisible}
        dialogVisibleTitle={modalTitleState}
        onCancleModal={onCancelModal}
        formInfo={formInfo}
      />
    </PageContainer>
  )
}

export default Roles
