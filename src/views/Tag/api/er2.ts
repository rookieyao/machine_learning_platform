import request from '@/utils/request'
import { ElMessage } from 'element-plus'

class er2Service {
  // 获取一条标注结果
  static getOneTag(tid: string, params: any) {
    //params:{'did':''}
    return request({
      url: '/api/alice/er/' + tid + '/one',
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
  // 保存一条标注数据
  static saveOneTag(tid: string, params: any, data: any) {
    return request({
      url: '/api/alice/er/' + tid + '/save',
      method: 'POST',
      json: true,
      data: data,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 获取任务信息
  static getOneTask(tid: string) {
    return request({
      url: '/api/alice/task/' + tid + '/',
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 获取上一条
  static getPrev(tid: string, params: any) {
    //params:index:int
    return request({
      url: '/api/alice/er/' + tid + '/prev',
      method: 'GET',
      json: true,
      params: params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 获取下一条
  static getNext(tid: string, params: any) {
    //params:index:int
    return request({
      url: '/api/alice/er/' + tid + '/next',
      method: 'GET',
      json: true,
      params: params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 设置灌水
  static setSpam(tid: string, did: string, spam: string) {
    return request({
      url: '/api/alice/er/' + tid + '/spam/' + did + '/' + spam.toString(),
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 设置奇怪
  static setSpecial(tid: string, did: string, special: string) {
    return request({
      url: '/api/alice/er/' + tid + '/special/' + did + '/' + special.toString(),
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 设置插眼
  static setTimeFlag(tid: string, did: string, time_flag: string) {
    return request({
      url: '/api/alice/er/' + tid + '/time_flag/' + did + '/' + time_flag.toString(),
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 标记审阅意见
  static addReview(tid: string, did: string, data: any) {
    // data = {
    //   "msg": "漏标分类",
    //   "targer": {
    //     "id": -1,
    //     "begin": 8,
    //     "end": 11,
    //     "tag": "噪音大小",
    //     "text": "声音挺大"
    //   }
    // }
    return request({
      url: '/api/alice/er/' + tid + '/review/' + did,
      method: 'POST',
      json: true,
      data: data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 删除一条审阅意见
  static removeReview(tid: string, did: string, rid: string) {
    return request({
      url: '/api/alice/er/' + tid + '/review/' + did + '/remove/' + rid,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 查询标注数据
  static searchTag(tid: string, params: any, data: any) {
    return request({
      url: '/api/alice/er/' + tid + '/search_tag',
      method: 'POST',
      json: true,
      params: params,
      data: data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  // 查询标注数据-多个标签查询
  static searchTags(tid: string, params: any, data: any) {
    return request({
      url: '/api/alice/er/' + tid + '/search_tags',
      method: 'POST',
      json: true,
      params: params,
      data: data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      ElMessage.error(res.msg)
      return Promise.reject(res)
    })
  }
  // 质量小助手查询
  static checkQuality(tid: string) {
    return request({
      url: '/api/alice/er/' + tid + '/check_quality',
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 审阅统计
  static countReview(tid: string) {
    return request({
      url: '/api/alice/er/' + tid + '/count_review',
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 取消需审阅状态
  static cancelReview(tid: string, did: string) {
    return request({
      url: '/api/alice/er/' + tid + '/modify/' + did,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  // 相似推荐查询
  static trinitySearch(data: any) {
    return request({
      url: '/api/alice/trinitySearch/search',
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
  // 插入相似推荐数据-整个标注任务
  static trinityInsertByTid(data: any) {
    return request({
      url: '/api/alice/trinitySearch/insert/task',
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
  // 插入相似推荐数据-当条标注数据多个文本
  static trinityInsertByTexts(data: any) {
    return request({
      url: '/api/alice/trinitySearch/insert/texts',
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
  // 插入相似推荐数据-通过文件上传
  static trinitInsertByTxt(data: any) {
    return request({
      url: '/api/alice/trinitySearch/insert/txt',
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
  // 统计指标数量
  static countTag(tid: string, data: any) {
    return request({
      url: '/api/alice/er/' + tid + '/count_tag',
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
  // 批量修改指标
  static change(tid: string, data: any) {
    return request({
      url: '/api/alice/er/' + tid + '/change',
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
  // 批量删除指标
  static deleteTag(tid: string, data: any) {
    return request({
      url: '/api/alice/er/' + tid + '/delete_tag',
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
  // 查询相似推荐异常结果
  static searchCheckSimilar(data: any) {
    return request({
      url: '/api/alice/trinitySearch/check_similar/search',
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
  // 质量小助手检查标注差异数据-相似检查
  static checkSimilar(data: any) {
    return request({
      url: '/api/alice/trinitySearch/check_similar',
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

export default er2Service
