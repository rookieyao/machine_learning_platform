/**原始数据管理 */
export const processState = {
  '1': '处理中',
  '2': '处理成功',
  '3': '处理失败',
  '-1': '未处理'
} as any
export const language = {
  '1': '中文',
  '2': '英文'
} as any
/**训练数据管理 */
export const importState = {
  '1': '导入中',
  '2': '导入成功',
  '3': '导入失败'
} as any
export const projectType = {
  1: '产品洞察',
  2: '服务洞察',
  3: '场景挖掘'
} as any

/**训练管理 */
export const dataType = {
  aspect: '方面',
  sentiment: '情感',
  focus: '关注点',
  intent: '意图'
} as any

export const dataTypeNum = {
  '1': '方面',
  '2': '情感',
  '3': '关注点',
  '4': '意图'
} as any

export const modelState = {
  '-1': '未训练',
  '1': '训练中',
  '2': '训练成功',
  '3': '训练失败'
} as any

export const serviceState = {
  '-1': '未上线',
  '1': '评估中',
  '2': '评估成功',
  '3': '评估失败',
  '4': '审核中',
  '5': '上线中',
  '6': '已上线',
  '7': '上线失败',
  '8': '已下线'
} as any

export const serviceEvaluationState = {
  '-1': '未评估',
  '1': '评估中',
  '2': '评估成功',
  '3': '评估失败'
} as any

/**审核管理 */
/**审核状态 */
export const approveState = {
  '1': '待审核',
  '2': '审核通过',
  '3': '审核不通过'
} as any

export const enviromentType = {
  '1': 'FAT',
  '2': '生产'
} as any

/**操作类型 */
export const operationState = {
  '1': '上线',
  '2': '下线'
} as any
