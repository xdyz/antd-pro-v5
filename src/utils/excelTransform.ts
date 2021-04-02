import type { WritingOptions } from 'xlsx'
import XLSX from 'xlsx'
import { parseTime } from './utils'
import moment from 'moment'

type PermutationsArr = Record<string, any>
type PermutationsObj = Record<string, PermutationsArr[]>

// 读取excel文件 将文件数据转为json
export const excel2Json = (file: any) => {
  return new Promise((resolve) => {
    const fileReader = new FileReader()

    fileReader.onload = (ev) => {
      const data = ev.target?.result
      const workBook = XLSX.read(data, { type: 'binary' })
      const sheets = {}
      const sheet2JsonNoPts = { raw: true }
      Object.keys(workBook.Sheets).forEach(item => {
        if (workBook.Sheets.hasOwnProperty(item)) {
          // fromTo = workBook.Sheets[item]['!ref']
          sheets[item] = XLSX.utils.sheet_to_json(workBook.Sheets[item], sheet2JsonNoPts)
        }
      })
      resolve(sheets)
    }

    fileReader.readAsBinaryString(file)
  })
}

const formatDate = (num: number) => {
  const num1 = Number(num)	// 强制类型转化，以防传来的值是字符串
  let millisecond = 0	// 转化后的毫秒数
  if (num1 > 60) {
    millisecond = (num1 - 25569) * 60 * 60 * 24 * 1000
  } else { // 对小于61的错误日期进行处理
    millisecond = (num1 - 25568) * 60 * 60 * 24 * 1000
  }
  const date = new Date(millisecond)
  const result = date ? moment(date).format('YYYY-MM-DD') : ''

  return result
}

const transFormTime = (row: PermutationsArr): number[] => {
  const keys = Object.keys(row).filter(key => {
    const reg = /^(([0-9])|([0-9]_))+[0-9]?$/
    return reg.test(key)
  })
  let values = keys.map(key => {
    return row[key]
  })
  values = values.sort()
  // 修复问题：甘特时间字段含空字符串""，导致取到的开始时间为不正确
  values = values.filter(item => { return item && item !== '' && item > 0 })
  return values
}


export const dateDiff = (sDate1: string, sDate2: string): number => { // sDate1和sDate2是yyyy-MM-dd格式
  let iDays = 0
  if (sDate1 && sDate2) {
    const startDay = moment(sDate1).valueOf()
    const endDay = moment(sDate2).valueOf()
    iDays = ((endDay - startDay) / 1000 / 60 / 60 / 24) + 1
  }
  return iDays // 返回相差天数
}

const transFormOneTB = (row: PermutationsArr, title: string, task: string) => {
  const values = transFormTime(row)
  const middleStartTime = values.length > 0 ? formatDate(values[0]) : ''
  const middleEndTime = values.length > 0 ? formatDate(values[values.length - 1]) : ''
  const startTime = middleStartTime ? `${middleStartTime} 09:00:00` : undefined
  const endTime = middleEndTime ? `${middleEndTime} 18:00:00` : undefined

  return {
    '标题': title,
    // '标题': row['开发内容']??'',
    '上级任务': task,
    // '上级任务':  row['项目']??'',
    '任务列表': row['模块'],
    '执行者': row['执行人'],
    '参与者': `${row['执行人']}|${row['代理人']}`,
    '开始时间': startTime,
    '截止时间': endTime,
    '版本': row['版本'] ?? '',
    '标签': row['标签'] ?? '',
    '优先级': row['优先级'] ?? '',
    '备注': row['备注'] ?? '',
    '部门': row['部门'],
    '原计划完成时间': endTime,
    '工量评估': row['工量评估'],
    '延期原因': row['延期原因'] ?? '',
    '延期备注': row['延期备注'] ?? ''
  }
}

// const judgmentHasSameTitle = (arr: PermutationsArr[], title: string) => {
//   const state = arr.some(item => !item['上级任务'] && item['标题'] === title)
//   return state
// }


// 将读取到的excel json 数据 重新组合排列成为 新的excel 数据然后进行导出

export const permutationsJson = async (file: any) => {
  const sheetsObj = await excel2Json(file) as PermutationsObj
  const transSheets = {}
  if (sheetsObj) {
    const sheetKeys = Object.keys(sheetsObj)
    sheetKeys.forEach(key => {
      const sheetData = sheetsObj[key]
      const arr: Record<string, any>[] = []
      sheetData.forEach(row => {
        if (!row['开发内容']) {
          // if (row['项目'] !== row['子项目']) {
          //   if (!judgmentHasSameTitle(arr, row['项目'])) {
          //     arr.push(transFormOneTB(row, row['项目'], ''))
          //   }
          //   if (row['子项目']) {
          //     arr.push(transFormOneTB(row, row['子项目'], row['项目']))
          //   }
          // } else {
            arr.push(transFormOneTB(row, row['项目'], ''))
          // }
        } else {
          arr.push(transFormOneTB(row, row['开发内容'], row['项目']))
        }
      })
      transSheets[key] = arr
    })
  }
  return transSheets
}



// 下载excel文件
export const downloadFile = (obj: any, name: string, suffix: string) => {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = `${parseTime(Math.floor(+new Date() / 1000))}-${name}.${suffix}`
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => { // 延时释放
    window.URL.revokeObjectURL(url) // 用URL.revokeObjectURL()来释放这个object URL
  }, 100)
}


const changeData = (s: any) => {
  // 如果存在ArrayBuffer对象(es6) 最好采用该对象
  if (typeof ArrayBuffer !== 'undefined') {
    // 1、创建一个字节长度为s.length的内存区域
    const buf = new ArrayBuffer(s.length)

    // 2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
    const view = new Uint8Array(buf)

    // 3、返回指定位置的字符的Unicode编码
    for (let i = 0; i !== s.length; i += 1) view[i] = s.charCodeAt(i)

    return buf
  }
  const buf = new Array(s.length)
  for (let x = 0; x !== s.length; x += 1) buf[x] = s.charCodeAt(x)
  return buf
}

export const json2Excel = (obj: PermutationsObj) => {
  const wopts = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
  }
  const arrKeys = Object.keys(obj)
  const workBook = {
    SheetNames: arrKeys,
    Sheets: {},
    Props: {}
  }

  arrKeys.forEach((key: string) => {
    workBook.Sheets[key] = XLSX.utils.json_to_sheet(obj[key])
  })
  const xls = XLSX.write(workBook, wopts as WritingOptions)
  // 3、XLSX.write() 开始编写Excel表格
  // 4、changeData() 将数据处理成需要输出的格式
  const name = 'TB数据'
  downloadFile(new Blob([changeData(xls) as BlobPart], { type: 'application/octet-stream' }), name, 'xlsx')
}


const hasModuleJson = (arr: TreeListParams[], title: string) => {
  const state = arr.some(item => item.title === title)
  return state
}


type TreeListParams = {
  title: string,
  key: string,
  children?: TreeListParams[]
}


export const json2Tree = async (file: any) => {
  const tree: TreeListParams = {
    title: file.name,
    key: '0',
    children: []
  }
  const data = await excel2Json(file) as PermutationsObj

  Object.keys(data).forEach((key, index) => {
    const arr: TreeListParams[] = []
    const sheets = data[key]
    sheets.forEach((row, index1) => {
      if (!hasModuleJson(arr, row['模块'])) {
        arr.push({
          title: row['模块'],
          key: `0-${index}-${index1}`
        })
      }
    })

    if (tree?.children) {
      tree?.children.push({
        title: key,
        key: `0-${index}`,
        children: arr
      })
    }
  })

  return tree
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

const transFormTable = (row: PermutationsArr, title: string, finish?: boolean) => {
  const values = transFormTime(row)
  const middleStartTime = values.length > 0 ? formatDate(values[0]) : ''
  const middleEndTime = values.length > 0 ? formatDate(values[values.length - 1]) : ''
  const startTime = middleStartTime ? `${middleStartTime} 09:00:00` : ''
  const endTime = middleEndTime ? `${middleEndTime} 18:00:00` : ''
  const duration = (middleStartTime && middleEndTime) ? dateDiff(middleStartTime, middleEndTime) : 0
  return {
    title,
    department: row['部门'],
    start_time: startTime,
    end_time: endTime,
    duration,
    agent: row['代理人'],
    principal: row['执行人'],
    children: !finish ? [] : null
  }
}

export const json2Table = async (file: any) => {
  const sheetsObj = await excel2Json(file) as PermutationsObj
  if (sheetsObj) {
    const sheetKeys = Object.keys(sheetsObj)
    const moduleGroups: TableParams[] = []
    sheetKeys.forEach(key => {
      const sheet = sheetsObj[key]
      let group: TableParams | null; let taskGroup: TableParams | null; let childTaskGroup: TableParams | null
      sheet.forEach((row, index) => {
        const moduleName = row['模块']
        if (moduleName) {
          const fgGroup = moduleGroups.filter(item => item.title === moduleName)
          group = fgGroup.length > 0 ? fgGroup[0] : null
          if (!group) {
            const info = transFormTable(row, moduleName)
            Object.assign(info, {
              id: `${key}-${moduleName}-${index}`
            })
            group = info
            moduleGroups.push(info)
          }
        }

        const taskName = row['项目']
        if (taskName) {
          const fgGroup = group?.children ? group.children.filter(item => item.title === taskName) : []
          taskGroup = fgGroup.length > 0 ? fgGroup[0] : null
          if (!taskGroup) {
            const info = transFormTable(row, taskName)
            Object.assign(info, {
              id: `${key}-${moduleName}-${taskName}-${index}`
            })
            taskGroup = info
            if (group?.children) {
              group.children.push(info)
            }
          }
        }

        // const childTaskName = row['子项目']
        // if (childTaskName) {
        //   const fgGroup = taskGroup?.children ? taskGroup.children.filter(item => item.title === childTaskName) : []
        //   childTaskGroup = fgGroup.length > 0 ? fgGroup[0] : null
        //   if (!childTaskGroup && childTaskName !== taskGroup?.title) {
        //     const info = transFormTable(row, childTaskName)
        //     Object.assign(info, {
        //       id: `${key}-${moduleName}-${taskName}-${childTaskName}-${index}`
        //     })
        //     childTaskGroup = info
        //     if (taskGroup?.children) {
        //       taskGroup.children.push(info)
        //     }
        //   }
        // }

        const contentName = row['开发内容']
        if (contentName && contentName !== '总进度') {
          const info = transFormTable(row, contentName, true)

          Object.assign(info, {
            id: `${key}-${moduleName}-${taskName}-${contentName}-${index}`
          })

          if (!childTaskGroup || (childTaskGroup.title === taskGroup?.title)) {
            if (taskGroup?.children) {
              taskGroup.children.push(info)
            }
          } else if (childTaskGroup?.children) {
            childTaskGroup.children.push(info)
          }
        }
      })
    })

    return moduleGroups
  }
  return []

}