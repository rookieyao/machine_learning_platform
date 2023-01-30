<template>
  <div>
    <el-row style="padding: 20px;">
      <el-col :span="8">
        <el-divider>任务配置</el-divider>
        <el-radio-group v-model="exportType" style="padding-left: 130px;">
          <el-radio label="mongo">从数据库中导出</el-radio>
          <el-radio label="upload">通过上传文件导出</el-radio>
        </el-radio-group>
        <el-form v-if="exportType === 'mongo'" ref="exportMongoFormRef" :model="exportMongoData" :rules="exportMongoRules" label-width="130px">
          <el-form-item label="数据库链接" prop="mongo">
            <el-input v-model="exportMongoData.mongo" placeholder="请输入数据库链接,例如mongodb://127.0.0.1:27017/"></el-input>
          </el-form-item>
          <el-form-item label="数据库名称" prop="db">
            <el-input v-model="exportMongoData.db" placeholder="请输入导出数据所在库名"></el-input>
          </el-form-item>
          <el-form-item label="数据库表名" prop="collection">
            <el-input v-model="exportMongoData.collection" placeholder="请输入导出数据所在表名"></el-input>
          </el-form-item>
          <el-form-item label="数据结构" prop="type">
            <el-select v-model="exportMongoData.type">
              <el-option v-for="(key, value) in exportTypeList" :disabled="value.toString() === 'yunting'" :label="key" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="最大导出数量" prop="maxExportCount">
            <el-input-number v-model="exportMongoData.maxExportCount" :min="100" :step="100" :step-strictly="true" :controls="false"></el-input-number>
          </el-form-item> -->
          <el-form-item>
            <el-button @click="FormReset(exportMongoFormRef)">重置</el-button>
            <el-button type="primary" @click="exportMongoSubmit(exportMongoFormRef)">提交</el-button>
          </el-form-item>
        </el-form>
        <el-form v-else ref="exportUploadFormRef" :model="exportUploadData" :rules="exportUploadRules" label-width="130px">
          <el-form-item label="文件上传">
            <el-upload
              ref="uploadRef"
              :limit="1"
              :auto-upload="false"
              accept="text/plain,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.jsonl"
              :on-exceed="handleExceed"
              :before-upload="handleAvatarBefore"
              :http-request="uploadFileAction"
            >
              <template #trigger>
                <el-button type="primary">选择上传文件</el-button>
              </template>
              <template #tip></template>
            </el-upload>
          </el-form-item>
          <el-form-item label="评论所在列名">
            <el-input v-model="exportUploadData.colname" placeholder="上传文件为excel且数据结构为默认时可用,默认留空即可"></el-input>
          </el-form-item>
          <el-form-item label="数据结构" prop="type">
            <el-select v-model="exportUploadData.type">
              <el-option v-for="(key, value) in exportTypeList" :label="key" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="最大导出数量" prop="maxExportCount">
            <el-input-number v-model="exportUploadData.maxExportCount" :min="100" :step="100" :step-strictly="true" :controls="false"></el-input-number>
          </el-form-item> -->
          <el-form-item>
            <el-button @click="FormReset(exportUploadFormRef)">重置</el-button>
            <el-button type="primary" @click="exportUploadSubmit(exportUploadFormRef)">提交</el-button>
          </el-form-item>
        </el-form>
        <div>
          <h4>注意事项：</h4>
          <p>1.该工具主要用于导出可用于机器学习平台的原始数据结构</p>
          <p>2.导出的数据结构为[{"role":"customer","text":"服务很好很不错。"}]</p>
          <p>3.AS模型数据结构请选择【默认】,上传文件为txt或excel文件</p>
          <p>4.任务名称为数据库表名或上传文件名称</p>
          <p>5.目前只支持以上类型导出，如有新数据源请通知管理员添加</p>
        </div>
      </el-col>
      <el-col :span="15" :offset="1">
        <el-divider>
          任务列表
          <el-icon @click="getExportJob()">
            <Refresh></Refresh>
          </el-icon>
        </el-divider>
        <el-form :inline="true">
          <el-form-item label="任务名">
            <el-input v-model="filter.name" placeholder="请输入查询名称" @change="getExportJob"></el-input>
          </el-form-item>
        </el-form>
        <el-table :data="jobData">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="name" label="任务名"></el-table-column>
          <el-table-column prop="msg" label="状态">
            <template #default="scope">
              <span v-if="scope.row.status === '-1'">
                任务出错
                <el-tooltip placement="top" effect="light">
                  <template #content>
                    <span>{{ scope.row.msg }}</span>
                  </template>
                  <el-icon>
                    <WarningFilled></WarningFilled>
                  </el-icon>
                </el-tooltip>
              </span>
              <span v-else>{{ scope.row.msg }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="导出类型">
            <template #default="scope">
              {{ exportTypeList[scope.row.type] }}
            </template>
          </el-table-column>
          <el-table-column prop="total" label="导出数据量"></el-table-column>
          <el-table-column prop="username" label="创建人"></el-table-column>
          <el-table-column prop="created_at" label="创建时间"></el-table-column>
          <el-table-column prop="updated_at" label="更新时间"></el-table-column>
          <el-table-column label="导出结果">
            <template #default="scope">
              <el-button v-if="scope.row.resultFile" text type="primary" @click="download(scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:currentPage="currentPage" :total="total" layout="prev, pager, next" @current-change="getExportJob"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import downloadFile from '@/utils/downloadFile'
import { ElMessage, FormInstance, FormRules, genFileId, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { JobService } from './api/job'

const exportType = ref('mongo')
/**mongo导出 */
const exportMongoFormRef = ref<FormInstance>()
const exportMongoData = reactive({
  mongo: '',
  db: '',
  collection: '',
  type: 'default',
  // maxExportCount: 50000
})
const exportMongoRules = reactive<FormRules>({
  mongo: [{ required: true, message: '请输入数据库地址', trigger: ['change', 'trigger'] }],
  db: [{ required: true, message: '请输入数据库名称', trigger: ['change', 'trigger'] }],
  collection: [{ required: true, message: '请输入数据库表名', trigger: ['change', 'trigger'] }],
  type: [{ required: true, message: '请选择导出类型', trigger: ['change', 'trigger'] }],
  // maxExportCount: [{ required: true, message: '请输入导出最大数量', trigger: ['change', 'trigger'] }]
})
/**mongo类型导出 */
const FormReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const exportMongoSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (vaild, filelds) => {
    if (vaild) {
      const data = {
        mongo: exportMongoData.mongo,
        db: exportMongoData.db,
        collection: exportMongoData.collection,
        // count: exportMongoData.maxExportCount,
        type: exportMongoData.type
      }
      const res = await JobService.exportMongo(data)
      if (res.status === 200) {
        ElMessage.success('创建导出任务成功')
        getExportJob()
      }
    }
  })
}
/**文件上传导出 */
const exportUploadFormRef = ref<FormInstance>()
const exportUploadData = reactive({
  type: 'default',
  // maxExportCount: 50000,
  colname: ''
})
const exportUploadRules = ref<FormRules>({
  type: [{ required: true, message: '请选择导出类型', trigger: ['change', 'trigger'] }],
  // maxExportCount: [{ required: true, message: '请输入导出最大数量', trigger: ['change', 'trigger'] }]
})
const exportUploadSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((vaild, fields) => {
    if (vaild) {
      uploadRef.value!.submit()
    }
  })
}
/**文件上传 */
const uploadRef = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
const handleAvatarBefore = (file: any) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['txt', 'xlsx', 'xls', 'csv', 'jsonl']
  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage.error(`上传的文件只能是${whiteList.join(',')}`)
    return false
  }
}
const uploadFileAction = async (files: any) => {
  const uploadForm = new FormData()
  uploadForm.append('file', files.file)
  uploadForm.append('colname', exportUploadData.colname)
  // uploadForm.append('count', exportUploadData.maxExportCount.toString())
  uploadForm.append('type', exportUploadData.type)
  const res = await JobService.exportUpload(uploadForm)
  if (res.status === 200) {
    ElMessage.success('任务创建成功，请稍等')
    getExportJob()
  }
}
/**获取支持的导出任务类型 */
const exportTypeList = ref()
const getExportType = async () => {
  const res = await JobService.exportType()
  exportTypeList.value = res.data
}
/**任务列表分页 */
const currentPage = ref(1)
const total = ref(0)
/**获取导出任务列表 */
const filter = reactive({
  name: '',
  type: ''
})
const jobData = ref()
const getExportJob = async () => {
  const params = { page: currentPage.value, name: undefined } as any
  if (filter.name) {
    params.name = filter.name
  }
  const res = await JobService.exportJob(params)
  jobData.value = res.data.jobs
  total.value = res.data.total
}
/**下载文件 */
const download = (row: any) => {
  const filename = row.resultFile
  downloadFile('/api/tools/datajob/download/' + filename, filename, 'get', undefined)
}
onMounted(() => {
  getExportType()
  getExportJob()
})
</script>

<style scoped></style>
