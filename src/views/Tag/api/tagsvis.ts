import request from '@/utils/request'

class tagsvisService {
  //获取指标统计
  static getTagCount(tid: string) {
    return request({
      url: '/api/alice/task/' + tid + '/tagcount',
      method: 'get',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 统计标注数据的文本长度
  static getLengthCount(tid: string) {
    return request({
      url: '/api/alice/task/' + tid + '/lengthcount',
      method: 'get',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 统计标注关系数量
  static getRelationsCount(tid: string) {
    return request({
      url: '/api/alice/task/' + tid + '/relationcount',
      method: 'get',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}

export default tagsvisService
