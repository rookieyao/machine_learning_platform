import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const taskApi = {
  getTasks: '/api/alice/task/all',
  getTaskTags: '/api/alice/task/tags',
  updateAnnotationTypeApi: '/api/alice/task/annotation_type'
}

class taskService {
  static allTask(params: any) {
    return request({
      url: taskApi.getTasks,
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
  static taskTag() {
    return request({
      url: taskApi.getTaskTags,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static save(tid: string, data: any) {
    return request({
      url: '/api/alice/task/' + tid + '/save',
      method: 'POST',
      json: true,
      data: data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  static delete(tid: string) {
    return request({
      url: '/api/alice/task/' + tid + '/delete',
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static get_members(tid: string) {
    return request({
      url: '/api/alice/task/' + tid + '/members',
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static add_member(tid: string, data: any) {
    return request({
      url: '/api/alice/task/' + tid + '/add_member',
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
  static delete_member(tid: string, data: any) {
    return request({
      url: '/api/alice/task/' + tid + '/delete_member',
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
  static stask_data(tid: string) {
    // 显示当前任务前十条数据
    return request({
      url: '/api/alice/task/' + tid + '/task_data',
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static pull_data(tid: string, data: any) {
    // 显示当前任务前十条数据
    return request({
      url: '/api/alice/task/' + tid + '/uploadfile',
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
  static set_top(tid: string, top: string) {
    return request({
      url: '/api/alice/task/' + tid + '/set_top/' + top,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static getSearchProject(params: any) {
    return request({
      url: '/api/alice/trinitySearch/one',
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
  static updateAnnotationType(data: any) {
    return request({
      url: taskApi.updateAnnotationTypeApi,
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
}

export default taskService
