import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const api = '/api'
const demoApi = {
  sceneMiningApi: api + '/tools/demo/scene/one',
  sceneMiningCleanCacheApi: api + '/tools/demo/scene/clean',
  sceneMiningTagsApi: api + '/tools/demo/scene/tags',
  sceneMiningAddApi: api + '/tools/demo/scene/add',
  sceneMiningDeleteApi: api + '/tools/demo/scene/delete',
  nerOneApi: api + '/tools/demo/ner/one'
}
const skieernlpweb = {
  listServiceVersionInfo: api + '/skieernlpweb/projectService/listServiceVersionInfo',
  requestToModelService: api + '/skieernlpweb/api/requestToModelService'
}

class demoService {
  /**
   * 获取场景挖掘结果
   * @returns
   */
  static sceneMining(data: any) {
    return request({
      url: demoApi.sceneMiningApi,
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
   * 清除场景挖掘项目缓存
   * @returns
   */
  static sceneMiningCleanCache(data: any) {
    return request({
      url: demoApi.sceneMiningCleanCacheApi,
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
   * 获取所有的场景标签中英文配置
   * @returns
   */
  static sceneMiningTags() {
    return request({
      url: demoApi.sceneMiningTagsApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**新增场景标签中英文配置 */
  static sceneMiningAdd(data: { en: string; zh: string }) {
    return request({
      url: demoApi.sceneMiningAddApi,
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
  /**删除场景标签中英文配置 */
  static sceneMiningDelele(data: { en: string }) {
    return request({
      url: demoApi.sceneMiningDeleteApi,
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
  /**删除场景标签中英文配置 */
  static async nerOne(data: any) {
    return request({
      url: demoApi.nerOneApi,
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
  /**返回所有服务信息无请求参数 */
  static async listServiceVersionInfo() {
    return request({
      url: skieernlpweb.listServiceVersionInfo,
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
  /**模型预测接口*/
  static async requestToModelService(data: any) {
    return request({
      url: skieernlpweb.requestToModelService,
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
}

export default demoService
