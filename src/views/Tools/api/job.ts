import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const api = '/api'
const jobApi = {
  getJobApi: api + '/tools/job/job',
  uploadApi: api + '/tools/job/upload',
  restartJobApi: api + '/tools/job/restart',
  downloadApi: api + '/tools/job/download/',
  exportTypeApi: api + '/tools/job/export/type',
  exportJobApi: api + '/tools/job/export/job',
  exportMongoApi: api + '/tools/job/export/mongo',
  exportUploadApi: api + '/tools/job/export/upload'
}

class JobService {
  /**
   * 获取所有任务信息
   * @returns
   */
  static getJobs(data: any) {
    return request({
      url: jobApi.getJobApi,
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
   * 获取所有任务信息
   * @returns
   */
  static uploadJob(data: any) {
    return request({
      url: jobApi.uploadApi,
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
   * 获取支持的导出类型
   * @returns
   */
  static exportType() {
    return request({
      url: jobApi.exportTypeApi,
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
   * 获取支持的导出类型
   * @returns
   */
  static exportJob(params: any) {
    return request({
      url: jobApi.exportJobApi,
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
   * 创建一个导出mongo数据任务
   * @returns
   */
  static exportMongo(data: any) {
    return request({
      url: jobApi.exportMongoApi,
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
   * 创建一个上传文件导出任务
   * @returns
   */
  static exportUpload(data: any) {
    return request({
      url: jobApi.exportUploadApi,
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
   * 创建一个上传文件导出任务
   * @returns
   */
  static restart(data: any) {
    return request({
      url: jobApi.restartJobApi,
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

export { JobService, jobApi }
