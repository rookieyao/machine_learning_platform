<template>
  <div>
    <el-form label-width="120px" :inline="true" :model="filter" ref="charWordVectorSearchRef">
      <el-form-item label="字词向量名称">
        <el-input v-model="filter.charWordVectorName" @change="getListPage(1)"></el-input>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="filter.processState" @change="getListPage(1)">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(k, v) in processState" :value="v" :label="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListPage(currentPage)">查询</el-button>
        <el-button type="info" @click="charWordVectorSearchResetFields(charWordVectorSearchRef)">重置查询条件</el-button>
        <el-button type="primary" @click="addCharWordVectorVisible = !addCharWordVectorVisible">新增词向量</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="charWordVectorData" stripe table-layout="auto">
      <el-table-column type="expand">
        <template #default="props">
          <div class="table-expand">
            <p>原始语料文件：{{ props.row.originDataNameList }}</p>
            <p>向量维度：{{ props.row.vectorDimension }}</p>
            <p>窗口大小：{{ props.row.windowSize }}</p>
            <p>最小词频：{{ props.row.minWordFrequency }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="序号" prop="index"></el-table-column>
      <el-table-column label="字词向量名称" prop="charWordVectorName"></el-table-column>
      <el-table-column label="处理状态" prop="processState">
        <template #default="scope">
          {{ processState[scope.row.processState] }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="当前处理进度" prop="currentStage"></el-table-column> -->
      <el-table-column label="数据是否最新" prop="latestData">
        <template #default="scope">
          <span v-if="scope.row.latestData === 1">
            <el-icon color="green">
              <Check></Check>
            </el-icon>
          </span>
          <span v-else>
            <el-icon color="red">
              <Close></Close>
            </el-icon>
          </span>
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
          <el-button text type="primary" @click="charWordVectorUpdateClick(scope.row)">编辑</el-button>
          <el-popconfirm v-if="scope.row.processState !== 1" title="确认要删除？" confirm-button-text="确认" cancel-button-text="取消" @confirm="charWordVectorDeleteClick(scope.row.id)">
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button v-if="scope.row.latestData === 0" text type="primary" @click="charWordVectorManualUpdate(scope.row.id)">手动更新</el-button>
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
    <el-dialog v-model="addCharWordVectorVisible" title="新增词向量" @close="addCharWordVectorClean(addCharWordVectorFormRef)" width="1200px">
      <el-form label-width="120px" ref="addCharWordVectorFormRef" :model="addCharWordVector" :rules="addCharWordVectorRules">
        <el-form-item label="字词向量名称" prop="charWordVectorName">
          <el-input v-model="addCharWordVector.charWordVectorName"></el-input>
        </el-form-item>
        <el-form-item label="原始语料文件" prop="originDataIdList">
          <el-transfer
            v-if="!charWordVectorDisable"
            v-model="addCharWordVector.originDataIdList"
            :data="originDataList"
            :filterable="true"
            filter-placeholder="请输入原始数据名称"
            :titles="['原始数据列表', '选中列表']"
            @change="setCharWordVectorName"
          ></el-transfer>
          <span v-else>{{ addCharWordVector.originDataIdList.join() }}</span>
        </el-form-item>
        <el-form-item label="向量维度" prop="vectorDimension">
          <el-input-number v-model="addCharWordVector.vectorDimension" :min="0" :max="300" :disabled="true"></el-input-number>
        </el-form-item>
        <el-form-item label="窗口大小" prop="windowSize">
          <el-input-number v-model="addCharWordVector.windowSize" :min="0" :max="10" :disabled="true"></el-input-number>
        </el-form-item>
        <el-form-item label="最小词频" prop="minWordFrequency">
          <el-input-number v-model="addCharWordVector.minWordFrequency" :min="0" :disabled="true"></el-input-number>
        </el-form-item>
        <el-form-item label="向量类型" prop="vectorType">
          <el-checkbox v-model="addCharWordVector.vectorType[0]" true-label="1" false-label="0" :disabled="charWordVectorDisable">字</el-checkbox>
          <el-checkbox v-model="addCharWordVector.vectorType[1]" true-label="1" false-label="0" :disabled="charWordVectorDisable">词</el-checkbox>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addCharWordVector.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!charWordVectorDisable" type="info" @click="addCharWordVectorClean(addCharWordVectorFormRef)">重置</el-button>
          <el-button v-if="addCharWordVector.id" type="primary" @click="updateCharWordVector(addCharWordVectorFormRef)">保存</el-button>
          <el-button v-else type="primary" @click="addCharWordVectorSubmit(addCharWordVectorFormRef)">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref, nextTick, onDeactivated, watch } from 'vue'
import { originDataService, charWordVectorService } from '../api/aiPlatform'
import { charWordVectorListPageReq, charWordVectorUpdateByIdReq, charWordVectorAddReq } from '../api/types'
import { processState } from '../api/info'
const props = defineProps(['isCheck'])
const loading = ref(false)
/**获取列表分页结果 */
const charWordVectorData = ref([] as any)
/**重置查询条件 */
const charWordVectorSearchResetFields = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getListPage(1)
}
/**查询 */
const charWordVectorSearchRef = ref()
const getListPage = async (page: number) => {
  loading.value = true
  const listPageFilter: charWordVectorListPageReq = { pageNum: page, pageSize: pageSize.value, charWordVectorName: null, processState: null }
  if (filter.charWordVectorName) {
    listPageFilter.charWordVectorName = filter.charWordVectorName
  }
  if (filter.processState) {
    listPageFilter.processState = filter.processState
  }
  const res = await charWordVectorService.charWordVectorListPage(listPageFilter)
  currentPage.value = page
  charWordVectorData.value = res.data.list.map((e: any, index: number) => {
    e.index = index + 1 + (currentPage.value - 1) * pageSize.value
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
}
/**分页 */
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
/**filter查询 */
const filter = reactive({
  charWordVectorName: '',
  processState: ''
})
/**字词向量类型检测 */
const vectorTypeValidator = (rule: any, value: any, callback: any) => {
  if (value[0] === '0' && value[1] === '0') {
    callback(new Error('请选择至少一个字词向量类型'))
  }
  callback()
}
/**新增词向量 */
const addCharWordVectorVisible = ref(false)
const addCharWordVectorFormRef = ref<FormInstance>()
const addCharWordVectorRules = reactive<FormRules>({
  charWordVectorName: [{ required: true, message: '请输入字词向量名称', trigger: 'change' }],
  originDataIdList: [{ required: true, message: '请选择原始语料', trigger: 'change' }],
  vectorDimension: [
    { required: true, message: '请输入字词向量维度' },
    { type: 'number', min: 0, max: 300, message: '向量维度范围为0-300', trigger: 'blur' }
  ],
  windowSize: [
    { required: true, message: '请输入字词向量窗口大小' },
    { type: 'number', min: 0, message: '请输入正确的窗口大小', trigger: 'blur' }
  ],
  minWordFrequency: [
    { required: true, message: '请输入字词向量最小词频' },
    { type: 'number', min: 0, message: '请输入正确的最小词频', trigger: 'blur' }
  ],
  vectorType: [{ validator: vectorTypeValidator, trigger: 'change' }]
})
const addCharWordVector = reactive({
  id: '',
  charWordVectorName: '',
  originDataIdList: [],
  vectorDimension: 100,
  windowSize: 5,
  minWordFrequency: 3,
  vectorType: ['1', '1'],
  remark: ''
})

/**新增字词向量 */
const addCharWordVectorSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data: charWordVectorAddReq = {
        charWordVectorName: addCharWordVector.charWordVectorName,
        vectorDimension: addCharWordVector.vectorDimension,
        windowSize: addCharWordVector.windowSize,
        minWordFrequency: addCharWordVector.minWordFrequency,
        vectorType: addCharWordVector.vectorType.join(''),
        remark: addCharWordVector.remark,
        originDataIdList: addCharWordVector.originDataIdList
      }
      const res = await charWordVectorService.charWordVectorAdd(data)
      if (res.status === 200) {
        ElMessage.success('字词向量开始训练')
        addCharWordVectorVisible.value = false
        getListPage(1)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**重置新增字词向量表单 */
const addCharWordVectorClean = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  // await nextTick()
  charWordVectorDisable.value = false
  formEl.resetFields()
}
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
/**字词向量更新 */
const charWordVectorDisable = ref(false)
const charWordVectorUpdateClick = async (row: any) => {
  addCharWordVectorVisible.value = true
  await nextTick()
  charWordVectorDisable.value = true
  addCharWordVector.id = row.id
  addCharWordVector.charWordVectorName = row.charWordVectorName
  addCharWordVector.originDataIdList = row.originDataNameList
  addCharWordVector.vectorDimension = row.vectorDimension
  addCharWordVector.windowSize = row.windowSize
  addCharWordVector.minWordFrequency = row.minWordFrequency
  addCharWordVector.vectorType = row.vectorType.split('')
  addCharWordVector.remark = row.remark
}
const updateCharWordVector = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data: charWordVectorUpdateByIdReq = {
        id: addCharWordVector.id,
        charWordVectorName: addCharWordVector.charWordVectorName,
        remark: addCharWordVector.remark
      }
      const res = await charWordVectorService.charWordVectorUpdateById(data)
      if (res.status === 200) {
        ElMessage.success('更新成功')
        addCharWordVectorVisible.value = false
        getListPage(currentPage.value)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**字词向量删除 */
const charWordVectorDeleteClick = async (id: string) => {
  const res = await charWordVectorService.charWordVectorDeleteById(id)
  if (res.status === 200) {
    ElMessage.success('删除成功')
    getListPage(currentPage.value)
  }
}
/**手动更新字词向量 */
const charWordVectorManualUpdate = async (id: string) => {
  const res = await charWordVectorService.charWordVectorManualUpdate({ id: id })
  if (res.status === 200) {
    ElMessage.success('手动更新成功')
    getListPage(currentPage.value)
  }
}
/**选中原始语料自动生成项目名 */
const setCharWordVectorName = (value: Array<string>) => {
  if (value.length > 0 && !addCharWordVector.charWordVectorName) {
    addCharWordVector.charWordVectorName = originDataList.value.find((e: any) => e.key === value[0])?.label || ''
  }
}
/**初始化 */
const init = async () => {
  getListPage(1)
  getOriginDataList()
}
// onMounted(() => {
//   // init()
// })
let timer = undefined as any
const reflush = () => {
  getListPage(currentPage.value)
  getOriginDataList()
}
watch(
  () => props.isCheck,
  (newValue, oldValue) => {
    if (newValue && !timer) {
      // 立即更新一次数据
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
</style>
