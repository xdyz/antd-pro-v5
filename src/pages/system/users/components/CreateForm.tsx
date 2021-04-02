import React, {useEffect} from 'react'
import {Modal, Form, Input, Select} from 'antd'
import {createUser, editUser} from '@/services/system/users/index'
import {notifyInfoTip} from '@/utils/utils'

const {Option} = Select

type RoleDataType = {
  id: number
  name: string
}
type CreateFormPropsType = {
  modalTitleState: boolean
  modalVisiable: boolean
  formInfo: SystemUsers.EditFormColumn
  roleArrData: RoleDataType[]
  onCancel: () => void
}

const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20}
}

// 新增
const createNewUser = async (values: SystemUsers.CreateFormColumn, onCancel: () => void) => {
  const res = await createUser(values)
  if (res?.code === 0) {
    notifyInfoTip('用户', '新增', true)
    onCancel()
  } else {
    notifyInfoTip('用户', '新增', false, res.message)
  }
}

// 编辑
const editCurrentUser = async (values: SystemUsers.EditFormColumn, onCancel: () => void) => {
  const res = await editUser(values.id as number, values)
  if (res?.code === 0) {
    notifyInfoTip('用户', '编辑', true)
    onCancel()
  } else {
    notifyInfoTip('用户', '编辑', false, res.message)
  }
}

const CreateForm: React.FC<CreateFormPropsType> = (props) => {
  const [form] = Form.useForm()
  const {modalTitleState, modalVisiable, onCancel, formInfo, roleArrData} = props
  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(formInfo)
  }, [form, formInfo])

  const beforeCreateNewUser = () => {
    form.validateFields().then((values) => {
      Object.assign(formInfo, values)
      if (modalTitleState) {
        createNewUser(formInfo, onCancel)
      } else {
        editCurrentUser(formInfo, onCancel)
      }
    })
  }

  return (
    <Modal
      forceRender
      destroyOnClose
      title={`${modalTitleState ? '新建' : '编辑'}用户`}
      visible={modalVisiable}
      onCancel={() => onCancel()}
      onOk={() => beforeCreateNewUser()}>
      <Form {...layout} form={form} layout="horizontal">
        <Form.Item
          label="账号"
          name="username"
          validateFirst
          rules={[
            {required: true, message: '请输入登录账号'},
            () => ({
              validator(_, value) {
                const exg = new RegExp(/^[a-zA-Z][0-9a-zA-Z]+$/)
                if (exg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('只包含数字和字母，且以字母开头'))
              }
            })
          ]}>
          <Input placeholder="请输入登录账号" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          validateFirst
          rules={[
            {required: modalTitleState, message: '请输入登录密码'},
            () => ({
              validator(_, value) {
                const exg = new RegExp(/^[A-Za-z0-9]{6,20}$/)
                if (exg.test(value)) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('6 - 20个字符，且只能包含字母和数字'))
              }
            })
          ]}>
          <Input placeholder="请输入登录密码" />
        </Form.Item>
        <Form.Item
          label="用户名称"
          name="nickname"
          rules={[{required: true, message: '请输入名称'}]}>
          <Input placeholder="请输入用户名称" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{required: true, message: '请输入邮箱'}]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item label="角色" name="roles">
          <Select placeholder="请选择角色" allowClear>
            {/* {roleArrData.map((item) => {
              return (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              )
            })} */}
            <Option value={0}>管理员</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateForm
