import React, { useState, useEffect, useReducer } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Row, Col, Popconfirm, Card, Button, Space } from 'antd'
import { getAllGitWebHooks, deleteGitWebhook } from '@/services/system/webhook/index'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { notifyInfoTip } from '@/utils/utils'
import WebHookModal from './components/WebHookModal'
import styles from './index.less'


const modalStateInitData = {
  webhookVisiable: false,
  webhookTitle: true
}

const modalStateReducer = (state: SystemWebHooks.ModalStateParams, action: SystemWebHooks.ModalActionParams) => {
  switch (action.type) {
    case 'openCreateModalVisiable':
      return {
        webhookVisiable: true,
        webhookTitle: true
      }
    case 'openEditModalVisiable':
      return {
        webhookVisiable: true,
        webhookTitle: false
      }
    case 'closeModal':
      return modalStateInitData
    default:
      return modalStateInitData
  }
}

const GitWebHook: React.FC<Record<string, never>> = () => {
  const defaultModalParams = {
    repo_url: '',
    token: ''
  }
  const [webHooksList, setWebHooksList] = useState<SystemWebHooks.EditGitWebHookParams[]>([])
  const [modalStateData, modalStateDispatch] = useReducer(modalStateReducer, modalStateInitData)
  const [modalParams, setModalParams] = useState<SystemWebHooks.CreateGitWebHookParams>(defaultModalParams)
  const [cardLoading, setCardLoading] = useState<boolean>(false)


  const getAllWebHook = async () => {
    setCardLoading(true)
    const res = await getAllGitWebHooks()
    if (res?.data) {
      setWebHooksList(res.data)
    }
    setCardLoading(false)
  }

  const deleteCurWebHook = async (id: number) => {
    const res = await deleteGitWebhook(id)
    if (res) {
      notifyInfoTip('Git WebHook', '删除', true)
      getAllWebHook()
    } else {
      notifyInfoTip('Git WebHook', '删除', false, res?.error?.message)
    }
  }

  const openWebHookModal = () => {
    modalStateDispatch(
      {
        type: 'openCreateModalVisiable',
      }
    )
    setModalParams(defaultModalParams)
  }

  const editWebHookModal = (data: SystemWebHooks.CreateGitWebHookParams) => {
    modalStateDispatch(
      {
        type: 'openEditModalVisiable'
      }
    )
    setModalParams(data)
  }

  const closeWebHookModal = () => {
    modalStateDispatch(
      {
        type: 'closeModal'
      }
    )
    getAllWebHook()
  }

  useEffect(() => {
    // 获取所有的webhook
    getAllWebHook()
  }, [])
  return (
    <PageContainer>
      <ProCard colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }} className={styles.opreateWrapper}>
        <div className={styles.opreateContent}>
          <h3>操作</h3>
          <Space>
            <Button type='primary' onClick={openWebHookModal}>新建</Button>
          </Space>
        </div>
      </ProCard>
      <Row gutter={16}>
        {
          webHooksList && webHooksList.map(item => {
            return (
              <Col
                xxl={4}
                xl={6}
                lg={8}
                md={12}
                sm={24}
                xs={24}
                style={{ marginBottom: '10px' }}
                key={`col${item.id}`}>
                <Card
                  key={item.id}
                  hoverable
                  loading={cardLoading}
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
                  actions={[
                    <EditOutlined key="edit" onClick={() => editWebHookModal(item)} />,
                    <Popconfirm
                      placement="top"
                      title={
                        <>
                          是否
                          &nbsp;<span className={styles.delColor}>删除</span>&nbsp;
                          <span>webhook?</span>
                        </>
                      }
                      onConfirm={() => deleteCurWebHook(item.id)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <DeleteOutlined key="delete" />
                    </Popconfirm>
                  ]}
                >
                  <p>
                    <span className={styles.cardContentLabel}>仓库：</span>
                    <span>{item.repo_url}</span>
                  </p>
                  <p>
                    <span className={styles.cardContentLabel}>Token：</span>
                    <span>{item.token}</span>
                  </p>
                </Card>
              </Col>
            )
          })
        }
      </Row>
      <WebHookModal
        modalStateData={modalStateData}
        closeWebHookModal={closeWebHookModal}
        modalParams={modalParams}
      ></WebHookModal>
    </PageContainer>
  )
}

export default GitWebHook