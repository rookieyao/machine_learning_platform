import request from '@/utils/request'

const api = '/api'
const evaluateApi = {
  reportApi: api + '/alice/evaluate/report',
  datasetApi: api + '/alice/evaluate/dataset',
  gettagApi: api + '/alice/evaluate/gettag',
  viewedApi: api + '/alice/evaluate/viewed',
  erconfigApi: api + '/alice/evaluate/erconfig',
  listApi: api + '/alice/evaluate/list',
  noteApi: api + '/alice/evaluate/note'
}

class evaluateService {
  //获取报告
  static getReport(data: any) {
    return request({
      url: evaluateApi.reportApi,
      method: 'post',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 获取dataset数据
  static getDataset(data: any) {
    return request({
      url: evaluateApi.datasetApi,
      method: 'post',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 获取单条数据结果
  static getTag(data: any) {
    return request({
      url: evaluateApi.gettagApi,
      method: 'post',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 设置数据为已查看
  static setViewed(params: any) {
    return request({
      url: evaluateApi.viewedApi,
      method: 'post',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 查看标注任务的配置信息
  static erConfig(data: any) {
    return request({
      url: evaluateApi.erconfigApi,
      method: 'post',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 获取标注任务下的评估报告
  static evaluateList(params: any) {
    return request({
      url: evaluateApi.listApi,
      method: 'get',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 更新评估报告备注信息
  static updateEvaluateNote(data: any) {
    return request({
      url: evaluateApi.noteApi,
      method: 'post',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default evaluateService
