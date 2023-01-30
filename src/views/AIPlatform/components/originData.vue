<template>
  <div>
    <el-form label-width="120px" :inline="true" :model="filter" ref="originSearchRef">
      <el-form-item label="原始数据名称" prop="originDataName">
        <el-input v-model="filter.originDataName" @change="getListPage(1)"></el-input>
      </el-form-item>
      <el-form-item label="处理状态" prop="processState">
        <el-select v-model="filter.processState" @change="getListPage(1)">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(k, v) in processState" :value="v" :label="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListPage(1)">查询</el-button>
        <el-button type="info" @click="originSearchResetFields(originSearchRef)">重置查询条件</el-button>
        <el-button type="primary" @click="addOriginDataVisible = !addOriginDataVisible">新增原始数据集</el-button>
        <el-button type="primary" @click="dataToAnnoVisible = !dataToAnnoVisible">同步到标注系统</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="originData" stripe row-key="id" table-layout="auto" @selection-change="handelOriginSelectionChange">
      <el-table-column type="selection" :selectable="originDataSelectable"></el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <div class="table-expand">
            <p>语种： {{ language[props.row.language] }}</p>
            <p>清洗流水线： {{ props.row.dataSource }}</p>
            <p>
              原始文件：
              <el-button
                v-if="props.row.originDataDirectoryPath"
                class="table-expand-button"
                text
                type="primary"
                @click="download(props.row.originDataDirectoryPath, `${props.row.originDataName}.zip`)"
              >
                下载
              </el-button>
            </p>
            <p>
              清洗后文件：
              <el-button
                v-if="props.row.cleanedFilePath"
                text
                type="primary"
                class="table-expand-button"
                @click="download(props.row.cleanedFilePath, props.row.cleanedFilePath.split('/').reverse()[0])"
                style="margin-right: 10px;"
              >
                下载
              </el-button>
              <el-button
                v-if="props.row.cleanedFilePath"
                text
                type="primary"
                class="table-expand-button"
                @click="download(props.row.statisticInfoFilePath, props.row.statisticInfoFilePath.split('/').reverse()[0])"
              >
                下载(清洗数据+统计数据)
              </el-button>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="序号" :width="55" type="index" align="center" :index="(index:number)=>index+1+(currentPage-1) * pageSize"></el-table-column>
      <el-table-column label="原始数据名称" prop="originDataName"></el-table-column>
      <el-table-column label="文件大小" prop="originFlieSize">
        <template #default="scope"> {{ (scope.row.originFlieSize / 1024).toFixed(2) }} MB </template>
      </el-table-column>
      <el-table-column label="清洗后/清洗前" prop="originFileLineNum">
        <template #default="scope">
          {{ `${scope.row.cleanedFileLineNum ?? '-'} / ${scope.row.originFileLineNum}` }}
        </template>
      </el-table-column>
      <el-table-column label="处理状态" prop="processState">
        <template #default="scope">
          {{ processState[scope.row.processState] }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="creator"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="备注" prop="remark">
        <template #default="scope">
          <el-tooltip placement="top" effect="light" :content="scope.row.remark">
            <span>{{ scope.row.remark.slice(0, 20) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-if="scope.row.processState === -1" text type="primary" @click="doClean(scope.row)">开始清洗数据</el-button>
          <el-button v-if="scope.row.processState === 2" text type="primary" @click="dataToAnnoByRow(scope.row)">同步到标注系统</el-button>
          <el-button v-if="[-1, 2].includes(scope.row.processState)" text type="primary" @click="addDataToOriginData(scope.row)">追加原始数据</el-button>
          <el-popconfirm v-if="scope.row.processState !== 1" title="确认要删除？" confirm-button-text="确认" cancel-button-text="取消" @confirm="deleteOriginData(scope.row.id)">
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-pagination"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="getListPage(1)"
      @current-change="getListPage(currentPage)"
    ></el-pagination>
    <el-dialog v-model="addOriginDataVisible" title="新增原始数据集" @closed="addOriginDathandleDialogClose(addOriginDataFormRef)">
      <template #default>
        <el-form label-width="120px" ref="addOriginDataFormRef" :model="addOriginData" :rules="addOriginDataRules">
          <el-form-item label="原始数据名称" prop="originDataName">
            <el-input v-model="addOriginData.originDataName" :disabled="addOriginDataDisable"></el-input>
          </el-form-item>
          <el-form-item label="原始数据语料" prop="fileList">
            <el-upload
              ref="addOriginDatauploadRef"
              :file-list="addOriginData.fileList"
              :multiple="true"
              :auto-upload="false"
              accept="text/plain, .jsonl, .zip"
              :before-upload="handleAvatarBefore"
              :http-request="addOriginDataUploadFileAction"
            >
              <template #trigger>
                <el-button type="primary">选择上传文件</el-button>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="语种" prop="language">
            <el-select v-model="addOriginData.language" :disabled="addOriginDataDisable">
              <el-option v-for="(k, v) in language" :value="v" :label="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="清洗流水线" prop="dataSource">
            <el-select v-model="addOriginData.dataSource" filterable allow-create default-first-option :disabled="addOriginDataDisable">
              <el-option v-for="pipe in pipelines" :value="pipe.id" :label="pipe.pipelineName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行数据清洗" prop="doCleanNow">
            <el-checkbox v-model="addOriginData.doCleanNow" true-label="1" false-label="0">是否立刻执行数据清洗</el-checkbox>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="addOriginData.remark" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="addOriginDataVisible = false">取消</el-button>
            <el-button type="primary" @click="addOriginDataSubmitForm(addOriginDataFormRef)">
              <span v-if="addOriginData.id">保存</span>
              <span v-else>新增</span>
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
    <el-dialog v-model="dataToAnnoVisible" title="同步到标注系统" width="1200px" @closed="dataToAnnoDialogClose(dataToAnnoDataFormRef)">
      <template #default>
        <el-form label-width="140px" ref="dataToAnnoDataFormRef" :model="dataToAnnoData" :rules="dataToAnnoDataRules" :before-upload="handleAvatarBefore">
          <el-form-item label="原始数据名称" prop="originDataIdList">
            <el-transfer
              v-model="dataToAnnoData.originDataIdList"
              :data="originDataList"
              :filterable="true"
              filter-placeholder="请输入原始数据名称"
              :titles="['原始数据列表', '同步列表']"
            ></el-transfer>
          </el-form-item>
          <el-form-item label="长度范围" prop="rangeLength">
            <el-input-number
              class="dialog-input-number"
              v-model="dataToAnnoData.rangeLength[0]"
              size="small"
              controls-position="right"
              :min="1"
              :max="dataToAnnoData.rangeLength[1] - 1"
            ></el-input-number>
            <span style="margin: 0 10px;">-</span>
            <el-input-number class="dialog-input-number" v-model="dataToAnnoData.rangeLength[1]" size="small" controls-position="right" :min="dataToAnnoData.rangeLength[0] + 1"></el-input-number>
          </el-form-item>
          <el-form-item label="关键词组规则文件">
            <el-upload
              ref="dataToAnnoUploadRef"
              :auto-upload="false"
              :limit="1"
              accept="text/plain"
              :before-upload="handleAvatarBefore"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              :http-request="dataToAnnoUploadAction"
            >
              <template #trigger>
                <el-button type="primary">选择上传文件</el-button>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="标注任务类型" prop="labelType">
            <el-radio-group v-model="dataToAnnoData.labelType">
              <el-radio label="1">产品洞察</el-radio>
              <el-radio label="2">服务洞察</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关键词最大匹配量" prop="maxMatchNum">
            <el-input-number class="dialog-input-number" v-model="dataToAnnoData.maxMatchNum" size="small" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="最大采样条数" prop="sampleNum">
            <el-input-number class="dialog-input-number" v-model="dataToAnnoData.sampleNum" size="small" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="标注系统任务" prop="taskId">
            <el-select v-model="dataToAnnoData.annoDB">
              <el-option value="ann" label="本地_ann_8085"></el-option>
              <el-option value="ann_online" label="线上_ann_online_8086"></el-option>
            </el-select>
            <el-select v-model="dataToAnnoData.taskId" filterable>
              <el-option v-for="task in normalizedAnnoTaskList[dataToAnnoData.annoDB]" :value="task._id" :label="task.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预览数据">
            <el-button type="primary" @click="previewClick(dataToAnnoDataFormRef)">同步预览</el-button>
            <span class="dialog-preview-total">{{ (previewDataPageNum - 1) * 100 + previewData.length }} / {{ previewTotal }}</span>
            <el-pagination v-model:currentPage="previewDataPageNum" :page-size="100" small :hide-on-single-page="true" layout="prev, next" :total="previewTotal" @current-change="previewPageChange" />
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="18" v-if="previewData.length > 0">
                <el-scrollbar max-height="300px" style="width: 100%;">
                  <p class="dialog-scrollbar-p" v-for="content in previewData">{{ content }}</p>
                </el-scrollbar>
              </el-col>
              <el-col :span="5" :offset="1" v-if="keywordsData.length > 0">
                <el-scrollbar max-height="300px" style="width: 100%;">
                  <p class="dialog-scrollbar-p" v-for="keyword in keywordsData">{{ keyword.keyWord }}:{{ keyword.matchNum }}</p>
                </el-scrollbar>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="dataToAnnoDialogClose(dataToAnnoDataFormRef)">重置</el-button>
            <el-button type="primary" @click="syncDataToLabelClick(dataToAnnoDataFormRef)">同步</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onDeactivated, onMounted, reactive, ref, watch } from 'vue'
import { aiPlatformService, originDataService, aiPlatformApi } from '../api/aiPlatform'
import { originDataDoCleanReq, originDataListPageReq, originDataPreviewSyncInfoListPageReq } from '../api/types'
import { ElMessage, FormInstance, FormRules, UploadInstance, UploadRawFile, UploadProps, genFileId, UploadUserFile } from 'element-plus'
import { processState, language } from '../api/info'
import downloadFile from '@/utils/downloadFile'
const props = defineProps(['annoTaskList', 'isCheck'])
const loading = ref(false)
/**原始数据是否可以勾选 */
const originDataSelectable = (row: any, index: any) => {
  if (row.processState === 2) {
    return true
  } else {
    return false
  }
}
/**获取列表分页结果 */
const originData = ref([] as any)
/**重置查询条件 */
const originSearchResetFields = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getListPage(1)
}
/**查询 */
const originSearchRef = ref()
const getListPage = async (page: number) => {
  loading.value = true
  const listPageFilter: originDataListPageReq = { pageNum: page, pageSize: pageSize.value, originDataName: null, processState: null }
  if (filter.originDataName) {
    listPageFilter.originDataName = filter.originDataName
  }
  if (filter.processState) {
    listPageFilter.processState = filter.processState
  }
  const res = await originDataService.originDataListPage(listPageFilter)
  currentPage.value = page
  if (res.status === 200) {
    originData.value = res.data.list
    total.value = res.data.total
    currentPage.value = res.data.pageNum
  } else {
    clearInterval(timer)
    timer = undefined
  }
  loading.value = false
}
/**分页 */
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
/**filter查询 */
const filter = reactive({
  originDataName: '',
  processState: ''
})

/**数据列表选择 */
const handelOriginSelectionChange = (val: any) => {
  dataToAnnoData.originDataIdList = val.map((e: any) => e.id)
}

/**新增原始数据集 */
const addOriginDataVisible = ref(false)
const addOriginDataDisable = ref(false)
const addOriginDataFormRef = ref<FormInstance>()
const addOriginDataRules = reactive<FormRules>({
  originDataName: [{ required: true, message: '请输入文件类型' }],
  language: [{ required: true, message: '请选择语种类型' }],
  dataSource: [{ required: true, message: '请选择数据源' }],
  fileList: [{ required: true, message: '请先上传文件', trigger: 'blur' }]
})
interface originDataAddType {
  id?: string
  originDataName: string
  language: string
  dataSource: string
  doCleanNow: string
  remark: string
  fileList: UploadUserFile[]
}
const addOriginData: originDataAddType = reactive({
  id: '',
  originDataName: '',
  language: '1',
  dataSource: '',
  doCleanNow: '1',
  remark: '',
  fileList: []
})
var addOriginDataFormData = new FormData()
const addOriginDataSubmitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      addOriginDataFormData = new FormData()
      await addOriginDatauploadRef.value!.submit()
      // 必须要上传文件
      if (addOriginDataFormData.getAll('files').length !== 0) {
        // 通过是否存在ID判断是新增还是追加
        if (addOriginData.id) {
          addOriginDataFormData.append('id', addOriginData.id)
        }
        addOriginDataFormData.append('originDataName', addOriginData.originDataName)
        addOriginDataFormData.append('language', addOriginData.language)
        addOriginDataFormData.append('dataSource', addOriginData.dataSource)
        addOriginDataFormData.append('remark', addOriginData.remark)
        addOriginDataFormData.append('doCleanNow', addOriginData.doCleanNow)
        const res = await originDataService.originDataAdd(addOriginDataFormData)
        if (res.status === 200) {
          ElMessage.success('新增原始数据集成功')
          addOriginDataVisible.value = false
          // 更新所有的原始数据列表
          reflush()
        } else {
          ElMessage.success('新增原始数据集失败')
          addOriginDatauploadRef.value?.clearFiles()
        }
      } else {
        ElMessage.warning('请先上传文件')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**原始文件上传 */
const addOriginDatauploadRef = ref<UploadInstance>()
const addOriginDataUploadFileAction = async (files: any) => {
  addOriginDataFormData.append('files', files.file)
}
/**dialog关闭
 * 将新增参数设置回默认
 */
const addOriginDathandleDialogClose = (formEl: FormInstance | undefined) => {
  addOriginData.id = ''
  addOriginData.originDataName = ''
  addOriginData.language = '1'
  addOriginData.dataSource = ''
  addOriginData.remark = ''
  addOriginDataDisable.value = false
  if (!formEl) return
  formEl.resetFields()
  addOriginDatauploadRef.value?.clearFiles()
}
/**追加原始数据 */
const addDataToOriginData = async (row: any) => {
  // 追加数据添加默认条件
  addOriginDataVisible.value = true
  await nextTick()
  // 设置输入框不可选中
  addOriginDataDisable.value = true
  addOriginData.id = row.id
  addOriginData.originDataName = row.originDataName
  addOriginData.language = row.language.toString()
  addOriginData.dataSource = row.pipelineFileConfigId
  addOriginData.remark = row.remark
}
/**文件校验 */
const handleAvatarBefore = (file: UploadRawFile) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (!['txt', 'jsonl', 'json', 'zip'].includes(fileSuffix)) {
    ElMessage.error('上传的文件只能是zip,txt或jsonl文件')
    return false
  }
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  dataToAnnoUploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  dataToAnnoUploadRef.value!.handleStart(file)
}
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  dataToAnnoUploadFile.value = undefined
}
/**获取标注任务列表 */
const normalizedAnnoTaskList = computed(() => props.annoTaskList)
/**获取所有的原始数据列表 */
interface originDataListFace {
  key: string
  label: string
  disabled: boolean
}
const originDataList = ref<originDataListFace[]>([])
const getOriginDataList = async () => {
  const res = await originDataService.getOriginDataAll()
  originDataList.value = res.data
  originDataList.value = res.data.map((e: any) => {
    return { key: e.id, label: e.originDataName, disabled: false }
  })
}
/**同步到标注系统 */
const dataToAnnoVisible = ref(false)
const dataToAnnoDataFormRef = ref<FormInstance>()
const dataToAnnoDataRules = reactive<FormRules>({
  originDataIdList: [{ required: true, message: '请选择原始数据集', trigger: 'change' }],
  taskId: [{ required: true, message: '请选择标注任务' }]
})
const dataToAnnoData = reactive({
  originDataIdList: [] as any,
  rangeLength: [50, 200],
  maxMatchNum: 200,
  sampleNum: 4000,
  annoDB: 'ann_online',
  taskId: '',
  labelType: '1'
})
/**关键词组上传 */
const dataToAnnoUploadRef = ref<UploadInstance>()
const dataToAnnoUploadFile = ref()
const dataToAnnoUploadAction = async (files: any) => {
  dataToAnnoUploadFile.value = files.file
}
/**同步预览 */
const previewData = ref<string[]>([])
const keywordsData = ref<any[]>([])
const previewTotal = ref(0)
const previewDataPageNum = ref(1)
const requestId = ref('')
const previewClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      await dataToAnnoUploadRef.value?.submit()
      const dataForm = new FormData()
      const labelTask = { labelTaskType: dataToAnnoData.annoDB === 'ann_online' ? '8086' : '8085', labelTaskId: dataToAnnoData.taskId }
      dataForm.append('labelTask', JSON.stringify(labelTask))
      dataForm.append('originDataIdList', String(dataToAnnoData.originDataIdList))
      dataForm.append('rangeLength', dataToAnnoData.rangeLength.join('-'))
      dataForm.append('sampleNum', dataToAnnoData.sampleNum.toString())
      dataForm.append('maxMatchNum', dataToAnnoData.maxMatchNum.toString())
      dataForm.append('labelType', dataToAnnoData.labelType)
      // 默认第一页100条
      dataForm.append('pageNum', '1')
      dataForm.append('pageSize', '100')
      if (dataToAnnoUploadFile.value) {
        // TODO 关键词文件可能为空
        dataForm.append('file', dataToAnnoUploadFile.value)
      }
      if (requestId.value) {
        dataForm.append('requestId', requestId.value)
      }
      const res = await originDataService.originDataPreviewSyncInfo(dataForm)
      if (res.data) {
        previewData.value = res.data.pageData.list
        previewTotal.value = res.data.pageData.total
        keywordsData.value = res.data.keyWordsInfoList
        previewDataPageNum.value = 1
        requestId.value = res.message
      } else {
        ElMessage.warning('查询不到数据')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**同步预览分页 */
const previewPageChange = async () => {
  // 如果requestId不存在不能请求
  if (!requestId.value) {
    ElMessage.warning('你还没有点击同步预览？')
    return
  }
  const data: originDataPreviewSyncInfoListPageReq = {
    requestId: requestId.value,
    pageNum: previewDataPageNum.value,
    pageSize: 100
  }
  const res = await originDataService.originDataPreviewSyncInfoListPage(data)
  if (res.data) {
    previewData.value = res.data
    requestId.value = res.message
  } else {
    ElMessage.warning('查询不到数据')
  }
}
/**同步点击 */
const syncDataToLabelClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      await dataToAnnoUploadRef.value?.submit()
      const dataForm = new FormData()
      const labelTask = { labelTaskType: dataToAnnoData.annoDB === 'ann_online' ? '8086' : '8085', labelTaskId: dataToAnnoData.taskId }
      dataForm.append('labelTask', JSON.stringify(labelTask))
      dataForm.append('originDataIdList', String(dataToAnnoData.originDataIdList))
      dataForm.append('rangeLength', dataToAnnoData.rangeLength.join('-'))
      dataForm.append('sampleNum', dataToAnnoData.sampleNum.toString())
      dataForm.append('maxMatchNum', dataToAnnoData.maxMatchNum.toString())
      dataForm.append('labelType', dataToAnnoData.labelType)
      if (dataToAnnoUploadFile.value) {
        // TODO 关键词文件可能为空
        dataForm.append('file', dataToAnnoUploadFile.value)
      }
      if (requestId.value) {
        dataForm.append('requestId', requestId.value)
      }
      const res = await originDataService.originDataSyncDataToLabel(dataForm)
      if (res.status === 200) {
        requestId.value = ''
        ElMessage.success('成功同步到标注任务')
        dataToAnnoVisible.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**关闭同步到标注系统对话框重置值 */
const dataToAnnoDialogClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  dataToAnnoUploadRef.value?.clearFiles()
  dataToAnnoUploadFile.value = undefined
  previewTotal.value = 0
  previewDataPageNum.value = 1
  previewData.value.splice(0, previewData.value.length + 1)
  keywordsData.value.splice(0, keywordsData.value.length + 1)
}
/**单个原始数据同步 */
const dataToAnnoByRow = async (row: any) => {
  dataToAnnoVisible.value = true
  await nextTick()
  dataToAnnoData.originDataIdList = [row.id]
}
/**删除原始数据 */
const deleteOriginData = async (id: string) => {
  const res = await originDataService.originDataDeleteById(id)
  if (res.status === 200) {
    ElMessage.success('删除成功')
    reflush()
  }
}
/**手动启动清洗数据 */
const doClean = async (row: any) => {
  const data: originDataDoCleanReq = { id: row.id, pipelineFileConfigId: row.pipelineFileConfigId }
  const res = await originDataService.doClean(data)
  if (res.status === 200) {
    ElMessage.success('正在清洗数据，请稍后查看')
    reflush()
  }
}
/**文件下载 */
const download = (path: string, fileName: string) => {
  downloadFile(aiPlatformApi.fileDownloadApi, fileName, 'post', { fileName: path })
}
/**初始化 */
/**pipeline */
const pipelines = ref([] as any)
const init = async () => {
  // 获取所有的pipeline
  const pipeRes = await aiPlatformService.getPipeline()
  pipelines.value = pipeRes.data
}
onMounted(() => {
  init()
})

let timer = undefined as any

const reflush = () => {
  getListPage(currentPage.value)
  getOriginDataList()
}
watch(
  () => props.isCheck,
  (newValue, oldValue) => {
    if (newValue && !timer) {
      reflush()
      timer = setInterval(function () {
        reflush()
      }, 60000)
    } else {
      clearInterval(timer)
      timer = undefined
    }
  }
)
onDeactivated(() => {
  clearInterval(timer)
  timer = undefined
})
</script>

<style scoped>
.table-expand {
  padding-left: 100px;
}
.table-expand-button {
  height: auto;
  padding: 0;
}
.table-pagination {
  padding-top: 30px;
}
.upload-delete {
  margin-left: 30px;
}
.dialog-input-number {
  width: 90px;
}
.dialog-scrollbar-p {
  display: flex;
  align-items: center;
  justify-content: left;
  /* height: 50px; */
  width: 98%;
  margin: 3px;
  padding: 0 3px;
  text-align: left;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
.dialog-preview-total {
  justify-content: ricght;
  text-align: right;
  width: 80%;
}
</style>
