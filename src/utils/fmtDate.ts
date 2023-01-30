// 时间戳转换为 YYYY-mm-dd 日期格式
const fmtDate = (obj: string) => {
  if (obj) {
    const data = parseInt(obj.split('.')[0]) * 1000
    const date = new Date(parseFloat(data.toString()))
    const y = date.getFullYear()
    const m = '0' + (date.getMonth() + 1)
    const d = '0' + date.getDate()
    return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
  } else {
    return ''
  }
}
export default fmtDate
