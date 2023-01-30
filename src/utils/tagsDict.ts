// 中英词典对照表

import { logInfo } from '@/utils'
import { ElMessage } from 'element-plus'
import { langConfig } from '@/utils/constant/config'
// 配置中英指标的对应关系，type为业务指标，通常为中文指标，type_en为英文指标
const getTagsDict = (tags: any, lang = '/zh-CN') => {
  const tagsDict = {} as any
  for (let i = 0; i < tags.length; i++) {
    const first = tags[i]
    tagsDict[first.type] = { '/zh-CN': !!first.type_zh ? first.type_zh : first.type, '/en-US': !!first.type_en ? first.type_en : first.type, type: 'first' }
    for (let j = 0; j < tags[i].child.length; j++) {
      const second = tags[i].child[j]
      tagsDict[second.type] = { '/zh-CN': !!second.type_zh ? second.type_zh : second.type, '/en-US': !!second.type_en ? second.type_en : second.type, type: 'second' }
    }
  }
  logInfo('tagsDict', tagsDict)
  if (Object.keys(tagsDict).length === 0) {
    ElMessage.warning(langConfig.alice.index.tagError[lang])
  }
  return tagsDict
}
/**场景挖掘存在相同的标签，特殊处理 */
const getSceneTagDict = (tags: any, lang = '/zh-CN') => {
  const tagsDict = {} as any
  for (let i = 0; i < tags.length; i++) {
    const first = tags[i]
    tagsDict[first.type] = { '/zh-CN': !!first.type_zh ? first.type_zh : first.type, '/en-US': !!first.type_en ? first.type_en : first.type, type: first.type, tagType: 'first' }
    for (let j = 0; j < tags[i].child.length; j++) {
      const second = tags[i].child[j]
      tagsDict[`${first.type}_${second.type}`] = {
        '/zh-CN': !!second.type_zh ? second.type_zh : second.type,
        '/en-US': !!second.type_en ? second.type_en : second.type,
        type: second.type,
        tagType: 'second'
      }
    }
  }
  logInfo('tagsDict', tagsDict)
  if (Object.keys(tagsDict).length === 0) {
    ElMessage.warning(langConfig.alice.index.tagError[lang])
  }
  return tagsDict
}
export { getTagsDict, getSceneTagDict }
