// import React, { useEffect, useState } from 'react'
import React, { useEffect } from 'react'
// import { Modal, Form, Input, Tree } from 'antd'
import { Modal, Form, Input, Button, Space, Checkbox, Switch } from 'antd'
// import type { DataNode } from 'antd/lib/tree'
// import IconFont from '@/components/IconFont/index'
import { addRoles, editRoles } from '@/services/system/role/index'
import { notifyInfoTip } from '@/utils/utils'
// import { MenuList } from '../../../../../config/routers'
import styles from '../index.less'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'

type RoleFormProps = {
  dialogVisible: boolean;
  dialogVisibleTitle: boolean;
  onCancleModal: () => void;
  formInfo: SystemRoles.FormInfoParams;
};

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}
// type RoutersDataType = {
//   name: string;
//   path: string;
//   redirect?: string;
//   icon?: string;
//   authority?: string[];
//   key: string;
//   hideInMenu?: boolean;
//   children?: RoutersDataType[];
// };
// 设置数据，如果为星号 则要选中所有的节点
// const dealWithPrivileges = (privileges: string[] | number[] | string) => {
//   let arr: string[] = []
//   if (privileges === '*') {
//     MenuList.forEach((item: RoutersDataType) => {
//       const arr1 = item.children
//         ? item.children.map((item1) => {
//           return item1.key
//         })
//         : []
//       arr = arr.concat(arr1)
//     })

//     return arr
//   }
//   if (Object.prototype.toString.call(privileges) === '[object Array]') {
//     return JSON.parse(JSON.stringify(privileges))
//   }
//   return arr
// }

// 新增
const addRole = async (data: SystemRoles.RoleDataType, onCancleModal: () => void) => {
  const res = await addRoles(data)
  if (res.data.id) {
    notifyInfoTip('角色', '新增', true)
    onCancleModal()
  } else {
    notifyInfoTip('角色', '新增', false, res.message)
  }
}

// 编辑
const editRole = async (role_name: string | undefined, data: SystemRoles.RoleDataType, onCancleModal: () => void) => {
  const res = await editRoles(data, role_name)
  if (res.data.id) {
    notifyInfoTip('角色', '编辑', true)
    onCancleModal()
  } else {
    notifyInfoTip('角色', '编辑', false, res.message)
  }
}

const RoleForm: React.FC<RoleFormProps> = (props) => {
  const { dialogVisible, dialogVisibleTitle, onCancleModal, formInfo } = props
  // const [selectPrivileges, setSelectPrivileges] = useState<string[] | number[]>([])
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(formInfo)
    // const arr = dealWithPrivileges(formInfo.privileges)
    // setSelectPrivileges(arr)
  }, [form, formInfo])

  // const checkTrees = (
  //   checkedKeys:
  //     | React.ReactText[]
  //     | {
  //       checked: React.ReactText[];
  //       halfChecked: React.ReactText[];
  //     },
  // ) => {
  //   const { checked } = JSON.parse(JSON.stringify(checkedKeys))
  //   form.setFieldsValue({
  //     privileges: checked || [],
  //   })
  // }

  const modelOk = () => {
    form.validateFields().then((data) => {
      const { privileges, ...querys } = data
      const obj = {}
      privileges.forEach((item: SystemRoles.PrivilegesParamsAndKey) => {
        const { key, ...rest } = item
        obj[key] = rest
      })
      const params = {
        ...querys,
        privileges: obj
      }

      if (dialogVisibleTitle) {
        addRole(params, onCancleModal)
      } else {
        editRole(formInfo.name, params, onCancleModal)
      }
    })
  }
  return (
    <Modal
      forceRender
      destroyOnClose
      getContainer={false}
      title={`${dialogVisibleTitle ? '新增' : '编辑'}角色`}
      visible={dialogVisible}
      onOk={modelOk}
      onCancel={onCancleModal}
      width={600}
    >
      <Form {...layout} form={form}>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          label="权限"
          name="privileges"
        >
          {/* <div className={styles.treeWrapper}>
            <Tree
              treeData={MenuList}
              titleRender={(node: nodeData) => {
                return (
                  <>
                    {node.icon ? (
                      <IconFont type={`${node.icon}`} className={styles.showIconPadding} />
                    ) : null}
                    <span>{node.name}</span>
                  </>
                )
              }}
              defaultCheckedKeys={selectPrivileges}
              checkable
              defaultExpandAll
              checkStrictly
              onCheck={(checkedKeys) => checkTrees(checkedKeys)}
            />
          </div> */}
          <Form.List name="privileges">
            {(fields, { add, remove }) => (
              <>
                {fields &&
                  fields.map((field) => (
                    <Space align="baseline" key={field.key}>
                      <Form.Item
                        name={[field.name, 'key']}
                        fieldKey={[field.fieldKey, 'key']}
                        rules={[{ required: true, message: '请输入标签' }]}

                      >
                        <Input placeholder="请输入标签" />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'read']}
                        fieldKey={[field.fieldKey, 'read']}
                        valuePropName='checked'
                      >
                        <Checkbox>read</Checkbox>
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'write']}
                        fieldKey={[field.fieldKey, 'write']}
                        valuePropName='checked'
                      >
                        <Checkbox value='1'>write</Checkbox>
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'execute']}
                        fieldKey={[field.fieldKey, 'execute']}
                        valuePropName='checked'
                      >
                        <Checkbox >execute</Checkbox>
                      </Form.Item>
                      <MinusCircleOutlined
                        className={styles.delColor}
                        onClick={() => {
                          remove(field.name)
                        }}
                      />
                    </Space>
                  ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    add({
                      key: '',
                      execute: false,
                      read: false,
                      write: false
                    })
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  增加
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item name='root' label='管理员' valuePropName='checked'>
          <Switch checkedChildren="是" unCheckedChildren="否"></Switch>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default RoleForm
