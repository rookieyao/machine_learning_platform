export interface originDataListPageReq {
  originDataName: string | null
  processState: string | null
  pageNum: number
  pageSize: number
}

export interface originDataAddReq {
  id?: string
  files: Array<object>
  originDataName: string
  language: string
  dataSource: string
  remark: string
}

export interface originDataPreviewSynInfoReq {
  taskId: object
  originDataList: Array<string>
  file: Array<object>
  rangeLength: string
  sampleNum: number
  maxMatchNum: number
  pageNum: number
  pageSize: number
}

export interface originDataPreviewSyncInfoListPageReq {
  requestId: string
  pageNum: number
  pageSize: number
}

export interface originDataDoCleanReq {
  id: string
  pipelineFileConfigId: string
}

/**字词向量管理 */
export interface charWordVectorListPageReq {
  charWordVectorName: string | null
  processState: string | null
  pageNum: number
  pageSize: number
}
export interface charWordVectorAddReq {
  charWordVectorName: string
  vectorDimension: number
  windowSize: number
  minWordFrequency: number
  vectorType: string
  remark: string
  originDataIdList: Array<string>
}
export interface charWordVectorUpdateByIdReq {
  id: string
  charWordVectorName: string
  remark: string
}
export interface charWordVectorManualUpdateReq {
  id: string
}

/**训练数据管理 */
export interface trainDataListPageReq {
  dataSetName: string | null
  importState: string | null
  pageNum: number
  pageSize: number
}

interface labelTaskReq {
  labelTaskId: string
  labelTaskType: string
}

export interface trainDataImportDataSetReq {
  labelTaskList: Array<labelTaskReq>
  dataSetName: string
  labelLanguage: number
  projectType: number
  remark: string
}

export interface trainDataReImportLabelTaskReq {
  trainDataVersionId: string
}

/**训练管理-模型列表分页查询 */
export interface trainModelListPageReq {
  projectName: string | null
  projectType: number | null
  modelType: string | null
  trainModelVersion: string | null
  pageNum: number
  pageSize: number
}

export interface trainModelProjectAddReq {
  projectName: string
  trainDataId: string
  modelTyep: Array<number>
  charWordVectorId: string
  remark: string
}

export interface trainModelStartTrainReq {
  trainModelVersionId: string
}

export interface trainModelInsertTrainModelVersionReq {
  projectName: string
  projectType: number
  modelTypeList: Array<number>
  charWordVectorId: string
  trainDataVersionId: string
  remark: string
}
export interface trainModelListModelInfoByProjectNameReq {
  projectName: string
}

/**服务管理 */
export interface projectServiceListPageReq {
  serviceName: string | null
  pageNum: number
  pageSize: number
}
export interface projectServiceOnlineReq {
  projectServiceVersionId: string
  environmentType: string
  yunTingAccountDto?: any
}
export interface projectServiceAddServiceReq {
  projectName: string
  serviceName: string
  trainModelVersionIdList: Array<string>
  remark: string
  serviceConfigInfo: string
}
export interface projectServiceOperateProjectServiceReq {
  id: string
  serviceAvailable: number
  projectName: string
  projectType: string
}
export interface projectServiceFullEvaluateReq {
  projectServiceVersionId: string
}
export interface projectServiceServiceOnlineCheckReq {
  projectServiceId: string
}
export interface projectServiceStartEvaluateReq {
  // 服务版本主键id
  projectServiceVersionId: string
  //项目名称
  projectName: string
  // 1 test评估 2 全量评估
  // evaluationType: number
  detectList: Array<{ evaluationType: number; modelType: string }>
}
export interface projectServiceGetServiceVersionInfoByIdReq {
  id: string
}
export interface projectServiceUpdateServiceVersion {
  projectServiceVersionId: string
  serviceName: string
  remark: string
  serviceConfigInfo: string
}
export interface projectServiceExistServiceName {
  serviceName: string
}
/**minIO文件下载 */
export interface fileDownloadReq {
  fileName: string
}

/**审核管理 */
export interface approveListPageReq {
  serviceName: string | null
  approveState: string | null
  pageNum: number
  pageSize: number
}

export interface approveSubmitReq {
  id: string
  approveState: number
  remark: string
}
