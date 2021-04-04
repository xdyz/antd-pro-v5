import React, {useEffect, useState} from 'react'
import {Form, Input, Switch, Select, Button, Space} from 'antd'
import IconFont from '@/components/IconFont/index'
import iconList from '@/assets/iconfont.json'
import {createNewMenu} from '@/services/system/menus/index'
import styles from '../index.less'
import {notifyInfoTip} from '@/utils/utils'

const {Option, OptGroup} = Select
const layout = {
  labelCol: {span: 4},
  wrapperCol: {span: 19}
}

type MenuFormPropsType = {
  trees: SystemMenus.MenuTreeDataType[]
  formInfo: SystemMenus.MenuTreeDataType
  isCreate: boolean
  onCancelModal: () => void
}

const MenuForm: React.FC<MenuFormPropsType> = (props) => {
  const {trees, formInfo, isCreate, onCancelModal} = props
  const [form] = Form.useForm()
  const [isTopLevel, setIsTopLevel] = useState(false)

  useEffect(() => {
    form.setFieldsValue(formInfo)
    setIsTopLevel(formInfo?.parentId === 0)
  }, [form, formInfo])

  const changeParentMenu = (val: number) => {
    setIsTopLevel(val === 0)
  }

  const createMenuTree = async (data: SystemMenus.MenuTreeDataType) => {
    const res = await createNewMenu(data)
    if (res?.code === 0) {
      notifyInfoTip('菜单', '新增', true)
      onCancelModal()
    } else {
      notifyInfoTip('菜单', '新增', false, res?.errMessage)
    }
  }
  const updateMenuTree = (data: SystemMenus.MenuTreeDataType) => {
    // eslint-disable-next-line no-console
    console.log(data)
  }

  const beforeSure = () => {
    form.validateFields().then((data: any) => {
      if (isCreate) {
        createMenuTree(data)
      } else {
        updateMenuTree(data)
      }
    })
  }

  return (
    <>
      <Form {...layout} form={form} layout="horizontal" className={styles.menuFormStyle}>
        <Form.Item
          label="菜单标题"
          name="name"
          rules={[{required: true, message: '请输入菜单标题'}]}>
          <Input placeholder="请输入菜单标题" />
        </Form.Item>
        <Form.Item label="路由" name="path" rules={[{required: true, message: '请输入菜单路由'}]}>
          <Input placeholder="请输入菜单路由" />
        </Form.Item>
        <Form.Item label="父级菜单" name="parentId">
          <Select placeholder="请选择父级菜单" onChange={changeParentMenu}>
            <OptGroup label="已有">
              {trees.length !== 0
                ? trees.map((item: SystemMenus.MenuTreeDataType) => {
                    return (
                      <Option value={item.id as number} key={item.id}>
                        {item.name}
                      </Option>
                    )
                  })
                : []}
            </OptGroup>
            <OptGroup label="顶级">
              <Option value={0}>顶级菜单</Option>
            </OptGroup>
          </Select>
        </Form.Item>
        {isTopLevel && (
          <Form.Item label="图标" name="icon" rules={[{required: true, message: '请选择菜单图标'}]}>
            <Select placeholder="请选择菜单图标" showSearch>
              {iconList
                ? iconList.glyphs.map((item) => {
                    return (
                      <Option value={item.font_class} key={item.icon_id}>
                        <Space>
                          <IconFont type={`icon-${item.font_class}`} />
                          {item.font_class}
                        </Space>
                      </Option>
                    )
                  })
                : []}
            </Select>
          </Form.Item>
        )}
        <Form.Item label="是否隐藏" name="hideInMenu" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>
      </Form>
      {isCreate ? (
        <div className={styles.footerContainer}>
          <Space>
            <Button type="default" onClick={onCancelModal}>
              取消
            </Button>
            <Button type="primary" onClick={beforeSure}>
              确定
            </Button>
          </Space>
        </div>
      ) : (
        <div style={{textAlign: 'right'}}>
          <Button type="primary" onClick={beforeSure}>
            确定
          </Button>
        </div>
      )}
    </>
  )
}

export default MenuForm
