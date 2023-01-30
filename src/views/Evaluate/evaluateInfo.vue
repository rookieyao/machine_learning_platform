<template>
  <div class="container">
    <el-form label-width="130px" :inline="true">
      <el-form-item label="数据库位置">
        <el-select v-model="default_database" @change="getAllTask">
          <el-option label="线上标注系统" value="ann_online"></el-option>
          <el-option label="本地标注系统" value="ann"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标注任务">
        <el-select v-model="tid" filterable @change="getEvaluateList">
          <el-option v-for="task in tasks" :value="task._id" :label="task.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="evaluateList" table-layout="auto" stripe v-loading="loading" @cell-dblclick="cellDblclick">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="流程" prop="part"></el-table-column>
      <el-table-column label="配置" show-overflow-tooltip>
        <template #default="scope">
          <p v-for="(value, key) in scope.row.config">{{ `${key}:${value}` }}</p>
        </template>
      </el-table-column>
      <el-table-column label="评估完成时间" prop="date"></el-table-column>
      <el-table-column label="精度" prop="precision"></el-table-column>
      <el-table-column label="召回" prop="recall"></el-table-column>
      <el-table-column label="F1" prop="f1"></el-table-column>
      <el-table-column label="准确率" prop="accuracy"></el-table-column>
      <el-table-column label="标注数" prop="actual"></el-table-column>
      <el-table-column label="备注" prop="note" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="scope.row._id === dblclickRowId && scope.column.id === dblclickColId">
            <el-input v-model="changeNoteText" type="textarea" :rows="3" @blur="noteChange(scope.row.job_id)"></el-input>
            <div style="text-align: right;">
              <el-button text type="primary" @click="noteChange(scope.row.job_id)">保存</el-button>
            </div>
          </div>
          <div v-else>{{ scope.row.note }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="_id">
        <template #default="scope">
          <router-link :to="{ name: 'evaluate', params: { eid: scope.row._id } }" custom v-slot="{ href }">
            <a class="link" :href="href" target="_blank">查看评估</a>
          </router-link>
          <el-button v-if="scope.row.output" type="primary" text @click="download(scope.row.output)">下载评估</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import downloadFile from '@/utils/downloadFile'
import { ElMessage } from 'element-plus'
import { onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'
import indexService from '../Tag/api'
import evaluateService from './api/evaluate'

const loading = ref(false)
const default_database = ref('ann_online')
const tid = ref('')
/**获取所有的标注任务 */
interface Task {
  _id: string
  name: string
}
const tasks = ref<Task[]>([])
const getAllTask = async () => {
  // 清空选中改的tid
  tid.value = ''
  const res = await indexService.getTasks({ default_database: default_database.value })
  tasks.value = res.data
}
/**获取标注任务下的评估报告 */
const evaluateList = ref([])
const getEvaluateList = async () => {
  loading.value = true
  const res = await evaluateService.evaluateList({ tid: tid.value })
  evaluateList.value = res.data
  loading.value = false
}
/**双击修改备注 */
const dblclickRowId = ref('')
const dblclickColId = ref('')
const changeNoteText = ref('')
const cellDblclick = (row: any, column: any, cell: any, event: any) => {
  dblclickRowId.value = row._id
  dblclickColId.value = column.id
  changeNoteText.value = row.note
}
const noteChange = async (job_id: string) => {
  const res = await evaluateService.updateEvaluateNote({ job_id: job_id, note: changeNoteText.value })
  if (res.status === 200) {
    dblclickRowId.value = ''
    dblclickColId.value = ''
    changeNoteText.value = ''
    ElMessage.success('备注修改成功')
    getEvaluateList()
  }
}
/**
 * 文件下载
 */
const download = (path: string) => {
  const url = '/api/tools/evaluate/download'
  downloadFile(url, '', 'post', { path: path })
}
/**初始化，从query中获取相关参数 */
const route = useRoute()
const init = () => {
  getAllTask()
  if (route.query.tid) {
    tid.value = route.query.tid.toString()
    getEvaluateList()
  }
}
onActivated(() => {
  init()
})
</script>

<style scoped></style>
