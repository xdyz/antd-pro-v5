import React, { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { createGitWebHook, editGitWebHook } from '@/services/system/webhook/index'
import { notifyInfoTip } from '@/utils/utils'

type ModalStateParams = {
  webhookVisiable: boolean,
  webhookTitle: boolean
}

type BaskFunction = () => void

type WebHookModalProps = {
  modalStateData: ModalStateParams,
  closeWebHookModal: BaskFunction,
  modalParams: SystemWebHooks.CreateGitWebHookParams
}

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
}

// 新增
const createCurWebHook = async (data: SystemWebHooks.CreateGitWebHookParams, closeWebHookModal: BaskFunction) => {
  const res = await createGitWebHook(data)
  if (res?.data) {
    notifyInfoTip('WebHook', '新增', true)
    closeWebHookModal()
  } else {
    notifyInfoTip('WebHook', '新增', false, res?.error?.message)
  }
}

// 编辑
const editCurWebHook = async (data: SystemWebHooks.EditGitWebHookParams, closeWebHookModal: BaskFunction) => {
  const res = await editGitWebHook(data)
  if (res?.data) {
    notifyInfoTip('WebHook', '编辑', true)
    closeWebHookModal()
  } else {
    notifyInfoTip('WebHook', '编辑', false, res?.error?.message)
  }
}

const WebHookModal: React.FC<WebHookModalProps> = (props) => {
  const { modalStateData, closeWebHookModal, modalParams } = props
  const [form] = useForm()

  const beforeSure = () => {
    form.validateFields().then((data) => {
      if (modalStateData.webhookTitle) {
        createCurWebHook(data, closeWebHookModal)
      } else {
        const params = Object.assign(modalParams, data)
        editCurWebHook(params, closeWebHookModal)
      }
    })
  }

  useEffect(() => {
    form.setFieldsValue(modalParams)
  }, [form, modalParams])
  return (
    <Modal destroyOnClose forceRender visible={modalStateData.webhookVisiable} title={`${modalStateData.webhookTitle ? '新建' : '编辑'}WebHook`} onOk={beforeSure} onCancel={closeWebHookModal}>
      <Form {...formLayout} form={form}>
        <Form.Item name='repo_url' label='仓库' rules={[{ required: true, message: '请输入仓库地址' }]}>
          <Input placeholder='请输入仓库地址'></Input>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default WebHookModal