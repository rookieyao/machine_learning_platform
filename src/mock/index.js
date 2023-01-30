/**
 * @description register mock data right here
 */
import { P } from '@antv/g2plot'
import Mock, { mock } from 'mockjs'
// 设置拦截请求的响应时间 ajax 请求；
Mock.setup({
  timeout: '0-100'
})

var index = 0
var index2 = 0
var random = Mock.Random
random.extend({
  userName: function () {
    const userNames = ['wuqingsen', 'lvbowen', 'yaoqi']
    return this.pick(userNames)
  },
  originDataProject: function () {
    const originDataProject = ['科沃斯', '石头', '追觅', '必胜']
    return this.pick(originDataProject)
  },
  originDataPlatform: function () {
    const originDataPlatforms = ['天猫', '京东', '抖音', '微博']
    return this.pick(originDataPlatforms)
  },
  originDataNmae: function () {
    index += 1
    return `${this.originDataProject()}-${this.originDataPlatform()}-${index}`
  },
  filePath: function () {
    return '/data/' + this.guid() + '.txt'
  },
  index2: function () {
    index2 += 1
    return `1500000000000000${String('0'.repeat(3) + index2).slice(-3)}`
  },
  originDataList: function (val) {
    const a = {}
    a[`list|${val}`] = [
      {
        id: '@index2',
        userId: '666',
        originDataName: function () {
          return `${Mock.mock('@originDataProject')}-${this.dataSource}-${random.increment()}`
        },
        originDataDirectoryPath: '@filePath',
        originFlieSize: '@float(100,20480,0,2)',
        originFileLineNum: '@integer(1,100000)',
        dataSource: '@originDataPlatform',
        language: '@integer(1,2)',
        processState: '@integer(1,3)',
        cleanedFilePath: function () {
          if (this.processState === 2) {
            return this.originDataDirectoryPath
          } else {
            return null
          }
        },
        creator: '@userName',
        createTime: '2022-05-26T08:24:22.000+00:00',
        updateTime: '2022-05-26T08:24:22.000+00:00',
        updator: null,
        remark: '@cparagraph(1)',
        isDeleted: 0
      }
    ]
    return Mock.mock(a).list
  },
  charWordVectorList: function (val) {
    const a = {}
    a[`list|${val}`] = [
      {
        id: '@index2',
        userId: '666',
        charWordVectorName: function () {
          return `${Mock.mock('@originDataProject')}-${Mock.mock('@originDataPlatform')}-${random.increment()}`
        },
        originDataNameList: ['VIVO', '科沃斯'],
        processState: '@integer(1,3)',
        currentStage: '1(清洗)-3',
        latestData: function () {
          if (this.processState === 2) {
            return 'N'
          } else {
            return ''
          }
        },
        vectorDimension: 1,
        windowSize: 3,
        minWordFrequency: 2,
        vectorType: '11',
        creator: '@userName',
        createTime: '2022-05-26T08:24:22.000+00:00',
        remark: '@cparagraph(1)',
        isDeleted: 0
      }
    ]
    return Mock.mock(a).list
  },
  trainDataList: function (val) {
    const a = {}
    a[`list|${val}`] = [
      {
        id: '@index2',
        trainDataId: '1',
        dataSetName: '数据集@increment',
        labelTaskList: [{ labelTaskId: '62a14c15093b9520fa0fa73e', labelTaskType: '8086' }],
        projectType: '@integer(1,2)',
        dataType: function () {
          if (this.projectType === 1) {
            return Mock.Random.pick(['aspect,sentiment', 'aspect', 'sentiment'])
          } else {
            return Mock.Random.pick(['intent,focus', 'intent', 'focus'])
          }
        },
        labelLanguage: '@integer(1,2)',
        importState: '@integer(1,3)',
        dataSetVersion: '220527',
        dataSetVersionName: 'test1:220527',
        creator: '@userName',
        createTime: '2022-05-26T08:24:22.000+00:00',
        remark: '@cparagraph(1)',
        isDeleted: 0
      }
    ]
    return Mock.mock(a).list
  }
})
const originDataRes = (value) => {
  const filter = JSON.parse(value.body)
  return Mock.mock({
    status: 200,
    message: '操作成功',
    data: {
      pageNum: filter.pageNum,
      pageSize: filter.pageSize,
      orderBy: null,
      startRow: 0,
      endRow: 0,
      total: 100,
      pages: function () {
        return this.total / this.pageSize
      },

      list: `@originDataList(${filter.pageSize})`,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      firstPage: 1,
      lastPage: 1
    }
  })
}

Mock.mock('/mock/skieernlpweb/originData/listPage', 'post', originDataRes)

Mock.mock('/mock/skieernlpweb/pipelineFileConfig/listAll', 'post', () => {
  var number = 0
  return Mock.mock({
    status: 200,
    messgae: '操作成功',
    'data|10': [
      {
        id: function () {
          number += 1
          return number.toString()
        },
        pipelineName: function () {
          return `流水线-${number}`
        },
        pipelineFilePath: function () {
          return `/mnt/volumn/nlp/test-${number}.yaml`
        },
        remark: '测试'
      }
    ]
  })
})
var index3 = 0
const getindex3 = () => {
  index3 += 1
  return `1500000000000000${String('0'.repeat(3) + index3).slice(-3)}`
}

const charWordVectorRes = (value) => {
  const filter = JSON.parse(value.body)
  return Mock.mock({
    status: 200,
    message: '操作成功',
    data: {
      pageNum: filter.pageNum,
      pageSize: filter.pageSize,
      orderBy: null,
      startRow: 0,
      endRow: 0,
      total: 100,
      pages: function () {
        return this.total / this.pageSize
      },
      list: `@charWordVectorList(${filter.pageSize})`,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      firstPage: 1,
      lastPage: 1
    }
  })
}

/**原始数据 */
Mock.mock('/mock/skieernlpweb/originData/add', 'post', (req) => {
  console.log('/mock/skieernlpweb/originData/add')
  console.log(req)
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})

Mock.mock('/mock/skieernlpweb/originData/listAll', 'post', (req) => {
  console.log('/mock/skieernlpweb/originData/listAll')
  console.log(req)
  return Mock.mock({ status: 200, message: '操作成功', 'data|100': [{ id: getindex3, originDataName: '@originDataNmae' }] })
})

Mock.mock('/mock/skieernlpweb/originData/previewSyncInfo', 'post', (req) => {
  console.log('/mock/skieernlpweb/originData/previewSyncInfo')
  console.log(req)
  return Mock.mock({
    status: 200,
    message: '7f07c26e5c74482c863948e53cd6c010',
    data: {
      pageNum: 1,
      pageSize: 9,
      size: 10,
      orderBy: null,
      startRow: 0,
      endRow: 9,
      total: 4000,
      pages: 2,
      'list|100': ['@cparagraph(1,4)'],
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      lastPage: 1,
      firstPage: 1
    }
  })
})

Mock.mock('/mock/skieernlpweb/originData/previewSyncInfo/listPage', 'post', (req) => {
  console.log('/mock/skieernlpweb/originData/previewSyncInfo/listPage')
  console.log(req)
  return Mock.mock({
    status: 200,
    message: '7f07c26e5c74482c863948e53cd6c010',
    'data|100': ['@cparagraph(1,4)']
  })
})

Mock.mock('/mock/skieernlpweb/originData/syncDataToLabel', 'post', (req) => {
  console.log('/mock/skieernlpweb/originData/syncDataToLabel')
  console.log(req)
  return { status: 200, message: '操作成功', data: null }
})
Mock.mock(/\/mock\/skieernlpweb\/originData\/deleteById\/.*/, 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
/**字词向量管理 */
Mock.mock('/mock/skieernlpweb/charWordVector/listPage', 'post', charWordVectorRes)
Mock.mock('/mock/skieernlpweb/charWordVector/add', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/charWordVector/listAll', 'post', () => {
  var number = 0
  return Mock.mock({
    status: 200,
    message: '操作成功',
    'data|10': [
      {
        id: function () {
          number += 1
          return number.toString()
        },
        charWordVectorName: function () {
          return `字词向量-${number}`
        },
        latestData: function () {
          return Mock.Random.pick(['1', '0'])
        }
      }
    ]
  })
})
Mock.mock(/\/mock\/skieernlpweb\/charWordVector\/deleteById\/.*/, 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/charWordVector/manualUpdate', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
/**训练数据管理 */
const trainDataRes = (value) => {
  const filter = JSON.parse(value.body)
  return Mock.mock({
    status: 200,
    message: '操作成功',
    filter: filter,
    data: {
      pageNum: filter.pageNum,
      pageSize: filter.pageSize,
      orderBy: null,
      startRow: 0,
      endRow: 0,
      total: 100,
      pages: function () {
        return this.total / this.pageSize
      },

      list: `@trainDataList(${filter.pageSize})`,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      firstPage: 1,
      lastPage: 1
    }
  })
}
Mock.mock('/mock/skieernlpweb/trainData/listPage', 'post', trainDataRes)

Mock.mock(/\/mock\/skieernlpweb\/trainData\/getTrainVersionDataListByTrainDataId\/.*/, 'get', (value) => {
  const val = JSON.parse(value.body)
  console.log(value)
  return Mock.mock({
    status: 200,
    message: '操作成功',
    'data|1-5': [
      {
        trainDataId: '1',
        dataSetName: '',
        projectType: '',
        dataType: function () {
          if (this.projectType === 1) {
            return Mock.Random.pick(['aspect,sentiment', 'aspect', 'sentiment'])
          } else {
            return Mock.Random.pick(['intent,focus', 'intent', 'focus'])
          }
        },
        labelLanguage: '',
        importState: '@integer(2,3)',
        dataSetVersion: '22052@integer(1,9)',
        dataSetVersionName: 'test1:220527',
        creator: '@userName',
        createTime: '2022-05-26T08:24:22.000+00:00',
        remark: '@cparagraph(1)',
        isDeleted: 0
      }
    ]
  })
})
Mock.mock('/mock/skieernlpweb/trainData/importDataSet', 'post', (val) => {
  console.log('/mock/skieernlpweb/trainData/importDataSet')
  console.log(val)
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/trainData/listAll', 'post', () => {
  var number = 0
  const data = Mock.mock({
    status: 200,
    message: '操作成功',
    'data|10': [
      {
        id: function () {
          return number.toString()
        },
        dataSetName: function () {
          number += 1
          return '测试集-' + number
        },
        dataSetVersion: '220527',
        dataSetVersionName: function () {},
        projectType: '@natural(1,2)',
        dataType: function () {
          if (this.projectType === 1) {
            return Mock.Random.pick(['aspect,sentiment', 'aspect', 'sentiment'])
          } else {
            return Mock.Random.pick(['intent,focus', 'intent', 'focus'])
          }
        },
        labelLanguage: '@natural(1,2)'
      }
    ]
  })
  return data
})
Mock.mock(/\/mock\/skieernlpweb\/trainData\/deleteById\/.*/, 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
/**训练管理 */
const trainModelData = (value) => {
  const val = JSON.parse(value.body)
  const data = {}
  var number = 0
  data[`list|${val.pageSize}`] = [
    {
      id: function () {
        number += 1
        return number.toString()
      },
      trainModelVersionId: 4,
      projectName: function () {
        number += 1
        return '项目名称-' + (number + (val.pageNum - 1) * 10)
      },
      projectType: '@natural(1,2)',
      modelType: function () {
        return Mock.Random.pick(['aspect', 'sentiment', 'intent', 'focus'])
      },
      trainModelVersion: '22050@natural(1,9)',
      charWordVectorName: function () {
        return '字词向量-' + (number + (val.pageNum - 1) * 10)
      },
      dataSetVersionName: function () {
        return `test${number + (val.pageNum - 1) * 10}:2205${number}`
      },
      modelState: function () {
        return Mock.Random.pick([-1, 1, 2, 3])
      },
      trainStartTime: null,
      trainPercent: function () {
        if (this.modelState === 1) {
          return Mock.Random.natural(1, 99)
        }
        if (this.modelState === 2) {
          return '100'
        } else {
          return '0'
        }
      },
      modelAssesmentInfo: null,
      trainErrorLog: null,
      creator: '@userName',
      createTime: '2022-05-31T03:19:39.000+00:00'
    }
  ]
  const list = Mock.mock(data).list
  return Mock.mock({
    status: 200,
    message: '操作成功',
    data: {
      pageNum: val.pageNum,
      pageSize: val.pageSize,
      size: 4,
      orderBy: null,
      startRow: 0,
      endRow: 3,
      total: 100,
      pages: function () {
        return this.total / this.pageSize
      },
      list: list,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      firstPage: 1,
      lastPage: 1
    }
  })
}
Mock.mock('/mock/skieernlpweb/trainModel/listPage', 'post', trainModelData)
Mock.mock(/\/mock\/skieernlpweb\/trainData\/getById\/.*/, 'get', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock(/\/mock\/skieernlpweb\/trainModel\/deleteById\/.*/, 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/trainModel/insertTrainModelVersion', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/trainModel/startTrain', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/trainModel/reStartTrain', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/trainModel/listUniqueProjectName', 'get', () => {
  return Mock.mock({
    status: 200,
    message: '操作成功',
    'data|10': [
      {
        id: '1',
        projectName: '项目@increment()'
      }
    ]
  })
})
Mock.mock(/\/mock\/skieernlpweb\/trainModel\/listModelInfoByProjectName\?.*/, 'post', () => {
  var number = 0
  return Mock.mock({
    status: 200,
    message: '操作成功',
    'data|3': [
      {
        // id: function () {
        //   number += 1
        //   return number.toString()
        // },
        projectType: function () {
          return Mock.Random.pick(['1', '2'])
        },
        modelType: function () {
          if (this.projectType === '1') {
            return Mock.Random.pick(['aspect', 'sentiment'])
          } else {
            return Mock.Random.pick(['intent', 'focus'])
          }
        },
        trainModelVersion: function () {
          return '0000' + number.toString()
        }
      }
    ]
  })
})
/**模型管理 */
const projectServiceData = (value) => {
  const val = JSON.parse(value.body)
  console.log(val)
  const data = {}
  var number = 0
  data[`list|${val.pageSize}`] = [
    {
      id: function () {
        number += 1
        return val.pageNum * val.pageSize + number
      },
      userId: '666',
      projectServiceId: function () {
        return val.pageNum * val.pageSize + number
      },
      serviceName: function () {
        return '服务名称-' + (number + (val.pageNum - 1) * 10)
      },
      serviceVersion: '22050@natural(1,9)',
      trainModelVersion: '',
      projectName: function () {
        return '项目名称-' + (number + (val.pageNum - 1) * 10)
      },
      dataSetVersionName: function () {
        return `test${number + (val.pageNum - 1) * 10}:2205${number}`
      },
      projectType: '@natural(1,2)',
      serviceState: function () {
        return Mock.Random.pick([1, 2, 3, 4, 5, 6, 7, 8])
      },
      modelAssesmentInfo: null,
      trainErrorLog: null,
      creator: '@userName',
      createTime: '2022-05-31T03:19:39.000+00:00',
      remark: '@cparagraph(1)'
    }
  ]
  const list = Mock.mock(data).list
  return Mock.mock({
    status: 200,
    message: '操作成功',
    data: {
      pageNum: val.pageNum,
      pageSize: val.pageSize,
      size: 4,
      orderBy: null,
      startRow: 0,
      endRow: 3,
      total: 100,
      pages: function () {
        return this.total / this.pageSize
      },
      list: list,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      firstPage: 1,
      lastPage: 1
    }
  })
}
Mock.mock('/mock/skieernlpweb/projectService/listPage', 'post', projectServiceData)
Mock.mock('/mock/skieernlpweb/projectService/online', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/projectService/offline', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock(/\/mock\/skieernlpweb\/projectService\/deleteById\/.*/, 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})
Mock.mock('/mock/skieernlpweb/projectService/addService', 'post', () => {
  return {
    status: 200,
    message: '操作成功',
    data: null
  }
})

Mock.mock('/mock/task/list?default_database=ann', 'get', () => {
  return {
    status: 200,
    message: '操作成功',
    data: [
      { _id: '6200c862b1a85fcb5d843b17', name: '测试' },
      { _id: '6200cdcdb1a85fcb5d843b1a', name: '测试2' }
    ]
  }
})
Mock.mock('/mock/task/list?default_database=ann_online', 'get', () => {
  return {
    status: 200,
    message: '操作成功',
    data: [
      { _id: '6200c862b1a85fcb5d843b17', name: '测试' },
      { _id: '6200cdcdb1a85fcb5d843b1a', name: '测试2' }
    ]
  }
})

/**审核管理 */
Mock.mock('/mock/skieernlpweb/projectServiceVersionApproving/listPage', 'post', (value) => {
  var number = 0
  const val = JSON.parse(value.body)
  const data = {}
  data[`list|${val.pageSize}`] = [
    {
      id: function () {
        number += 1
        return val.pageNum * val.pageSize + number
      },
      projectServiceVersionId: function () {
        return val.pageNum * val.pageSize + number
      },
      serviceName: function () {
        return '服务名称-' + (number + (val.pageNum - 1) * 10)
      },
      serviceVersion: '22050@natural(1,9)',
      approveState: function () {
        return Mock.Random.pick(['1', '2', '3'])
      },
      approver: function () {
        if (this.approveState !== '1') {
          return Mock.mock('@userName')
        } else {
          return ''
        }
      },
      approveTime: '',

      operationType: function () {
        return Mock.Random.pick(['1', '2'])
      },
      // projectType: '@natural(1,2)',
      // serviceState: function () {
      //   return Mock.Random.pick([1, 2, 3, 4, 5, 6, 7, 8])
      // },
      creator: '@userName',
      createTime: '2022-05-31T03:19:39.000+00:00',
      remark: '@cparagraph(1)'
    }
  ]
  const list = Mock.mock(data).list
  return {
    status: 200,
    message: '操作成功',
    data: {
      pageNum: val.pageNum,
      pageSize: val.pageSize,
      size: 4,
      orderBy: null,
      startRow: 0,
      endRow: 3,
      total: 100,
      pages: function () {
        return this.total / this.pageSize
      },
      list: list,
      prePage: 0,
      nextPage: 0,
      isFirstPage: true,
      isLastPage: true,
      hasPreviousPage: false,
      hasNextPage: false,
      navigatePages: 8,
      navigatepageNums: [1],
      navigateFirstPage: 1,
      navigateLastPage: 1,
      firstPage: 1,
      lastPage: 1
    }
  }
})
