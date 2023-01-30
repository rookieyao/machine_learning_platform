import request from '@/utils/request'
import {
  originDataListPageReq,
  trainModelListPageReq,
  charWordVectorListPageReq,
  charWordVectorAddReq,
  originDataPreviewSyncInfoListPageReq,
  charWordVectorUpdateByIdReq,
  trainDataListPageReq,
  trainModelStartTrainReq,
  trainModelInsertTrainModelVersionReq,
  charWordVectorManualUpdateReq,
  projectServiceListPageReq,
  projectServiceOnlineReq,
  projectServiceAddServiceReq,
  trainModelListModelInfoByProjectNameReq,
  fileDownloadReq,
  approveListPageReq,
  approveSubmitReq,
  projectServiceOperateProjectServiceReq,
  projectServiceFullEvaluateReq,
  projectServiceServiceOnlineCheckReq,
  projectServiceStartEvaluateReq,
  projectServiceGetServiceVersionInfoByIdReq,
  projectServiceUpdateServiceVersion,
  originDataDoCleanReq
} from './types'

const api = '/api'
/**其他接口 */
const aiPlatformApi = {
  // 数据源下拉框接口
  pipelineFileConfigListAllApi: api + '/skieernlpweb/pipelineFileConfig/listAll',
  // minIO文件下载
  fileDownloadApi: api + '/skieernlpweb/common/file/download'
}

class aiPlatformService {
  static getPipeline() {
    return request({
      url: aiPlatformApi.pipelineFileConfigListAllApi,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static fileDownload(data: fileDownloadReq) {
    return request({
      url: aiPlatformApi.fileDownloadApi,
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
/**
 * 原始数据源管理
 */
const originDataApi = {
  // 原始数据管理-列表分页查询
  originDataListPageApi: api + '/skieernlpweb/originData/listPage',
  // 原始数据管理-用于查询所有原始数据记录
  originDataAllApi: api + '/skieernlpweb/originData/listAll',
  // 原始数据管理-原始数据查看
  originDataByIDApi: api + '/skieernlpweb/originData/getById/',
  // 原始数据管理-新增原始数据/追加原始数据文件
  originDataAddApi: api + '/skieernlpweb/originData/add',
  // 原始数据管理-原始数据同步预览接口
  originDataPreviewSyncInfoApi: api + '/skieernlpweb/originData/previewSyncInfo',
  // 原始数据管理-分页查询同步预览接口
  originDataPreviewSyncInfoListPageApi: api + '/skieernlpweb/originData/previewSyncInfo/listPage',
  // 原始数据管理-原始数据同步接口
  originDataSyncDataToLabel: api + '/skieernlpweb/originData/syncDataToLabel',
  // 原始数据管理-原始数据删除
  originDataDeleteByIdApi: api + '/skieernlpweb/originData/deleteById/',
  // 原始数据接口-手动执行数据清洗
  doCleanApi: api + '/skieernlpweb/originData/doClean'
}

class originDataService {
  /**原始数据管理-列表分页查询
   * @returns
   */
  static originDataListPage(data: originDataListPageReq) {
    return request({
      url: originDataApi.originDataListPageApi,
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
  /**原始数据管理-原始数据查看
   * @returns
   */
  static originDataById(id: string) {
    return request({
      url: originDataApi.originDataByIDApi + id,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**原始数据管理-新增原始数据/追加原始数据文件
   * @returns
   */
  static originDataAdd(data: FormData) {
    return request({
      url: originDataApi.originDataAddApi,
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
  /**原始数据管理-原始数据同步预览接口 */
  static originDataPreviewSyncInfo(data: FormData) {
    return request({
      url: originDataApi.originDataPreviewSyncInfoApi,
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
  /**原始数据管理-分页查询同步预览接口 */
  static originDataPreviewSyncInfoListPage(data: originDataPreviewSyncInfoListPageReq) {
    return request({
      url: originDataApi.originDataPreviewSyncInfoListPageApi,
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
  /**原始数据管理-原始数据同步预览接口 */
  static originDataSyncDataToLabel(data: FormData) {
    return request({
      url: originDataApi.originDataSyncDataToLabel,
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
  /**原始数据管理-所有的原始数据集
   * @returns
   */
  static getOriginDataAll() {
    return request({
      url: originDataApi.originDataAllApi,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**原始数据管理-原始数据删除
   * @returns
   */
  static originDataDeleteById(id: string) {
    return request({
      url: originDataApi.originDataDeleteByIdApi + id,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**原始数据管理-手动执行数据清洗
   * @returns
   */
  static doClean(data: originDataDoCleanReq) {
    return request({
      url: originDataApi.doCleanApi,
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

/**字词向量管理 */
const charWordVectorApi = {
  // 字词向量管理-列表分页查询
  charWordVectorListPageApi: api + '/skieernlpweb/charWordVector/listPage',
  // 字词向量管理-查询字词向量下拉列表
  charWordVectorListAllApi: api + '/skieernlpweb/charWordVector/listAll',
  // 字词向量管理-新增字词向量
  charWordVectorAddApi: api + '/skieernlpweb/charWordVector/add',
  // 字词向量管理-编辑字词向量
  charWordVectorUpdateByIdApi: api + '/skieernlpweb/charWordVector/updateById',
  // 字词向量管理-查看字词向量
  charWordVectorGetByIdApi: api + '/skieernlpweb/charWordVector/getById/',
  // 字词向量管理-字词向量删除接口
  charWordVectorDeleteByIdApi: api + '/skieernlpweb/charWordVector/deleteById/',
  // 字词向量管理-字词向量手动更新接口
  charWordVectorManualUpdateApi: api + '/skieernlpweb/charWordVector/manualUpdate'
}

class charWordVectorService {
  /**字词向量管理-列表分页查询
   * @returns
   */
  static charWordVectorListPage(data: charWordVectorListPageReq) {
    return request({
      url: charWordVectorApi.charWordVectorListPageApi,
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
  /**字词向量管理-查询字词向量下拉列表
   * @returns
   */
  static charWordVectorListAll() {
    return request({
      url: charWordVectorApi.charWordVectorListAllApi,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**字词向量管理-新增字词向量
   * @returns
   */
  static charWordVectorAdd(data: charWordVectorAddReq) {
    return request({
      url: charWordVectorApi.charWordVectorAddApi,
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
  /**字词向量管理-编辑字词向量
   * @returns
   */
  static charWordVectorUpdateById(data: charWordVectorUpdateByIdReq) {
    return request({
      url: charWordVectorApi.charWordVectorUpdateByIdApi,
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
  /**字词向量管理-查看字词向量
   * @returns
   */
  static charWordVectorgetById(id: string) {
    return request({
      url: charWordVectorApi.charWordVectorGetByIdApi + id,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**字词向量管理-字词向量删除接口
   * @returns
   */
  static charWordVectorDeleteById(id: string) {
    return request({
      url: charWordVectorApi.charWordVectorDeleteByIdApi + id,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**字词向量管理-字词向量删除接口
   * @returns
   */
  static charWordVectorManualUpdate(data: charWordVectorManualUpdateReq) {
    return request({
      url: charWordVectorApi.charWordVectorManualUpdateApi,
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

/**训练数据管理 */
const trainDataApi = {
  // 训练数据管理-列表分页查询
  trainDataListPageApi: api + '/skieernlpweb/trainData/listPage',
  // 训练数据管理-查询训练数据下拉列表
  trainDataListAllApi: api + '/skieernlpweb/trainData/listAll',
  // 训练数据管理-查看训练数据详情
  trainDataGetByIdApi: api + '/skieernlpweb/trainData/getById/',
  // 训练数据管理-查看训练数据版本列表(列表行点击请求接口)
  getTrainVersionDataListByTrainDataIdApi: api + '/skieernlpweb/trainData/getTrainVersionDataListByTrainDataId/',
  // 训练数据管理-导入数据集
  trainDataImportDataSetApi: api + '/skieernlpweb/trainData/importDataSet',
  // 训练数据管理-训练数据版本记录删除接口
  trainDataDeleteApi: api + '/skieernlpweb/trainData/deleteById/'
}

class trainDataService {
  /**
   * 训练数据管理-列表分页查询
   * @returns
   */
  static trainDataListPage(data: trainDataListPageReq) {
    return request({
      url: trainDataApi.trainDataListPageApi,
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
   * 训练数据管理-查询训练数据下拉列表
   * @returns
   */
  static trainDataListAll() {
    return request({
      url: trainDataApi.trainDataListAllApi,
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
   * 训练数据管理-查看训练数据版本列表(列表行点击请求接口)
   * @returns
   */
  static trainDataGetById(id: string) {
    return request({
      url: trainDataApi.trainDataGetByIdApi + id,
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
   * 训练数据管理-查看训练数据版本列表(列表行点击请求接口)
   * @returns
   */
  static getTrainVersionDataListByTrainDataId(trainDataId: string, id: string) {
    return request({
      url: trainDataApi.getTrainVersionDataListByTrainDataIdApi + trainDataId + '/' + id,
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
   * 训练数据管理-导入标注任务
   * @returns
   */
  static trainDataImportDataSet(data: any) {
    return request({
      url: trainDataApi.trainDataImportDataSetApi,
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
   * 训练数据管理-训练数据版本记录删除接口
   * @returns
   */
  static trainDataDelete(id: string) {
    return request({
      url: trainDataApi.trainDataDeleteApi + id,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}

/**训练管理 */
const trainModelApi = {
  //训练管理-模型列表分页查询
  trainModelListPageApi: api + '/skieernlpweb/trainModel/listPage',
  // 训练管理-查询项目名称下拉框列表
  trainModellistUniqueProjectNameApi: api + '/skieernlpweb/trainModel/listUniqueProjectName',
  // 训练管理-项目版本记录删除接口(这里传的id为子表记录主键id 版本记录主键id)
  trainModelDeleteByIdApi: api + '/skieernlpweb/trainModel/deleteById/',
  // 训练管理-开始训练
  trainModelStartTrainApi: api + '/skieernlpweb/trainModel/startTrain',
  // 训练管理-重新开始训练
  trainModelReStartTrainApi: api + '/skieernlpweb/trainModel/reStartTrain',
  // 训练管理-新增项目
  trainModelInsertTrainModelVersionApi: api + '/skieernlpweb/trainModel/insertTrainModelVersion',
  // 训练管理-根据项目名称查询模型信息
  trainModelListModelInfoByProjectNameApi: api + '/skieernlpweb/trainModel/listModelInfoByProjectName',
  // 训练管理-根据模型主键id查询模型信息(排除最新的一条)
  trainModelGetTrainModelVersionListByTrainModelIdApi: api + '/skieernlpweb/trainModel/getTrainModelVersionListByTrainModelId/'
}

class trainModelService {
  /**训练管理-模型列表分页查询 */
  static trainModelList(data: trainModelListPageReq) {
    return request({
      url: trainModelApi.trainModelListPageApi,
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
  /**训练管理-查询项目名称下拉框列表 */
  static trainModellistUniqueProjectNameApiAll() {
    return request({
      url: trainModelApi.trainModellistUniqueProjectNameApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**训练管理-项目版本记录删除接口(这里传的id为子表记录主键id 版本记录主键id) */
  static trainModelDeleteById(id: string) {
    return request({
      url: trainModelApi.trainModelDeleteByIdApi + id,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**训练管理-开始训练 */
  static trainModelStartTrain(data: trainModelStartTrainReq) {
    return request({
      url: trainModelApi.trainModelStartTrainApi,
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
  /**训练管理-重新开始训练 */
  static trainModelReStartTrain(data: trainModelStartTrainReq) {
    return request({
      url: trainModelApi.trainModelReStartTrainApi,
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
  /**训练管理-新增项目 */
  static trainModelInsertTrainModelVersion(data: trainModelInsertTrainModelVersionReq) {
    return request({
      url: trainModelApi.trainModelInsertTrainModelVersionApi,
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
  /**训练管理-根据项目名称查询模型信息 */
  static trainModelListModelInfoByProjectName(params: trainModelListModelInfoByProjectNameReq) {
    return request({
      url: trainModelApi.trainModelListModelInfoByProjectNameApi,
      method: 'POST',
      json: true,
      params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**训练管理-根据模型主键id查询模型信息(排除最新的一条) */
  static trainModelGetTrainModelVersionListByTrainModelId(trainModelId: string, id: string) {
    return request({
      url: trainModelApi.trainModelGetTrainModelVersionListByTrainModelIdApi + trainModelId + '/' + id,
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

/**服务管理 */
const projectServiceApi = {
  // 服务管理-服务列表分页查询
  projectServiceListPageApi: api + '/skieernlpweb/projectService/listPage',
  // 服务管理-服务上线
  projectServiceOnlineApi: api + '/skieernlpweb/projectService/online',
  // 服务管理-服务下线
  projectServiceOfflineApi: api + '/skieernlpweb/projectService/offline',
  // 服务管理-新增服务
  projectServiceAddServiceApi: api + '/skieernlpweb/projectService/addService',
  // 服务管理-服务删除接口(id为从表记录主键id)
  projectServiceDeleteByIdApi: api + '/skieernlpweb/projectService/deleteById/',
  // 服务管理-模型服务关闭启用操作
  projectServiceOperateProjectServiceApi: api + '/skieernlpweb/projectService/operateProjectService',
  // 服务管理-根据id查询服务历史版本记录(排除最新的一条)
  projectServiceGetProjectServiceVersionListByProjectServiceIdApi: api + '/skieernlpweb/projectService/getProjectServiceVersionListByProjectServiceId/',
  // 服务管理-启动全量评估
  projectServiceFullEvaluateApi: api + '/skieernlpweb/projectService/fullEvaluate',
  // 服务管理-校验服务是否有已经上线版本
  projectServiceServiceOnlineCheckApi: api + '/skieernlpweb/projectService/serviceOnlineCheck',
  // 服务管理-启动评估报告
  projectServiceStartEvaluate: api + '/skieernlpweb/projectService/startEvaluate',
  // 服务管理-根据主键id查询服务版本信息
  projectServiceGetServiceVersionInfoById: api + '/skieernlpweb/projectService/getServiceVersionInfoById',
  //服务管理-服务配置修改
  projectServiceUpdateServiceVersion: api + '/skieernlpweb/projectService/updateServiceVersion'
}

class projectServiceService {
  /**服务管理-模型列表分页查询 */
  static projectServiceListPage(data: projectServiceListPageReq) {
    return request({
      url: projectServiceApi.projectServiceListPageApi,
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
  /**服务管理-服务上线 */
  static projectServiceOnline(data: projectServiceOnlineReq) {
    return request({
      url: projectServiceApi.projectServiceOnlineApi,
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
  /**服务管理-服务下线 */
  static projectServiceOffline(data: projectServiceOnlineReq) {
    return request({
      url: projectServiceApi.projectServiceOfflineApi,
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
  /**服务管理-新增服务 */
  static projectServiceAddService(data: projectServiceAddServiceReq) {
    return request({
      url: projectServiceApi.projectServiceAddServiceApi,
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
  /**服务管理-服务删除接口(id为从表记录主键id) */
  static projectServiceDeleteById(id: string) {
    return request({
      url: projectServiceApi.projectServiceDeleteByIdApi + id,
      method: 'POST',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**服务管理-模型服务关闭启用操作 */
  static operateProjectService(data: projectServiceOperateProjectServiceReq) {
    return request({
      url: projectServiceApi.projectServiceOperateProjectServiceApi,
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
  /**服务管理-根据id查询服务历史版本记录(排除最新的一条)*/
  static getProjectServiceVersionListByProjectServiceId(projectServiceId: string, id: string) {
    return request({
      url: projectServiceApi.projectServiceGetProjectServiceVersionListByProjectServiceIdApi + projectServiceId + '/' + id,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**服务管理-启动全量评估*/
  static fullEvaluate(data: projectServiceFullEvaluateReq) {
    return request({
      url: projectServiceApi.projectServiceFullEvaluateApi,
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
  /**服务管理-校验服务是否有已经上线版本 */
  static serviceOnlineCheck(data: projectServiceServiceOnlineCheckReq) {
    return request({
      url: projectServiceApi.projectServiceServiceOnlineCheckApi,
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
  /**服务管理-启动评估报告 */
  static startEvaluate(data: projectServiceStartEvaluateReq) {
    return request({
      url: projectServiceApi.projectServiceStartEvaluate,
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
  /**服务管理-根据主键id查询服务版本信息 */
  static getServiceVersionInfoById(data: projectServiceGetServiceVersionInfoByIdReq) {
    return request({
      url: projectServiceApi.projectServiceGetServiceVersionInfoById,
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
  /**服务管理-根据主键id查询服务版本信息 */
  static updateServiceVersion(data: projectServiceUpdateServiceVersion) {
    return request({
      url: projectServiceApi.projectServiceUpdateServiceVersion,
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

/**审核管理 */
const approveApi = {
  // 务审核页面分页查询接口
  projectServiceVersionApprovingListPageApi: api + '/skieernlpweb/projectServiceVersionApproving/listPage',
  // 审核提交接口
  projectServiceApproveSubmit: api + '/skieernlpweb/projectService/approveSubmit'
}

class approveService {
  /**审核管理-列表分页查询 */
  static approveListPage(data: approveListPageReq) {
    return request({
      url: approveApi.projectServiceVersionApprovingListPageApi,
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
  /**审核管理-提交审核操作 */
  static approveSubmit(data: approveSubmitReq) {
    return request({
      url: approveApi.projectServiceApproveSubmit,
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

export { aiPlatformService, originDataService, charWordVectorService, trainDataService, trainModelService, projectServiceService, aiPlatformApi, approveService }
