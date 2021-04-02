import { notification } from 'antd'

// 将字符串转为base64
export const encodeBase64 = (str: string) => {
  // 对字符串进行编码
  const encode = encodeURI(str)
  // 对编码的字符串转化base64
  const base64 = btoa(encode)
  return base64
}

/**
 *
 * @param task 任务名称 如字典项...
 * @param type 任务类别 新增 删除 编辑...
 * @param state 任务状态 成功  失败
 * @param message 任务错误信息 接口状态为失败时 后端返回的信息
 */

 export function notifyInfoTip(task: string, type: string, state: boolean, message?: string) {
  if (state) {
    notification.success({
      message: '成功',
      description: `${type}${task}成功`,
    })
  } else {
    notification.error({
      message: '失败',
      description: message ? `${message}` : `${type}${task}失败`,
    })
  }
}


// 解析耗时
export function parseDuration(duration: number | null, defaultTime?: boolean): string {
  if (duration) {
    if (duration < 1) {
      return `${duration * 1000}ms`
    }
    if (duration < 60) {
      return `${Math.floor(duration)}s`
    }
    if (duration < 3600) {
      const m = Math.floor(duration / 60)
      const s = Math.floor(duration - 60 * m)
      return `${m}m${s > 0 ? `${s}s` : ''}`
    }
    if (duration < 3600 * 24) {
      const h = Math.floor(duration / 3600)
      const m = Math.floor((duration - 3600 * h) / 60)
      return `${h}h${m > 0 ? `${m}m` : ''}`
    }
    const d = Math.floor(duration / (3600 * 24))
    return `${d + parseFloat(((duration - 3600 * 24 * d) / (3600 * 24)).toFixed(1))}d`
  }
  return defaultTime ? '0s' : ''
}


export const copyInfo = (str: string) => {
  const input = document.createElement('input')
  input.setAttribute('id', 'demoInput')
  input.setAttribute('value', str)
  document.body.appendChild(input)
  const val: any = document.querySelector('#demoInput')  // 可以是一个输入框
  val.select()  // 将这个框选中
  document.execCommand('Copy')  // 这样就拿到了 框中的数据 就可以去别的地方粘贴了
  input.remove()
}



export const checkButtonAuthority = (key: string, tags?: string[], privileges?: Login.PrivilegesParams): boolean => {
  if (!privileges || !tags) return false
  const result: boolean = tags.some(tag => {
    return privileges[tag] && privileges[tag][key]
  })
  return result
}


export function parseTime(time: number, cFormat?: string) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat ?? '{y}-{m}-{d} {h}:{i}:{s}'
  if (!time) {
    return ''
  }
  const date = new Date(time * 1000)
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`
    }
    return value || 0
  })
  return timeStr
}

// 将file文件转成base64
export const getBase64 = (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}


// 接收webSocket onmessage 函数 并返回

export const getSocketMessage = (e: any) => {
  return e
}