<template>
  <div class="compoent-main">
    <el-form label-width="120px" :inline="true" :model="filter" ref="approvingSearchRef">
      <el-form-item label="服务名称" prop="serviceName">
        <el-input v-model="filter.serviceName" @change="getListPage(1)"></el-input>
      </el-form-item>
      <el-form-item label="审核状态" prop="approveState">
        <el-select v-model="filter.approveState" @change="getListPage(1)">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(k, v) in approveState" :value="v" :label="k"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListPage(1)">查询</el-button>
        <el-button type="info" @click="approvingSearchResetFields(approvingSearchRef)">重置查询条件</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="approveData" stripe table-layout="auto">
      <el-table-column label="序号" prop="index"></el-table-column>
      <el-table-column label="服务名称" prop="serviceName"></el-table-column>
      <el-table-column label="服务版本" prop="serviceVersion"></el-table-column>
      <el-table-column label="服务类型" prop="serviceType">
        <template #default="scope">
          {{ projectType[scope.row.serviceType] }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="approveState">
        <template #default="scope">
          {{ approveState[scope.row.approveState] }}
        </template>
      </el-table-column>
      <el-table-column label="审核类型" prop="operationType">
        <template #default="scope">
          {{ operationState[scope.row.operationType] }}
        </template>
      </el-table-column>
      <el-table-column label="线上环境" prop="environmentType">
        <template #default="scope">
          {{ enviromentType[scope.row.environmentType] }}
        </template>
      </el-table-column>
      <el-table-column label="发起人" prop="creator"></el-table-column>
      <el-table-column label="发起时间" prop="createTime"></el-table-column>
      <el-table-column label="审核人" prop="approver"></el-table-column>
      <el-table-column label="审核时间" prop="approveTime"></el-table-column>
      <el-table-column label="备注" prop="remark">
        <template #default="scope">
          <el-tooltip placement="top" effect="light" :content="scope.row.remark">
            <span>{{ scope.row.remark }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-if="scope.row.approveState === 1" text type="primary" @click="approveClick(scope.row)">去审核</el-button>
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
    <el-dialog v-model="approveVisible" title="服务审核" @closed="approveResetFields">
      <el-form label-width="120px" :model="approveSubmitData" :rules="rules" ref="approveRef">
        <template v-if="selectData">
          <el-form-item label="服务名称" prop="serviceName">
            <span>{{ selectData.serviceName }}</span>
          </el-form-item>
          <el-form-item label="服务版本" prop="serviceVersion">
            <span>{{ selectData.serviceVersion }}</span>
          </el-form-item>
          <el-form-item label="审核类型" prop="operationType">
            <span>{{ operationState[selectData.operationType] }}</span>
          </el-form-item>
          <el-form-item label="线上环境" prop="environmentType">
            <span>{{ enviromentType[selectData.environmentType] }}</span>
          </el-form-item>
          <el-form-item label="发起人">
            <span>{{ selectData.creator }}</span>
          </el-form-item>
        </template>
        <el-form-item label="是否通过审核" prop="approveState">
          <el-select v-model="approveSubmitData.approveState">
            <el-option :value="2" label="通过"></el-option>
            <el-option :value="3" label="不通过"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="approveSubmitData.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="approveResetFields">取消</el-button>
          <el-button type="primary" @click="approveSubmit(approveRef)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onActivated, onDeactivated, reactive, ref } from 'vue'
import { approveService } from './api/aiPlatform'
import { approveListPageReq, approveSubmitReq } from './api/types'
import { approveState, operationState, enviromentType, projectType } from './api/info'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
const loading = ref(false)
/**分页 */
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
/**filter查询 */
const filter = reactive({
  serviceName: '',
  approveState: ''
})
/**重置查询参数 */
const approvingSearchResetFields = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getListPage(1)
}
/**获取任务列表 */
const approveData = ref([])
const approvingSearchRef = ref()
const getListPage = async (page: number) => {
  loading.value = true
  const listPageFilter: approveListPageReq = { pageNum: page, pageSize: pageSize.value, serviceName: null, approveState: null }
  if (filter.serviceName) {
    listPageFilter.serviceName = filter.serviceName
  }
  if (filter.approveState) {
    listPageFilter.approveState = filter.approveState
  }
  const res = await approveService.approveListPage(listPageFilter)
  currentPage.value = page
  approveData.value = res.data.list.map((e: any, index: number) => {
    e.index = index + 1 + (currentPage.value - 1) * pageSize.value
    return e
  })
  total.value = res.data.total
  currentPage.value = res.data.pageNum
  loading.value = false
}
/**审核 */
const approveVisible = ref(false)
const selectData = ref()
const approveClick = (row: any) => {
  approveVisible.value = true
  selectData.value = row
  approveSubmitData.projectServiceVersionId = row.id
}
const approveRef = ref()
const approveSubmitData = reactive({
  projectServiceVersionId: '',
  approveState: 2,
  remark: ''
})
const rules: FormRules = reactive({
  remark: [{ required: true, message: '请输入审核意见', trigger: ['blur', 'change'] }]
})
/**点击审核提交操作 */
const approveSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data: approveSubmitReq = {
        id: approveSubmitData.projectServiceVersionId,
        approveState: approveSubmitData.approveState,
        remark: approveSubmitData.remark
      }
      const res = await approveService.approveSubmit(data)
      if (res.status === 200) {
        ElMessage.success('审核提交成功')
        approveVisible.value = false
        getListPage(currentPage.value)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**取消审核或离开对话框 */
const approveResetFields = () => {
  approveVisible.value = false
  selectData.value = undefined
  approveSubmitData.projectServiceVersionId = ''
  approveSubmitData.remark = ''
}
// onMounted(() => {
//   getListPage(1)
// })
let timer = undefined as any
onActivated(() => {
  getListPage(1)
  timer = setInterval(function () {
    getListPage(currentPage.value)
  }, 60000)
})
onDeactivated(() => {
  clearInterval(timer)
})
</script>

<style scoped></style>
