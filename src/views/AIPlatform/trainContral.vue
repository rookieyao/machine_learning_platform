<template>
  <div class="compoent-main">
    <el-form label-width="80px" :inline="true" :model="filter" ref="trainContralSearchRef">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="filter.projectName" @change="getListPage(1)"></el-input>
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType">
        <el-select v-model="filter.projectType" @change="getListPage(1)">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(k, v) in projectType" :value="v" :label="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模型类型" prop="dataType">
        <el-select v-model="filter.modelType" @change="getListPage(1)">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(k, v) in dataType" :value="v" :label="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListPage(1)">查询</el-button>
        <el-button type="info" @click="trainContralSearchResetFields(trainContralSearchRef)">重置查询条件</el-button>
        <el-button type="primary" @click="addTrainProjectVisble = !addTrainProjectVisble">新增项目</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="trainProjectDataRef"
      v-loading="loading"
      :data="trainProjectData"
      stripe
      table-layout="auto"
      row-key="id"
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :load="loadOldVersion"
    >
      <el-table-column label="序号" prop="index" width="55px"></el-table-column>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="项目类型" prop="projectType" width="80px">
        <template #default="scope">
          {{ projectType[scope.row.projectType] }}
        </template>
      </el-table-column>
      <el-table-column label="模型类型(版本)" prop="modelType">
        <template #default="scope">
          <span>{{ dataType[scope.row.modelType] }}-{{ scope.row.trainModelVersion }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="模型版本" prop="trainModelVersion"></el-table-column> -->
      <el-table-column label="字词向量名称" prop="charWordVectorName"></el-table-column>
      <el-table-column label="训练数据名称" prop="dataSetVersionName"></el-table-column>
      <el-table-column label="模型状态" prop="modelState">
        <template #default="scope">
          <span>{{ modelState[scope.row.modelState.toString()] }}</span>
          <template v-if="scope.row.modelState === 3">
            <el-tooltip placement="top" effect="light">
              <template #content>
                <p>{{ scope.row.trainErrorLog ?? '未知的错误' }}</p>
              </template>
              <el-icon>
                <WarningFilled></WarningFilled>
              </el-icon>
            </el-tooltip>
          </template>
          <template v-if="[1, 2].includes(scope.row.modelState)">
            <el-progress
              :percentage="Number(scope.row.trainPercent)"
              :color="[
                { color: '#409eff', percentage: 99 },
                { color: '#67c23a', percentage: 100 }
              ]"
            ></el-progress>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="最佳 F1" prop="modelAssesmentInfo">
        <template #default="scope">
          <span v-if="JSON.parse(scope.row.modelAssesmentInfo)"> {{ JSON.parse(scope.row.modelAssesmentInfo)?.best_f1 }} @{{ JSON.parse(scope.row.modelAssesmentInfo)?.best_epoch }} </span>
        </template>
      </el-table-column>
      <el-table-column label="当前 F1" prop="modelAssesmentInfo">
        <template #default="scope">
          <span v-if="JSON.parse(scope.row.modelAssesmentInfo)"> {{ JSON.parse(scope.row.modelAssesmentInfo)?.current_f1 }} @{{ JSON.parse(scope.row.modelAssesmentInfo)?.current_epoch }} </span>
        </template>
      </el-table-column>
      <el-table-column label="剩余训练轮数" prop="modelAssesmentInfo">
        <template #default="scope">
          {{ JSON.parse(scope.row.modelAssesmentInfo)?.patience }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="creator"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm v-if="scope.row.modelState === -1" title="确认要开始训练？" confirm-button-text="确认" cancel-button-text="取消" @confirm="startTrain(scope.row.id)">
            <template #reference>
              <el-button text type="primary">开始训练</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="[2, 3].includes(scope.row.modelState)" title="确认要重新训练？" confirm-button-text="确认" cancel-button-text="取消" @confirm="reStartTrain(scope.row.id)">
            <template #reference>
              <el-button text type="primary">重新训练</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm v-if="scope.row.modelState !== 1" title="确认要删除？" confirm-button-text="确认" cancel-button-text="取消" @confirm="trainDataDeleteById(scope.row.id)">
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
    <el-dialog v-model="addTrainProjectVisble" title="新增项目" @close="addTrainProjectClean(addTrainProjectFormRef)">
      <el-form label-width="120px" ref="addTrainProjectFormRef" :model="addTrainProjectData" :rules="addTrainProjectRules">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="addTrainProjectData.projectName"
            placeholder="请输入模型名称,项目名称只能由小写英文字母,数字,'-'','_'组成,首字母只能为英文,建议以品牌_项目的形式,例如oppo_phone"
          ></el-input>
        </el-form-item>
        <el-form-item label="训练数据集" prop="trainDataVersionId">
          <el-select v-model="addTrainProjectData.trainDataVersionId" filterable style="width: 300px;" @change="trainDataChange">
            <el-option
              v-for="train in trainDataAll"
              :value="train.id"
              :label="`${train.dataSetName}_${language[train.labelLanguage]}_${projectType[train.projectType]}_${train.dataSetVersion}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型" prop="modelTypeList">
          <el-checkbox-group v-if="modelTypeCheckBoxGroup" v-model="addTrainProjectData.modelTypeList">
            <el-checkbox v-for="t in modelTypeCheckBoxGroup" :label="t"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="字词向量名称" prop="charWordVectorId">
          <el-select v-model="addTrainProjectData.charWordVectorId" filterable>
            <el-option v-for="c in charWordVectorList" :value="c.id" :label="`${c.charWordVectorName}${c.latestData === '1' ? '(old)' : ''}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addTrainProjectData.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addTrainProjectClean(addTrainProjectFormRef)">重置</el-button>
          <el-button type="primary" @click="addTrainProjectSubmit(addTrainProjectFormRef)">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onActivated, onDeactivated, onMounted, reactive, ref } from 'vue'
import { charWordVectorService, trainDataService, trainModelService } from './api/aiPlatform'
import { trainModelListPageReq, trainModelInsertTrainModelVersionReq } from './api/types'
import { dataType, modelState, projectType, language } from './api/info'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
const loading = ref(false)
/**分页 */
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
/**filter查询 */
const filter = reactive({
  projectName: '',
  projectType: '',
  modelType: '',
  modelState: ''
})
/**重置查询参数 */
const trainContralSearchResetFields = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getListPage(1)
}
/**获取任务列表 */
const trainProjectData = ref([])
const trainProjectRef = ref()
const trainContralSearchRef = ref()
const getListPage = async (page: number) => {
  loading.value = true
  const listPageFilter: trainModelListPageReq = { pageNum: page, pageSize: pageSize.value, projectName: null, projectType: null, modelType: null, trainModelVersion: null }
  if (filter.projectName) {
    listPageFilter.projectName = filter.projectName
  }
  if (filter.projectType) {
    listPageFilter.projectType = Number(filter.projectType)
  }
  if (filter.modelType) {
    listPageFilter.modelType = filter.modelType
  }
  const res = await trainModelService.trainModelList(listPageFilter)
  currentPage.value = page
  trainProjectData.value = res.data.list.map((e: any, index: number) => {
    e.index = index + 1 + (currentPage.value - 1) * pageSize.value
    e.hasChildren = true
    return e
  })
  total.value = res.data.total
  currentPage.value = res.data.pageNum
  loading.value = false
  await nextTick()
  reloadTable()
}
/**查询历史的版本 */
const loadMap = ref(new Map())
const loadOldVersion = async (row: any, treeNode: unknown, resolve: (date: any[]) => void) => {
  //将获取到的节点数据添加到loadMap变量中
  loadMap.value.set(row.trainModelId, { row, treeNode, resolve })
  const res = await trainModelService.trainModelGetTrainModelVersionListByTrainModelId(row.trainModelId, row.id)
  resolve(res.data)
}
// 重置表格懒加载信息
const reloadTable = () => {
  loadMap.value.forEach((e: any) => {
    const { row, treeNode, resolve } = e
    // 判断展开的行是不是最新的行，避免新增版本后id不同
    const tableRow = trainProjectRef.value.data.find((e: any) => e.trainModelId === row.trainModelId)
    trainProjectRef.value.store.states.lazyTreeNodeMap.value[row.id] = []
    if (row.id === tableRow.id) {
      // 还是相同的id则清空之前的并重新加载
      loadOldVersion(row, treeNode, resolve)
    }
  })
}
/**获取所有的训练数据列表 */
const trainDataAll = ref()
const getTrainDataAll = async () => {
  const res = await trainDataService.trainDataListAll()
  trainDataAll.value = res.data
}
/**获取所有的字词向量列表 */
const charWordVectorList = ref()
const getCharWordVectorAll = async () => {
  const res = await charWordVectorService.charWordVectorListAll()
  charWordVectorList.value = res.data
}
/**切换训练数据集更新数据类型 */
const modelTypeCheckBoxGroup = ref<string[]>([])
const trainDataChange = (id: string) => {
  addTrainProjectData.modelTypeList.splice(0, addTrainProjectData.modelTypeList.length)
  const row = trainDataAll.value.find((e: any) => e.id === id)
  if (!row.dataType) {
    ElMessage.warning('没有正确的数据类型')
    return
  }
  modelTypeCheckBoxGroup.value = row.dataType.split(',')
  addTrainProjectData.projectType = row.projectType
  addTrainProjectData.trainDataVersionId = row.id
}
/**新增项目 */
const addTrainProjectFormRef = ref<FormInstance>()
const addTrainProjectRules = reactive<FormRules>({
  projectName: [
    { pattern: /^[a-z][a-z0-9_\-]*$/, message: '项目名称只能由小写英文字母,数字,"-","_"组成,首字母只能为英文,例如oppo_phone', trigger: ['blur', 'change'] },
    { required: true, message: '请输入项目名称' }
  ],
  trainDataVersionId: [{ required: true, message: '请选择训练集', trigger: 'change' }],
  modelTypeList: [{ required: true, message: '至少选择一个数据类型', trigger: 'change' }],
  charWordVectorId: [{ required: true, message: '请选择使用的字词向量' }]
})
const addTrainProjectVisble = ref(false)
const addTrainProjectData = reactive({
  projectName: '',
  projectType: Number(),
  trainDataVersionId: '',
  modelTypeList: [],
  charWordVectorId: '',
  remark: ''
})
const addTrainProjectSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data: trainModelInsertTrainModelVersionReq = {
        projectName: addTrainProjectData.projectName,
        projectType: addTrainProjectData.projectType,
        modelTypeList: addTrainProjectData.modelTypeList,
        charWordVectorId: addTrainProjectData.charWordVectorId,
        trainDataVersionId: addTrainProjectData.trainDataVersionId,
        remark: addTrainProjectData.remark
      }
      const res = await trainModelService.trainModelInsertTrainModelVersion(data)
      if (res.status === 200) {
        ElMessage.success('训练创建成功')
        addTrainProjectVisble.value = false
        addTrainProjectClean(addTrainProjectFormRef.value)
        getListPage(currentPage.value)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**重置参数 */
const addTrainProjectClean = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  modelTypeCheckBoxGroup.value.splice(0, modelTypeCheckBoxGroup.value.length + 1)
}
/**删除项目 */
const trainDataDeleteById = async (id: string) => {
  const res = await trainModelService.trainModelDeleteById(id)
  if (res.status === 200) {
    ElMessage.success('删除成功')
    getListPage(currentPage.value)
  }
}
/**开始训练 */
const startTrain = async (id: string) => {
  const res = await trainModelService.trainModelStartTrain({ trainModelVersionId: id })
  if (res.status === 200) {
    ElMessage.success('开始训练')
    getListPage(currentPage.value)
  }
}
/**重新训练 */
const reStartTrain = async (id: string) => {
  const res = await trainModelService.trainModelReStartTrain({ trainModelVersionId: id })
  if (res.status === 200) {
    ElMessage.success('开始训练')
    getListPage(currentPage.value)
  }
}
/**初始化 */
const init = () => {
  getListPage(1)
  getTrainDataAll()
  getCharWordVectorAll()
}
// onMounted(() => {
//   init()
// })

let timer = undefined as any
onActivated(() => {
  init()
  timer = setInterval(function () {
    getListPage(currentPage.value)
  }, 60000)
})
onDeactivated(() => {
  clearInterval(timer)
})
</script>

<style scoped></style>
