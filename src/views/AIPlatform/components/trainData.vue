<template>
  <div>
    <el-form label-width="120px" :inline="true" ref="trainSearchRef" :model="filter">
      <el-form-item label="训练集名称" prop="dataSetName">
        <el-input v-model="filter.dataSetName" @change="getListPage(1)"></el-input>
      </el-form-item>
      <el-form-item label="处理状态" prop="processState">
        <el-select v-model="filter.processState" @change="getListPage(1)">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(k, v) in importState" :value="v" :label="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListPage(currentPage)">查询</el-button>
        <el-button type="info" @click="trainSearchResetFields(trainSearchRef)">重置查询条件</el-button>
        <el-button type="primary" @click="addTrainDataVisible = !addTrainDataVisible">导入</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="trainDataRef"
      v-loading="loading"
      :data="trainData"
      stripe
      table-layout="auto"
      row-key="id"
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :load="loadOldVersion"
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="index" align="right"></el-table-column>
      <el-table-column label="数据集名称" prop="dataSetName"></el-table-column>
      <el-table-column label="项目类型" prop="projectType">
        <template #default="scope">
          {{ projectType[scope.row.projectType] }}
        </template>
      </el-table-column>
      <el-table-column label="导入状态" prop="importState">
        <template #default="scope">
          {{ importState[scope.row.importState] }}
          <el-tooltip v-if="scope.row.importState === 3" placement="top" effect="light">
            <template #content>
              <span>{{ scope.row.errorLog ?? '未知的错误' }}</span>
            </template>
            <el-icon>
              <WarningFilled></WarningFilled>
            </el-icon>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="数据集版本" prop="dataSetVersion"></el-table-column>
      <el-table-column label="数据类型" prop="dataType">
        <template #header>
          <el-tooltip placement="top-start" effect="light">
            <template #content>
              <p>aspect:方面</p>
              <p>sentiment:情感</p>
              <p>intent:意图</p>
              <p>focus:关注点</p>
            </template>
            <span>
              数据类型
              <el-icon> <InfoFilled /> </el-icon>
            </span>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-tag v-for="tag in scope.row.dataType?.split(',')" class="data-type-tag">{{ dataType[tag] }}</el-tag>
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
          <el-button text type="primary" @click="viewTrainDataSet(scope.row)">查看</el-button>
          <el-popconfirm v-if="scope.row.importState !== 1" title="确认要删除？" confirm-button-text="确认" cancel-button-text="取消" @confirm="deleteTrainDataSubmit(scope.row)">
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="Object.prototype.hasOwnProperty.call(scope.row, 'hasChildren') && scope.row.importState !== 1" text type="primary" @click="reImportDataSet(scope.row)">重新导入</el-button>
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
    <el-dialog v-model="addTrainDataVisible" title="数据集导入" width="1200px" @closed="addTrainDataClean(addTrainDataFormRef)">
      <el-form label-width="120px" ref="addTrainDataFormRef" :model="addTrainData" :rules="addTrainDataRules">
        <el-form-item label="数据集名称" prop="dataSetName">
          <el-input v-model="addTrainData.dataSetName" :disabled="addTrainDataDisabled"></el-input>
        </el-form-item>
        <el-form-item label="标注任务" prop="labelTaskList">
          <template v-if="viewTrainDataVisible">
            <span v-for="i in labelIDTonAME(addTrainData.labelTaskList)" style="width: 100%;">{{ i }}</span>
          </template>
          <el-transfer
            v-else
            v-model="addTrainData.labelTaskList"
            :data="labelTaskList"
            :filterable="true"
            filter-placeholder="请输入标注任务名称"
            :titles="['标注任务列表', '导入任务']"
            @change="setDataSetName"
          ></el-transfer>
        </el-form-item>
        <el-form-item v-show="!viewTrainDataVisible" label="指标文件" prop="fileList">
          <el-upload
            ref="tagFileUploadRef"
            :auto-upload="false"
            :limit="1"
            accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            :before-upload="handleBeforeUpload"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :http-request="uploadFileAction"
          >
            <template #trigger>
              <el-button type="primary">选择上传文件</el-button>
            </template>
            <template v-if="addTrainDataDisabled" #tip>
              <div>
                重新导入如果没有上传指标文件默认复用之前版本的指标文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签语种" prop="labelLanguage">
          <el-select v-model="addTrainData.labelLanguage" :disabled="addTrainDataDisabled">
            <el-option value="1" label="中文"></el-option>
            <el-option value="2" label="英文"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <el-select v-model="addTrainData.projectType" :disabled="addTrainDataDisabled">
            <el-option value="1" label="产品洞察"></el-option>
            <el-option value="2" label="服务洞察"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :disabled="viewTrainDataVisible" v-model="addTrainData.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!addTrainDataDisabled" type="info" @click="addTrainDataClean(addTrainDataFormRef)">重置</el-button>
          <el-button v-if="!viewTrainDataVisible" type="primary" @click="addTrainDataSubmit(addTrainDataFormRef)">导入</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { logInfo } from '@/utils'
import { ElMessage, FormInstance, FormRules, genFileId, UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { reactive, ref, computed, watchEffect, onActivated, onDeactivated, watch, nextTick } from 'vue'
import { trainDataService } from '../api/aiPlatform'
import { trainDataListPageReq } from '../api/types'
import { projectType, importState, dataType } from '../api/info'

const props = defineProps(['annoTaskList', 'isCheck'])
const loading = ref(false)
const labelTaskList = ref([] as any)
const normalizedAnnoTaskList = computed(() => props.annoTaskList)
watchEffect(() => {
  labelTaskList.value.splice(0, labelTaskList.value.length + 1)
  normalizedAnnoTaskList.value.ann_online.forEach((e: any) => {
    labelTaskList.value.push({ key: `8086#${e._id}`, label: `线上(ann_online) : ${e.name}`, disabled: false })
  })
  normalizedAnnoTaskList.value.ann.forEach((e: any) => {
    labelTaskList.value.push({ key: `8085#${e._id}`, label: `线下(ann) : ${e.name}`, disabled: false })
  })
})

/**获取列表分页结果 */
const trainData = ref([] as any)
const trainDataRef = ref()
/**重置查询条件 */
const trainSearchResetFields = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getListPage(1)
}
/**查询 */
const trainSearchRef = ref()
const getListPage = async (page: number) => {
  loading.value = true
  const listPageFilter: trainDataListPageReq = { pageNum: page, pageSize: pageSize.value, dataSetName: null, importState: null }
  if (filter.dataSetName) {
    listPageFilter.dataSetName = filter.dataSetName
  }
  if (filter.processState) {
    listPageFilter.importState = filter.processState
  }
  const res = await trainDataService.trainDataListPage(listPageFilter)
  currentPage.value = page
  trainData.value = res.data.list.map((e: any, index: number) => {
    e.index = index + 1 + (currentPage.value - 1) * pageSize.value
    e.hasChildren = true
    return e
  })
  total.value = res.data.total
  currentPage.value = res.data.pageNum
  if (res.status === 200) {
    total.value = res.data.total
    currentPage.value = res.data.pageNum
  } else {
    clearInterval(timer)
    timer = undefined
  }
  loading.value = false
  await nextTick()
  reloadTable()
}
/**清空查询条件 */
/**分页 */
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
/**filter查询 */
const filter = reactive({
  dataSetName: '',
  processState: ''
})

/**重新导入/查看禁用输入 */
const addTrainDataVisible = ref(false)
const viewTrainDataVisible = ref(false)
const viewTrainDataSet = (row: any) => {
  viewTrainDataVisible.value = true
  reImportDataSet(row)
}
/**导入训练数据 */
const addTrainDataFormRef = ref<FormInstance>()
const addTrainDataRules = reactive<FormRules>({
  dataSetName: [{ required: true, message: '请输入数据集名称' }],
  labelTaskList: [{ required: true, message: '请选择标注任务', trigger: 'change' }],
  labelLanguage: [{ required: true, message: '请选择语种标签' }],
  projectType: [{ required: true, message: '请选择项目类型' }]
})
const addTrainData = reactive({
  dataSetName: '',
  labelTaskList: [],
  labelLanguage: '1',
  projectType: '1',
  remark: '',
  importType: '1',
  fileList: [] as any,
  trainDataVersionId: null
})
/**导入数据提交 */
// const fileList = ref<UploadUserFile[]>([])
const addTrainDataSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (addTrainData.importType === '1' && addTrainData.fileList.length === 0) {
        ElMessage.warning('请先上传指标文件')
        return
      }
      if (addTrainData.importType === '2' && addTrainData.fileList.length === 0) {
        uploadFileAction({ file: null })
        return
      }
      tagFileUploadRef.value!.submit()
    } else {
      logInfo('error submit!', fields)
    }
  })
}
/**重置导入表单 */
const addTrainDataClean = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  tagFileUploadRef.value!.clearFiles()
  addTrainDataDisabled.value = false
  viewTrainDataVisible.value = false
  addTrainData.importType = '1'
  addTrainData.trainDataVersionId = null
}
/**重新导入提交 */
const addTrainDataDisabled = ref(false)
const reImportDataSet = async (row: any) => {
  // 打开对话框
  addTrainDataVisible.value = true
  await nextTick()
  // 禁用字段修改
  addTrainDataDisabled.value = true
  // 设置默认参数
  addTrainData.dataSetName = row.dataSetName
  addTrainData.labelTaskList = row.labelTaskList.map((e: any) => `${e.labelTaskType}#${e.labelTaskId}`)
  addTrainData.labelLanguage = String(row.labelLanguage)
  addTrainData.projectType = String(row.projectType)
  addTrainData.remark = row.remark
  addTrainData.importType = '2'
  addTrainData.trainDataVersionId = row.id
}
/**查询历史的版本 */
const loadMap = ref(new Map())
const loadOldVersion = async (row: any, treeNode: unknown, resolve: (date: any[]) => void) => {
  //将获取到的节点数据添加到loadMap变量中
  loadMap.value.set(row.trainDataId, { row, treeNode, resolve })
  const res = await trainDataService.getTrainVersionDataListByTrainDataId(row.trainDataId, row.id)
  resolve(res.data)
}
// 重置表格懒加载信息
const reloadTable = () => {
  loadMap.value.forEach((e: any) => {
    const { row, treeNode, resolve } = e
    // 判断展开的行是不是最新的行，避免新增版本后id不同
    const tableRow = trainDataRef.value.data.find((e: any) => e.trainDataId === row.trainDataId)
    trainDataRef.value.store.states.lazyTreeNodeMap.value[row.id] = []
    if (row.id === tableRow.id) {
      // 还是相同的id则清空之前的并重新加载
      loadOldVersion(row, treeNode, resolve)
    }
  })
}
/**删除训练数据集 */
const deleteTrainDataSubmit = async (row: any) => {
  const res = await trainDataService.trainDataDelete(row.id)
  if (res.status === 200) {
    ElMessage.success('删除成功')
    getListPage(currentPage.value)
  }
}
/**穿梭框标注id转为name */
const labelIDTonAME = (ids: Array<string>) => {
  const labelNames = ids.map((e: string) => {
    const data = labelTaskList.value.find((ele: any) => ele.key === e)
    if (data) {
      return data.label
    } else {
      return e
    }
  })
  return labelNames
}
/**指标文件上传 */
const tagFileUploadRef = ref<UploadInstance>()
/**文件校验 */
const handleBeforeUpload = (file: UploadRawFile) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  if (!['csv', 'xls', 'xlsx'].includes(fileSuffix)) {
    ElMessage.error('上传的文件只能是excel或csv文件')
    return false
  }
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  tagFileUploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  tagFileUploadRef.value!.handleStart(file)
}
const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  addTrainData.fileList = uploadFiles
}
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  addTrainData.fileList = uploadFiles
}
const uploadFileAction = async (files: any) => {
  const uploadForm = new FormData()
  const labelTaskList = addTrainData.labelTaskList.map((e: string) => {
    const task = e.split('#')
    return { labelTaskId: task[1], labelTaskType: task[0] }
  })
  uploadForm.append('file', files.file ?? null)
  uploadForm.append('labelTaskList', JSON.stringify(labelTaskList))
  uploadForm.append('dataSetName', addTrainData.dataSetName)
  uploadForm.append('labelLanguage', addTrainData.labelLanguage)
  uploadForm.append('projectType', addTrainData.projectType)
  uploadForm.append('remark', addTrainData.remark)
  uploadForm.append('importType', addTrainData.importType)
  if (addTrainData.trainDataVersionId) {
    uploadForm.append('trainDataVersionId', addTrainData.trainDataVersionId)
  }
  const res = await trainDataService.trainDataImportDataSet(uploadForm)
  if (res.status === 200) {
    ElMessage.success('数据集导入成功')
    addTrainDataVisible.value = false
    getListPage(currentPage.value)
    addTrainDataClean(addTrainDataFormRef.value)
  }
}
/**通过穿梭器自动生成数据集名称 */
const setDataSetName = (value: Array<string>) => {
  if (value.length > 0 && !addTrainData.dataSetName) {
    addTrainData.dataSetName = labelTaskList.value.find((e: any) => e.key === value[0]).label.split(' : ')[1]
  }
}
/**初始化 */
const reflush = () => {
  getListPage(currentPage.value)
}
let timer = undefined as any
watch(
  () => props.isCheck,
  (newValue, oldValue) => {
    if (newValue && !timer) {
      reflush()
      timer = setInterval(function () {
        getListPage(currentPage.value)
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

<style>
.el-transfer-panel {
  width: 380px;
}
.data-type-tag {
  margin-right: 3px;
  padding: 1px 2px;
}
.upload-delete {
  margin-left: 30px;
}
</style>
