// 点击按钮后失焦
const buttonBlur = (v: any) => {
  if (v) {
    v.target.blur()
    if (v.target.nodeName === 'SPAN') {
      v.target.parentNode.blur()
    }
  }
}
export default buttonBlur
