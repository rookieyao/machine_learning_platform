<template>
  <div class="app-div">
    <el-form label-width="120px" ref="reviewScoreFormRef" :model="reviewScoreData" :rules="reviewScoreDataRules">
      <el-form-item label="统计人员" prop="checkedUsers">
        <el-checkbox v-model="checkAllUser" :indeterminate="isIndeterminateUser" @change="handleCheckAllChangeUser" style="padding-right: 50px;">全选,不进行任何筛选默认为任务配置的人员</el-checkbox>
        <el-space direction="vertical" alignment="left">
          <div v-if="userList.filter((e:any)=>e.group==='云听')">
            <el-checkbox @change="(value:any) => handleCheckUserGroup('云听', value)">全选-云听</el-checkbox>
            <el-checkbox-group v-model="reviewScoreData.checkedUsers" @change="handleCheckedUserChangeUser">
              <el-checkbox v-for="user in userList.filter((e:any)=>e.group==='云听')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="userList.filter((e:any)=>e.group==='揭阳')">
            <el-checkbox @change="(value:any) => handleCheckUserGroup('揭阳团队', value)">全选-jy</el-checkbox>
            <el-checkbox-group v-model="reviewScoreData.checkedUsers" @change="handleCheckedUserChangeUser">
              <el-checkbox v-for="user in userList.filter((e:any)=>e.group==='揭阳团队')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-if="userList.filter((e:any)=>e.group==='菲律宾')">
            <el-checkbox @change="(value:any) => handleCheckUserGroup('菲律宾团队', value)">全选-en</el-checkbox>
            <el-checkbox-group v-model="reviewScoreData.checkedUsers" @change="handleCheckedUserChangeUser">
              <el-checkbox v-for="user in userList.filter((e:any)=>e.group==='菲律宾团队')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-checkbox @change="(value:any) => handleCheckUserGroup('', value)">全选-其他</el-checkbox>
          <el-checkbox-group v-model="reviewScoreData.checkedUsers" @change="handleCheckedUserChangeUser">
            <el-checkbox v-for="user in userList.filter((e:any)=>!e.group || e.group==='')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
          </el-checkbox-group>
        </el-space>
      </el-form-item>
      <el-form-item label="统计日期" prop="data">
        <div class="block">
          <el-date-picker
            v-model="reviewScoreData.date"
            type="daterange"
            unlink-panels
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="标注系统" prop="database">
        <el-select v-model="reviewScoreData.database" @change="getTasks">
          <el-option value="ann_online" label="线上标注系统(8086)"></el-option>
          <el-option value="ann" label="线下标注系统(8085)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标注任务" prop="taskId">
        <el-select v-model="reviewScoreData.taskId" filterable>
          <el-option v-for="t in taskList" :value="t._id" :label="t.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="reviewScoreDataClean(reviewScoreFormRef)">重置</el-button>
        <el-button type="primary" @click="reviewScoreDataSubmit(reviewScoreFormRef)">查询</el-button>
        <el-button @click="exportExcel('reviewscore-table')">导出数据</el-button>
      </el-form-item>
    </el-form>
    <el-table id="reviewscore-table" ref="" :data="tableData" v-loading="loading" :inline="true">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="属性&情感正确率">
        <template #default="scope">
          {{
            100 -
            Math.round(
              (['多选文字', '少选文字', '漏标分类', '多标分类', '漏标情感', '多标情感', '分类错误']
                .map((e) => scope.row.review_category[e] | 0)
                .reduce((previousValue, currentValue) => {
                  return previousValue + currentValue
                }) /
                (scope.row.review_aspect_total +
                  scope.row.review_sentiment_total +
                  ['漏标分类', '漏标情感']
                    .map((e) => scope.row.review_category[e] | 0)
                    .reduce((previousValue, currentValue) => {
                      return previousValue + currentValue
                    }) -
                  ['多标分类', '多标情感']
                    .map((e) => scope.row.review_category[e] | 0)
                    .reduce((previousValue, currentValue) => {
                      return previousValue + currentValue
                    }) +
                  0.0000000001)) *
                10000
            ) /
              100
          }}
          %
        </template>
      </el-table-column>
      <el-table-column label="属性&情感错误率">
        <template #default="scope">
          {{
            Math.round(
              (['多选文字', '少选文字', '漏标分类', '多标分类', '漏标情感', '多标情感', '分类错误']
                .map((e) => scope.row.review_category[e] | 0)
                .reduce((previousValue, currentValue) => {
                  return previousValue + currentValue
                }) /
                (scope.row.review_aspect_total +
                  scope.row.review_sentiment_total +
                  ['漏标分类', '漏标情感']
                    .map((e) => scope.row.review_category[e] | 0)
                    .reduce((previousValue, currentValue) => {
                      return previousValue + currentValue
                    }) -
                  ['多标分类', '多标情感']
                    .map((e) => scope.row.review_category[e] | 0)
                    .reduce((previousValue, currentValue) => {
                      return previousValue + currentValue
                    }) +
                  0.0000000001)) *
                10000
            ) / 100
          }}
          %
        </template>
      </el-table-column>
      <el-table-column label="关系错误率">
        <template #default="scope"> {{ Math.round(((scope.row.review_category['连线错误'] | 0) / (0.0000000001 + scope.row.review_relation_total)) * 1000) / 100 }} % </template>
      </el-table-column>
      <el-table-column label="审阅数量(包含合格)" prop="contain_review_with_right_total"></el-table-column>
      <el-table-column label="审阅数量(不包含合格)" prop="contain_review_without_right_total"></el-table-column>
      <el-table-column label="未审阅数量" prop="uncontain_review_total"></el-table-column>
      <el-table-column label="审阅合格数量" prop="review_category">
        <template #default="scope">
          {{ scope.row.review_category.标记合格 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="审阅属性数量">
        <template #default="scope"> {{ `${scope.row.review_aspect_total} / ${scope.row.aspect_total}` }} </template>
      </el-table-column>
      <el-table-column label="审阅情感数量">
        <template #default="scope"> {{ `${scope.row.review_sentiment_total} / ${scope.row.sentiment_total}` }} </template>
      </el-table-column>
      <el-table-column label="审阅关系数量">
        <template #default="scope"> {{ `${scope.row.review_relation_total} / ${scope.row.relation_total}` }} </template>
      </el-table-column>
      <el-table-column label="多选文字">
        <template #default="scope">
          {{ scope.row.review_category.多选文字 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="少选文字">
        <template #default="scope">
          {{ scope.row.review_category.少选文字 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="漏标分类">
        <template #default="scope">
          {{ scope.row.review_category.漏标分类 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="多标分类">
        <template #default="scope">
          {{ scope.row.review_category.多标分类 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="分类错误">
        <template #default="scope">
          {{ scope.row.review_category.分类错误 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="漏标情感">
        <template #default="scope">
          {{ scope.row.review_category.漏标情感 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="多标情感">
        <template #default="scope">
          {{ scope.row.review_category.多标情感 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="情感错误">
        <template #default="scope">
          {{ scope.row.review_category.情感错误 || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="连线错误">
        <template #default="scope">
          {{ scope.row.review_category.连线错误 || 0 }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { logInfo, exportExcel } from '@/utils'
import { FormInstance, FormRules } from 'element-plus'
import { nextTick, onActivated, onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import indexService from './api'

/**查询配置 */
interface reviewScoreDataType {
  checkedUsers: Array<string>
  taskId: string
  database: string
  date: Array<string>
}
const reviewScoreData: reviewScoreDataType = reactive({
  checkedUsers: [],
  taskId: '',
  database: 'ann_online',
  date: []
})
/**表单验证 */
const reviewScoreDataRules = reactive<FormRules>({
  taskId: [{ required: true, message: '请选择标注任务' }]
})
/**获取所有的标注人员 */
const userList = ref([] as any)
const getUsers = async () => {
  const res = await indexService.getUsernames({ default_database: reviewScoreData.database })
  userList.value = res.data.filter((u: any) => ['reviewer', 'user', 'reviewer2', 'reviewer3', 'manager'].includes(u.role))
}
/**标注人员选择 */
const checkAllUser = ref(false)
const isIndeterminateUser = ref(false)
const handleCheckAllChangeUser = (val: any) => {
  const option = userList.value.map((e: any) => e['name'])
  reviewScoreData.checkedUsers = val ? option : []
  isIndeterminateUser.value = false
}
const handleCheckedUserChangeUser = (value: any) => {
  const checkedCount = value.length
  checkAllUser.value = checkedCount === userList.value.length
  isIndeterminateUser.value = checkedCount > 0 && checkedCount < userList.value.length
}
/**选中一个组别所有用户 */
const handleCheckUserGroup = (group: string, value: any) => {
  const groupUser =
    group === '' ? userList.value.filter((e: any) => !e.group || e.group === '').map((e: any) => e['name']) : userList.value.filter((e: any) => e.group === group).map((e: any) => e['name'])
  const users = reviewScoreData.checkedUsers.filter((e: any) => !groupUser.includes(e))
  if (value) {
    reviewScoreData.checkedUsers = users.concat(groupUser)
  } else {
    reviewScoreData.checkedUsers = users
  }
  handleCheckedUserChangeUser(reviewScoreData.checkedUsers)
}
/**获取所有的标注任务 */
const taskList = ref([] as any)
const getTasks = async () => {
  const res = await indexService.getTasks({ default_database: reviewScoreData.database })
  taskList.value = res.data
}
/**时间筛选 */
const shortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

/**表单重置 */
const reviewScoreDataClean = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
/**表单点击查询 */
const reviewScoreFormRef = ref<FormInstance>()
const tableData = ref()
const loading = ref(false)
const router = useRouter()
const reviewScoreDataSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      const data = { username: reviewScoreData.checkedUsers, tid: reviewScoreData.taskId, default_database: reviewScoreData.database, begin: '', end: '' }
      if (reviewScoreData.date) {
        data.begin = reviewScoreData.date[0]
        data.end = reviewScoreData.date[1]
      }
      const href = router.resolve({
        name: 'reviewScore',
        query: { names: data.username.toString(), tid: data.tid.toString(), database: data.default_database, begin: data.begin, end: data.end }
      })
      window.location.href = href.href
      const res = await indexService.getReviewScore(data)
      tableData.value = res.data
      loading.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**从路由中获取参数 */
const route = useRoute()
const getRouterQuery = () => {
  if (route.query.names) {
    reviewScoreData.checkedUsers = route.query.names.toString().split(',')
  }
  if (route.query.database) {
    reviewScoreData.database = route.query.database.toString()
  }
  if (route.query.tid) {
    reviewScoreData.taskId = route.query.tid.toString()
  }
  if (route.query.begin && route.query.end) {
    reviewScoreData.date[0] = route.query.begin.toString()
    reviewScoreData.date[1] = route.query.end.toString()
  }
}
onBeforeMount(async () => {
  getUsers()
})
onActivated(async () => {
  logInfo('reviewScore onActivated')
  await nextTick()
  getRouterQuery(), getTasks()
  if (reviewScoreData.taskId) {
    await nextTick()
    reviewScoreDataSubmit(reviewScoreFormRef.value)
  }
})
</script>

<style scoped></style>
