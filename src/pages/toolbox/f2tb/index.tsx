import React, { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Upload, Button, Row, Col, Tree, Card, Result, Spin } from 'antd'
import { InboxOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons'
import { permutationsJson, json2Excel, json2Tree, json2Table } from '@/utils/excelTransform'
import styles from './index.less'
import type { EventDataNode } from 'antd/es/tree/index.d'

const { Dragger } = Upload

type TreeParams = {
  title: string,
  key: string
}

type TreeListParams = {
  title: string,
  key: string,
  children?: TreeParams[]
}

type TableParams = {
  title: string,
  department: string,
  start_time: string,
  end_time: string,
  duration: number,
  agent: string,
  principal: string,
  children?: TableParams[] | null
}

const cardHeight = {
  height: '80vh',
}



const FTwoTb: React.FC<Record<string, any>> = () => {
  const [fileInfo, setFileInfo] = useState<File>()
  const [MenuList, setMenuList] = useState<TreeListParams[]>([])
  const [tableList, setTableList] = useState<TableParams[]>([])
  const [showTableList, setShowTableList] = useState<TableParams[]>([])
  const [showLoading, setShowLoading] = useState<boolean>(false)
  const [importLoading, setImportLoading] = useState<boolean>(false)
  const importFileExcel = async (file: any) => {
    const res = await json2Tree(file)
    const table = await json2Table(file)
    setTableList(table)
    setShowTableList(table)
    setMenuList([res])
    setImportLoading(false)
  }
  const exportFileExcel = async (file: any) => {
    setShowLoading(true)
    setImportLoading(true)
    const excelSheetsObj = await permutationsJson(file)
    await json2Excel(excelSheetsObj)
    setFileInfo(file)
    importFileExcel(file)
    setShowLoading(false)
  }
  const draggerProps = {
    accept: '.xlsx,.xls',
    beforeUpload: (file: any) => {
      if (!file) return false
      setFileInfo(file)
      exportFileExcel(file)
      return true
    },
    itemRender: () => []
  }

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title'
    },
    {
      title: '工量评估',
      dataIndex: 'duration'
    },
    {
      title: '开始时间',
      dataIndex: 'start_time'
    },
    {
      title: '截止日期',
      dataIndex: 'end_time'
    },
    {
      title: '部门',
      dataIndex: 'department'
    },
    {
      title: '代理人',
      dataIndex: 'agent'
    },
    {
      title: '负责人',
      dataIndex: 'principal'
    }
  ]

 



  const defaultProps = {
    accept: '.xlsx,.xls',
    beforeUpload: (file: any) => {
      if (!file) return false
      setImportLoading(true)
      importFileExcel(file)
      setFileInfo(file)
      return true
    },
    itemRender: () => []
  }

  const onSelectTree = (node: EventDataNode) => {
    if(node.children) {
      setShowTableList(tableList) 
      return 
    }
    const arr = tableList.filter(item => item.title === node.title)
    setShowTableList(arr[0]?.children??[])
  }
  return (
    <PageContainer>
      <Dragger
        {...draggerProps}
        style={{ marginBottom: '20px', backgroundColor: 'white' }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text" >F表转TB表</p>
        <p className="ant-upload-hint">拖拽或者点击此区域进行文件转换</p>
        {
          fileInfo && <p className={styles.executeRedColor}>{`已选文件 ${fileInfo.name}`}</p>
        }
      </Dragger>

      <Row gutter={24}>
        <Col xxl={5} xl={7} lg={9} md={24} sm={24} xs={24}>
          <Card
            title={"文档树"}
            bordered={false}
            style={{ ...cardHeight, marginBottom: '10px' }}
          >
            {/* <Input placeholder='请输入节点名称' style={{ marginBottom: '20px' }} /> */}
            <Spin spinning={importLoading}>
              {
                MenuList.length === 0 && <Result
                  status="404"
                  title="暂无数据"
                  subTitle="请先导入F表数据"
                />
              }
              {
                MenuList.length !== 0 && <Tree
                  treeData={MenuList}
                  defaultExpandAll={true}
                  defaultSelectedKeys={['0']}
                  onSelect={(selectedKeys, { node }) => {
                    onSelectTree(node)
                  }}
                />}
            </Spin>
          </Card>
        </Col>
        <Col xxl={19} xl={17} lg={15} md={24} sm={24} xs={24}>
          <ProTable
            rowKey='id'
            columns={columns}
            search={false}
            toolBarRender={() => [
              <Upload {...defaultProps}>
                <Button icon={<UploadOutlined />} loading={importLoading} type='primary'>F表导入</Button>
              </Upload>,
              <Button icon={<DownloadOutlined />}
                loading={showLoading}
                type='primary'
                disabled={!fileInfo}
                onClick={() => exportFileExcel(fileInfo)}>TB表导出</Button>
            ]}
            dataSource={showTableList}
          />
        </Col>
      </Row>

    </PageContainer>
  )
}

export default FTwoTb