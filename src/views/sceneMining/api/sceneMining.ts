import { logInfo } from '@/utils'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const api = '/api'
const taskApi = {
  statesApi: api + '/scene/task/states',
  saveApi: api + '/scene/task/save',
  processApi: api + '/scene/task/process',
  processChangeApi: api + '/scene/task/process_change',
  addVersionApi: api + '/scene/task/add_version',
  uploadFileApi: api + '/scene/task/upload',
  removeFileApi: api + '/scene/task/remove_file/',
  downloadFileApi: api + '/scene/task/download/',
  uploadTagApi: api + '/scene/tag/upload_tag',
  uploadSimilarApi: api + '/scene/tag/upload_similar',
  AddSceneTagApi: api + '/scene/task/add_scene',
  prevApi: api + '/scene/tag/search/prev',
  nextApi: api + '/scene/tag/search/next',
  addTagApi: api + '/scene/tag/add_tag',
  delTagApi: api + '/scene/tag/del_tag',
  checkTagApi: api + '/scene/tag/check_tag/',
  copyTagApi: api + '/scene/tag/copy_tag/',
  setOnlineVersionApi: api + '/scene/task/online_version/',
  tagCountApi: api + '/scene/tag/tag_count/',
  removeTagApi: api + '/scene/tag/remove/',
  changeTagApi: api + '/scene/tag/change/',
  cleancacheApi: api + '/scene/cache_clean',
  snippetAddApi: api + '/scene/tag/snippet/add',
  onlineApi: api + '/skieernlpweb/api/sceneMiningOnline',
  getTasksListApi: api + '/scene/task/list',
  addMemberApi: api + '/scene/task/add_member',
  deleteMemberApi: api + '/scene/task/delete_member',
  getMembersApi: api + '/scene/task/members',
  getCountSnippetApi: api + '/scene/task/count_snippet',
  getCountTagApi: api + '/scene/task/count_tag'
}

class SceneMiningServer {
  /**
   * 获取所有任务信息，如果params带有tid则只获取tid信息
   * @param params
   * @returns
   */
  static getStates(params: any) {
    return request({
      url: taskApi.statesApi,
      method: 'GET',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 创建或保存项目
   * @param data
   * @returns
   */
  static save(data: any) {
    return request({
      url: taskApi.saveApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 创建流程
   * @param data
   * @returns
   */
  static process(data: any) {
    return request({
      url: taskApi.processApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 修改流程
   * @param data
   * @returns
   */
  static changeProcess(data: any) {
    return request({
      url: taskApi.processChangeApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 新增项目版本
   * @param data
   * @returns
   */
  static addVersion(data: any) {
    return request({
      url: taskApi.addVersionApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 上传文件
   * @param data
   * @returns
   */
  static upload(data: any) {
    return request({
      url: taskApi.uploadFileApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 删除文件
   * @param data
   * @returns
   */
  static removeFile(tid: string, folder: string, filename: string) {
    return request({
      url: taskApi.removeFileApi + `${tid}/${folder}/${filename}`,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 下载文件
   * @param data
   * @returns
   */
  static downloadFile(tid: string, folder: string, filename: string) {
    return request({
      url: taskApi.downloadFileApi + `${tid}/${folder}/${filename}`,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 下载场景挖掘标签
   * @param data
   * @returns
   */
  static uploadTag(data: any) {
    return request({
      url: taskApi.uploadTagApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 上传相似度结果
   * @param data
   * @returns
   */
  static uploadSimilar(data: any) {
    return request({
      url: taskApi.uploadSimilarApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 添加标签
   * @param data
   * @returns
   */
  static addSceneTag(data: any) {
    return request({
      url: taskApi.AddSceneTagApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 上一页
   * @param data
   * @returns
   */
  static prev(data: any) {
    return request({
      url: taskApi.prevApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  /**
   * 下一页
   * @param data
   * @returns
   */
  static next(data: any) {
    return request({
      url: taskApi.nextApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 添加标签
   * @param data
   * @returns
   */
  static addTag(data: any) {
    return request({
      url: taskApi.addTagApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 删除标签
   * @param data
   * @returns
   */
  static delTag(data: any) {
    return request({
      url: taskApi.delTagApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 检查标签
   * @param tid
   * @returns
   */
  static checkTag(tid: string) {
    return request({
      url: taskApi.checkTagApi + tid,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 复用标签
   * @param tid
   * @returns
   */
  static copyTag(tid: string, data: any) {
    return request({
      url: taskApi.copyTagApi + tid,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 设置线上版本
   * @param tid
   * @returns
   */
  static setOnlineVersion(tid: string) {
    return request({
      url: taskApi.setOnlineVersionApi + tid,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 统计标签数量
   * @param tid
   * @returns
   */
  static tagCount(tid: string, data: any) {
    return request({
      url: taskApi.tagCountApi + tid,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 删除标签规则
   * @param tid
   * @returns
   */
  static removeTag(tid: string, data: any) {
    return request({
      url: taskApi.removeTagApi + tid,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 更新标签名称
   * @param tid
   * @returns
   */
  static changeTag(tid: string, data: any) {
    return request({
      url: taskApi.changeTagApi + tid,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 手动清除缓存
   * @returns
   */
  static cleanCacheTag() {
    return request({
      url: taskApi.cleancacheApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 新增一个片段以及标签
   * @returns
   */
  static snippetAdd(data: any) {
    return request({
      url: taskApi.snippetAddApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 发起上线/下线请求
   * @returns
   */
  static online(data: any) {
    return request({
      url: taskApi.onlineApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 根据权限获取任务列表
   * @returns
   */
  static getTasks(params: any) {
    return request({
      url: taskApi.getTasksListApi,
      method: 'GET',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 新增一个标注人员
   * @returns
   */
  static addMember(data: any) {
    return request({
      url: taskApi.addMemberApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 删除一个标注人员
   * @returns
   */
  static deleteMember(data: any) {
    return request({
      url: taskApi.deleteMemberApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 获取任务下的标注人员
   * @returns
   */
  static getMembers(data: any) {
    return request({
      url: taskApi.getMembersApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 获取任务snippet数量以及带tag的snippet数量
   * @returns
   */
  static countSnippet(params: any) {
    return request({
      url: taskApi.getCountSnippetApi,
      method: 'GET',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * 统计指标标注数量
   * @returns
   */
  static countTag(params: any) {
    return request({
      url: taskApi.getCountTagApi,
      method: 'GET',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}

export default SceneMiningServer
