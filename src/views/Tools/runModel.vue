<template>
  <div>
    <el-row style="padding: 20px;">
      <el-col :span="8">
        <el-divider>任务配置</el-divider>
        <!-- 任务配置 -->
        <el-form ref="ruleFormRef" label-width="130px" :model="config" :rules="configRules">
          <el-form-item label="任务类型" prop="jobType">
            <el-select v-model="config.jobType" @change="getModelList">
              <el-option label="产品洞察" value="as"></el-option>
              <el-option label="服务洞察" value="cs"></el-option>
              <el-option label="场景挖掘" value="scene"></el-option>
              <el-option label="关键词提取" value="keywords"></el-option>
              <el-option label="通用情感" value="sentiment"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型接口" prop="modelUri">
            <div v-if="['as', 'cs'].includes(config.jobType)">
              <el-cascader ref="cascaderRef" v-if="searchType" v-model="config.cascaderModelUri" :options="modelOption" style="width: 215px;" @change="aiModelChange">
                <template #default="{node,data}">
                  <span>{{ data.label }}</span>
                  <span v-if="node.isLeaf && data.serviceAvailable === '0'">(不可用)</span>
                </template>
              </el-cascader>
              <el-input v-else v-model="config.modelUri" placeholder="请输入端口号" style="width: 215px;" @change="inputModelUriChange"></el-input>
              <el-button :icon="Switch" text @click="changeModelType"></el-button>
            </div>
            <div v-else>
              <el-select v-model="config.modelUri" filterable allow-create default-first-option @change="selectModelUriChange">
                <el-option v-for="model in modelOption" :value="model.uri" :label="model.name"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="原始数据">
            <el-upload
              ref="uploadRef"
              :limit="1"
              :auto-upload="false"
              accept="text/plain,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              :on-exceed="handleExceed"
              :before-upload="handleAvatarBefore"
              :on-success="handleAvatarSuccess"
              :http-request="uploadFileAction"
            >
              <template #trigger>
                <el-button type="primary">选择上传文件</el-button>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <template #label>
              <span v-if="config.jobType === 'scene'">过滤标签</span>
              <span v-else>导出字段</span>
            </template>
            <el-checkbox-group v-if="config.jobType === 'scene'" v-model="outputCheck" @change="outputCheckChange">
              <el-checkbox label="user"></el-checkbox>
              <el-checkbox label="buyer"></el-checkbox>
              <el-checkbox label="relations"></el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-if="config.jobType === 'as'" v-model="outputCheck" @change="outputCheckChange">
              <el-tooltip content="所有的指标，指标情感未选中时可用">
                <el-checkbox label="aspect">指标</el-checkbox>
              </el-tooltip>
              <el-tooltip content="所有的情感，指标情感未选中时可用">
                <el-checkbox label="sentiment">情感</el-checkbox>
              </el-tooltip>
              <el-checkbox label="snippet">片段</el-checkbox>
              <el-checkbox label="generic_sentiment">通用情感</el-checkbox>
              <el-tooltip content="指标和情感的组合，类似云听导出">
                <el-checkbox label="aspect_sentiment">指标情感</el-checkbox>
              </el-tooltip>
            </el-checkbox-group>
            <el-checkbox-group v-if="config.jobType === 'cs'" v-model="outputCheck" @change="outputCheckChange">
              <el-checkbox label="aspect">指标</el-checkbox>
              <el-tooltip content="咨询/求助，正面，负面">
                <el-checkbox label="intent">意图</el-checkbox>
              </el-tooltip>
              <el-checkbox label="snippet">片段</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-if="config.jobType === 'keywords'" v-model="outputCheck" @change="outputCheckChange">
              <el-checkbox label="pos">词性</el-checkbox>
              <el-checkbox label="weight">权重</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="评论/会话的列名" prop="columnName">
            <el-select v-model="config.columnName" filterable allow-create default-first-option>
              <el-option label="评论内容" value="评论内容" />
              <el-option label="评价内容" value="评价内容" />
              <el-option label="评论" value="评论" />
              <el-option label="评价" value="评价" />
              <el-option label="商品评论" value="商品评论" />
              <el-option label="商品评价" value="商品评价" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="config.jobType === 'cs'" label="客户名称列名" prop="customerColumnName">
            <el-input v-model="config.customerColumnName" placeholder="可为空，会话为多个对话，且存在客户名称时使用"></el-input>
          </el-form-item>
          <el-form-item v-if="config.jobType === 'cs'" label="客服名称列名" prop="waiterColumnName">
            <el-input v-model="config.waiterColumnName" placeholder="可为空，会话为多个对话，且存在客服名称时使用"></el-input>
          </el-form-item>
          <el-form-item v-if="config.jobType === 'keywords'" label="TopK" prop="topK">
            <el-input-number v-model="config.topK" :max="20" :min="1" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="事由" prop="cause">
            <el-input v-model="config.cause" placeholder="请输入使用事由"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
          </el-form-item>
        </el-form>
        <div>
          <h4>注意事项：</h4>
          <p>1.文件只支持excel(xlsx,xls,csv)格式和txt格式</p>
          <p>2.模型只提供当前线上使用模型，需要其他版本模型请向NLP申请</p>
          <p>3.服务洞察只有部分模型有意图结果，请使用前先确定是否有意图</p>
          <p>
            4.评论的列名为用来跑模型的文本，如果是excel文件则是必须和文件中评论的列名一致，否则将没有结果，如果是txt文件则表示输出结果的评论列名
          </p>
          <p>5.excel只会追加模型的结果，不会删减其他字段</p>
          <p>6.启动模型需要时间，建议等待1分钟后使用</p>
          <p>7.场景挖掘为过滤标签，默认不选</p>
        </div>
      </el-col>
      <el-col :span="14" :offset="2">
        <el-divider>任务列表(只展示最近的50个)</el-divider>
        <el-table :data="jobList.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
          <el-table-column type="expand">
            <template #default="scope">
              <el-space direction="vertical" alignment="left">
                <p>模型接口 : {{ scope.row.config.model_uri }}</p>
                <p>模型类型 : {{ scope.row.job_type }}</p>
                <p>申请人 : {{ scope.row.username }}</p>
                <p>使用事由 : {{ scope.row.cause }}</p>
                <p>导出配置 : {{ scope.row.config.output }}</p>
              </el-space>
            </template>
          </el-table-column>
          <el-table-column prop="job_name" label="任务"></el-table-column>
          <el-table-column prop="job_info.msg" label="进程">
            <template #default="scope">
              <span>{{ scope.row.job_info.msg }}</span>
              <el-progress :percentage="getPercentage(scope.row)"></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="config.model_name" label="使用模型或项目"></el-table-column>
          <el-table-column prop="created_at" label="创建时间"></el-table-column>
          <el-table-column prop="updated_at" label="最后更新时间"></el-table-column>
          <el-table-column label="获取结果">
            <template #default="scope">
              <el-button v-if="scope.row.result_file" text type="primary" @click="download(scope.row)">获取结果</el-button>
              <el-button v-if="scope.row.job_info.status === '-1'" text type="primary" @click="restart(scope.row.id)">重启任务</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50]" layout="sizes, prev, pager, next" :total="jobList.length"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { logInfo } from '@/utils'
import { ElMessage, genFileId } from 'element-plus'
import { onActivated, onDeactivated, onMounted, reactive, ref } from 'vue'
import SceneMiningServer from '../SceneMining/api/sceneMining'
import type { FormInstance, FormRules, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { JobService, jobApi } from './api/job'
import downloadFile from '@/utils/downloadFile'
import demoService from './api/demo'
import { Switch } from '@element-plus/icons-vue'

const ruleFormRef = ref<FormInstance>()
const config = reactive({
  jobType: 'as',
  modelUri: '',
  modelName: '',
  cascaderModelUri: [],
  cause: '',
  columnName: '评论内容',
  customerColumnName: '',
  waiterColumnName: '',
  output: '',
  topK: 10
})
const configRules = reactive<FormRules>({
  jobType: [{ required: true, message: '请选择任务类型' }],
  modelUri: [{ required: true, message: '请选则使用的模型或项目' }],
  cause: [{ required: true, message: '请输入使用事由' }],
  columnName: [{ required: true, message: '请选择文件中跑数据对应的列名' }],
  upload: [{ required: true, message: '请上传原始文件' }],
  topK: [{ required: true, message: '请选择关键词最大导出数量', trigger: ['change', 'blur'] }]
})
const searchType = ref(true)
/**
 * 所有的模型接口，根据任务类型选择更新
 */
const modelOption = ref<any>([])
interface modelType {
  [as: string]: any[]
  cs: any[]
  scene: any[]
  keywords: any[]
  sentiment: any[]
}
const modelList: modelType = reactive({
  scene: [],
  keywords: [
    { name: '中文关键词', uri: 'zh' },
    { name: '英文关键词', uri: 'en' }
  ],
  sentiment: [{ name: '通用情感(微博)', uri: 'generic_weibo_sentiment' }],
  as: [],
  cs: []
})
const defaultOutput: modelType = {
  as: ['snippet', 'aspect_sentiment', 'generic_sentiment'],
  cs: ['snippet', 'intent', 'aspect'],
  keywords: ['weight', 'pos'],
  sentiment: [],
  scene: []
}
const getModelList = async () => {
  cleanconfigData()
  outputCheck.value = defaultOutput[config.jobType]
  modelOption.value = modelList[config.jobType]
  outputCheckChange(modelOption.value)
}
/**获取场景挖掘项目列表 */
const getSceneModelList = async () => {
  const res = await SceneMiningServer.getStates({})
  modelList.scene = res.data.map((e: any) => {
    return { name: e.name, uri: e.name }
  })
  getModelList()
}
/**获取机器学习平台服务列表 */
const projectServiceList = ref<any[]>([])
const getProjectService = async () => {
  const res = await demoService.listServiceVersionInfo()
  projectServiceList.value = res.data
  getAiModelList()
}
const getAiModelList = () => {
  modelList[config.jobType] = []
  projectServiceList.value.forEach((ele: any) => {
    const jobtype = ele.serviceType === '1' ? 'as' : 'cs'
    const index = modelList[jobtype].findIndex((element: any) => element.value === ele.serviceName)
    if (index < 0) {
      modelList[jobtype].push({
        value: ele.serviceName,
        label: ele.serviceName,
        children: [{ value: ele.serviceVersion, label: ele.serviceVersion, serviceAvailable: ele.serviceAvailable }]
      })
    } else {
      modelList[jobtype][index].children.push({ value: ele.serviceVersion, label: ele.serviceVersion, serviceAvailable: ele.serviceAvailable })
    }
  })
  getModelList()
}
/**切换机器学习平台需要判断服务是否启动 */
const cascaderRef = ref()
const aiModelChange = (value: any) => {
  const serviceAvailable = projectServiceList.value.find((e: any) => e.serviceVersion === value[1])!.serviceAvailable
  if (serviceAvailable === '0') {
    ElMessage.error('模型还没有启动，请先启动模型')
    config.cascaderModelUri = []
  } else {
    const project = projectServiceList.value.find((e: any) => e.serviceName === value[0] && e.serviceVersion === value[1])
    config.modelUri = project.serviceUrl
    config.modelName = `${project.serviceName}-${project.serviceVersion}`
  }
}
/**切换模型类型 */
const changeModelType = () => {
  cleanconfigData()
  searchType.value = !searchType.value
}
/**手动输入模型设置modelName */
const inputModelUriChange = (value: string) => {
  config.modelName = value
}
/**下拉框更改设置modelName */
const selectModelUriChange = (value: string) => {
  config.modelName = modelList[config.jobType].find((e) => e.uri === value).name
}
/**清空相关信息 */
const cleanconfigData = () => {
  config.modelUri = ''
  config.modelName = ''
  config.cascaderModelUri = []
}
/**
 * 多选框
 */
const outputCheck = ref<string[]>(['snippet', 'aspect_sentiment', 'generic_sentiment'])
const outputCheckChange = (value: any) => {
  config.output = value.join(',')
}
/**
 * 提交表单
 */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      uploadRef.value!.submit()
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**
 * 获取已完成任务列表
 */
const jobList = ref([])
const getJob = async () => {
  const res = await JobService.getJobs({})
  jobList.value = res.data
  totalPage.value = Math.ceil(jobList.value.length / pageSize.value)
}
/**
 * 分页
 */
const pageSize = ref(10)
const currentPage = ref(1)
const totalPage = ref(0)
/**
 * 文件上传
 */
const uploadRef = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
const uploadFileAction = async (files: any) => {
  const uploadForm = new FormData()
  uploadForm.append('file', files.file)
  uploadForm.append('model_uri', config.modelUri)
  uploadForm.append('cause', config.cause)
  uploadForm.append('job_type', config.jobType)
  uploadForm.append('model_name', config.modelName)
  uploadForm.append('colname', config.columnName)
  uploadForm.append('output', outputCheck.value.join(','))
  uploadForm.append('customer_colname', config.customerColumnName)
  uploadForm.append('waiter_colname', config.waiterColumnName)
  uploadForm.append('topK', config.topK.toString())
  const res = await JobService.uploadJob(uploadForm)
  if (res.status === 200) {
    ElMessage.success('任务创建成功，请稍等')
    getJob()
  }
}
const handleAvatarBefore = (file: any) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['txt', 'xlsx', 'xls', 'csv']
  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage.error(`上传的文件只能是${whiteList.join(',')}`)
    return false
  }
}
const handleAvatarSuccess = (response: any, uploadFile: any) => {}
/**
 * 获取进程百分比
 */
const getPercentage = (row: any) => {
  if (row.job_info.total === 0) {
    return 0
  } else {
    return Math.floor((row.job_info.index / row.job_info.total) * 100)
  }
}
/**
 * 下载文件
 */
const download = (row: any) => {
  // logInfo(filename)
  const filename = row.job_name.split('.')[0] + '_result.' + row.result_file.split('.')[1]
  downloadFile(jobApi.downloadApi + row.result_file, filename, 'get', undefined)
}
/**重启任务 */
const restart = async (id: string) => {
  const res = await JobService.restart({ id: id })
  if (res.status === 200) {
    ElMessage.success('任务重启成功')
    getJob()
  }
}
let timer = undefined as any
onActivated(() => {
  getProjectService(), getSceneModelList(), getJob()
})
onActivated(() => {
  timer = setInterval(getJob, 10000)
})
onDeactivated(() => {
  clearInterval(timer)
})
</script>

<style scoped></style>
