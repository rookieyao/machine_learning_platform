import request from '@/utils/request'

const tagApi = {
  getUser: '/api/alice/task/usernames',
  getTasks: '/api/skieernlpweb/api/alice/task/list',
  daysWorks: '/api/alice/daysworks',
  reviewScore: '/api/alice/reviewscore',
  tagLogs: '/api/alice/taglogs',
  uplaodFileShow: '/api/alice/uploadfileshow',
  queryUser: '/api/alice/task/user/queryuser',
  updataUser: '/api/alice/task/user/eidt',
  getJobApi: '/api/tools/datajob/joblist/',
  exportApi: '/api/tools/datajob/export',
  restartApi: '/api/tools/datajob/restart',
  downloadApi: '/api/tools/datajob/download/'
}

class indexService {
  static getUsernames(params: any) {
    return request({
      url: tagApi.getUser,
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
  static getTasks(params: any) {
    return request({
      url: tagApi.getTasks,
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
  static getDaysCount(data: any) {
    return request({
      url: tagApi.daysWorks,
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
  static getTagLog(params: any) {
    return request({
      url: tagApi.tagLogs,
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
  static uploadFileShow(data: any) {
    return request({
      url: tagApi.uplaodFileShow,
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
  static queryUser(data: any) {
    return request({
      url: tagApi.queryUser,
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
  static updataUser(data: any) {
    return request({
      url: tagApi.updataUser,
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
  /**查询审阅统计 */
  static getReviewScore(data: any) {
    return request({
      url: tagApi.reviewScore,
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
  /**获取某个标注任务下最近的5个ob */
  static getJob(tid: string) {
    return request({
      url: tagApi.getJobApi + tid,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**创建一个导出数据任务 */
  static exportJob(data: any) {
    return request({
      url: tagApi.exportApi,
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
  /**重置启动一个导出数据任务 */
  static restartJob(data: any) {
    return request({
      url: tagApi.restartApi,
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
  /**下载导出结果 */
  static downloadJob(filename: any) {
    return request({
      url: tagApi.downloadApi + filename,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default indexService
