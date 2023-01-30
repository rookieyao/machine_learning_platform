import { ElMessage } from 'element-plus'

const downloadFile = (url: string, filename: string, method: string, body: any) => {
  var url = url
  var xhr = new XMLHttpRequest()
  xhr.open(method, url, true)
  xhr.responseType = 'blob' // 返回类型blob
  xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`) // 携带token校验
  if (method === 'post' && body) {
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    // 正式需要注释掉下面两行
    xhr.setRequestHeader('X-user', '666')
    xhr.setRequestHeader('userId', '666')
  }
  xhr.onload = function () {
    if (this.status === 200) {
      // 判断后端是否有返回文件名
      const contentDisposition = this.getResponseHeader('content-disposition')
      if (contentDisposition && !filename) {
        filename = contentDisposition.split('filename=')[1].replaceAll('"', '')
      }
      var content = this.response
      if (filename.includes('.zip')) {
        var blob = new Blob([content], { type: 'application/zip;' })
      } else {
        var blob = new Blob([content], { type: 'application/octet-stream' })
      }
      var reader = new FileReader()
      reader.readAsDataURL(blob) // 转换为base64
      reader.onload = function (e: any) {
        let link = document.createElement('a') // 创建一个a标签用于下载
        link.style.display = 'none'
        link.setAttribute('target', '_blank')
        link.setAttribute('download', filename)
        link.href = e.target.result
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    } else {
      ElMessage.error('文件不存在')
    }
  }
  if (method === 'post' && body) {
    xhr.send(JSON.stringify(body))
  } else {
    xhr.send() // 发送ajax请求
  }
}

export default downloadFile
