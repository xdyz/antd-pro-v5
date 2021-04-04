import React, {useState, useEffect} from 'react'
import {GridContent, PageContainer} from '@ant-design/pro-layout'
import {Row, Col, Card, Button, Tree, Input, Modal} from 'antd'
import {ApartmentOutlined, DeleteOutlined} from '@ant-design/icons'
import type {DataNode} from 'antd/lib/tree'
import MenuForm from './components/MenuForm'
import {getMenus, deleteMenu} from '@/services/system/menus/index'
import styles from './index.less'
import {notifyInfoTip} from '@/utils/utils'

type TreeTitleType = {
  cardTitle: string
  createOrDel: boolean
  onOpen?: () => void
  onDelete?: () => void
}

type nodeData = {
  name?: string
} & DataNode
const TreeTitle: React.FC<TreeTitleType> = (props) => {
  const {cardTitle, createOrDel, onOpen, onDelete} = props
  return (
    <div className={styles.titleContainer}>
      <span>{cardTitle}</span>
      {createOrDel ? (
        <Button type="primary" size="middle" onClick={onOpen}>
          <ApartmentOutlined />
          新建
        </Button>
      ) : (
        <Button type="ghost" danger size="middle" onClick={onDelete}>
          <DeleteOutlined />
          删除
        </Button>
      )}
    </div>
  )
}

const cardHeight = {
  height: '80vh'
}

function convert(
  list: (SystemMenus.MenuTreeDataType & {children: SystemMenus.MenuTreeDataType[]})[]
) {
  return list.reduce((pre, cur, index, arr) => {
    if (cur.parentId === 0) pre.push(cur as never)
    else {
      const parent = arr.find((item) => item.id === cur.parentId)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(cur)
      }
    }
    return pre
  }, [])
}

const Menu: React.FC<Record<string, never>> = () => {
  const [showVisible, setShowVisible] = useState(false)
  const [formInfo, setformInfo] = useState<SystemMenus.MenuTreeDataType>({
    name: '',
    id: undefined,
    parentId: undefined,
    icon: undefined,
    hideInMenu: false,
    path: ''
  })
  const [menuList, setMenuList] = useState<(SystemMenus.MenuTreeDataType & {key: number})[]>([])
  const [topLists, setTopLists] = useState<SystemMenus.MenuTreeDataType[]>([])
  const openCreate = () => {
    setShowVisible(true)
  }

  const getAllMenus = async () => {
    const res = await getMenus()
    if (res?.code === 0) {
      const list = res?.data.map((item: SystemMenus.MenuTreeDataType) => ({key: item.id, ...item}))
      const treeLists = convert(list)
      setMenuList(treeLists ?? [])
      const topList = res?.data.filter((item: SystemMenus.MenuTreeDataType) => item.parentId === 0)
      setTopLists(topList)
    }
  }
  const cancelTreeCreate = () => {
    setShowVisible(false)
    getAllMenus()
  }

  const deleteOneMenu = async (id?: number) => {
    const res = await deleteMenu(id)
    if (res?.code === 0) {
      notifyInfoTip('菜单', '删除', true)
      getAllMenus()
    } else {
      notifyInfoTip('菜单', '删除', false, res?.errMessage)
    }
  }

  useEffect(() => {
    getAllMenus()
  }, [])
  return (
    <PageContainer>
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24} sm={24} xs={24}>
            <Card
              title={<TreeTitle cardTitle="菜单树" createOrDel onOpen={() => openCreate()} />}
              bordered={false}
              style={{...cardHeight, marginBottom: '10px'}}>
              <Input />
              <div style={{marginTop: '20px'}}>
                <Tree
                  treeData={menuList}
                  titleRender={(node: nodeData) => {
                    return <span>{node.name}</span>
                  }}
                  onSelect={(selectedKeys, {selectedNodes}) => {
                    const params = JSON.parse(JSON.stringify(selectedNodes[0]))
                    setformInfo(params)
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col lg={17} md={24} sm={24} xs={24}>
            <Card
              title={
                <TreeTitle
                  cardTitle="详情"
                  createOrDel={false}
                  onDelete={() => deleteOneMenu(formInfo?.id)}
                />
              }
              bordered={false}
              style={{...cardHeight}}>
              <MenuForm trees={[]} formInfo={formInfo} isCreate={false} onCancelModal={() => {}} />
            </Card>
          </Col>
        </Row>
      </GridContent>
      <Modal
        className={styles.menuFormModalBody}
        title="新建菜单"
        footer={false}
        destroyOnClose
        getContainer={false}
        visible={showVisible}
        onCancel={cancelTreeCreate}>
        <MenuForm trees={topLists} formInfo={formInfo} isCreate onCancelModal={cancelTreeCreate} />
      </Modal>
    </PageContainer>
  )
}

export default Menu
