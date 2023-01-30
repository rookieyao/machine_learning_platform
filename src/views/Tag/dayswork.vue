<template>
  <div class="container">
    <div id="dayswork-form">
      <el-form label-width="120px">
        <el-form-item label="统计人员">
          <el-checkbox v-model="checkAllUser" :indeterminate="isIndeterminateUser" @change="handleCheckAllChangeUser" style="padding-right: 50px;">全选,不进行任何筛选默认全选</el-checkbox>
          <el-space direction="vertical" alignment="left">
            <div v-if="userOptions.filter((e:any)=>e.group==='云听')">
              <el-checkbox @change="(value:any) => handleCheckUserGroup('云听', value)">全选-云听</el-checkbox>
              <span></span>
              <el-checkbox-group v-model="checkedUser" @change="handleCheckedUserChangeUser">
                <el-checkbox v-for="user in userOptions.filter((e:any)=>e.group==='云听')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="userOptions.filter((e:any)=>e.group==='揭阳')">
              <el-checkbox @change="(value:any) => handleCheckUserGroup('揭阳团队', value)">全选-jy</el-checkbox>
              <span></span>
              <el-checkbox-group v-model="checkedUser" @change="handleCheckedUserChangeUser">
                <el-checkbox v-for="user in userOptions.filter((e:any)=>e.group==='揭阳团队')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="userOptions.filter((e:any)=>e.group==='菲律宾')">
              <el-checkbox @change="(value:any) => handleCheckUserGroup('菲律宾团队', value)">全选-en</el-checkbox>
              <span></span>
              <el-checkbox-group v-model="checkedUser" @change="handleCheckedUserChangeUser">
                <el-checkbox v-for="user in userOptions.filter((e:any)=>e.group==='菲律宾团队')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <el-checkbox @change="(value:any) => handleCheckUserGroup('', value)">全选-其他</el-checkbox>
              <span></span>
              <el-checkbox-group v-model="checkedUser" @change="handleCheckedUserChangeUser">
                <el-checkbox v-for="user in userOptions.filter((e:any)=>!e.group || e.group==='')" :key="user['name']" :label="user['name']">{{ user['name'] }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-space>
        </el-form-item>
        <el-form-item label="统计任务">
          <el-popover placement="bottom-end" :width="1000" @mouseleave="visible = false" trigger="click">
            <template #reference>
              <el-button>任务列表</el-button>
            </template>
            <el-input v-model="searchTask" placeholder="搜索任务" size="small" style="width: 400px; margin: 0 30px 10px 0;"></el-input>
            <el-checkbox v-model="checkAllTask" :indeterminate="isIndeterminateTask" @change="handleCheckAllChangeTask">全选,不进行任何筛选默认全选</el-checkbox>
            <el-checkbox-group v-model="checkedTask" @change="handleCheckedUserChangeTask">
              <el-scrollbar height="600px">
                <el-row :gutter="24">
                  <el-col :span="6" v-for="task in taskOptions.filter((e) => e['name'].indexOf(searchTask) !== -1)" :key="task['_id']">
                    <el-checkbox :label="task['_id']">{{ task['name'] }} </el-checkbox>
                  </el-col>
                </el-row>
              </el-scrollbar>
            </el-checkbox-group>
          </el-popover>
        </el-form-item>
        <el-form-item label="标注系统">
          <el-select v-model="default_database" placeholder="数据库位置" @change="dbChange" :disabled="!role">
            <el-option label="本地标注系统" value="ann"></el-option>
            <el-option label="线上标注系统" value="ann_online"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计日期">
          <div class="block">
            <el-date-picker
              v-model="date"
              type="daterange"
              unlink-panels
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :shortcuts="shortcuts"
              value-format="YYYY-MM-DD"
              :default-time="date"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="统计方式">
          <el-select v-model="count_type" placeholder="统计方式">
            <el-option label="每日标注数量(去重)" value="tagging_reduplicate"></el-option>
            <el-option label="每日提交数量(去重)" value="submit_reduplicate"></el-option>
            <el-option label="每日标注数量" value="tagging"></el-option>
            <el-option label="每日提交数量" value="submit"></el-option>
          </el-select>
          <el-button @click="query" style="margin-left: 50px;">查询</el-button>
          <el-button @click="exportExcel('dayword-table')">导出数据</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table id="dayword-table" ref="" class="table-list" :show-summary="true" :data="tableData">
        <el-table-column prop="name" label="用户名" sortable fixed></el-table-column>
        <el-table-column prop="tid" label="任务" sortable :formatter="formatterTid" fixed></el-table-column>
        <el-table-column sortable v-for="day in tableDate" :key="day" :prop="day" :label="day"></el-table-column>
        <el-table-column sortable label="总计" prop="total"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, toRefs, onBeforeMount, watch, onActivated, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import indexService from './api/index'
import dayjs from 'dayjs'
import { logInfo } from '@/utils'
import exportExcel from '@/utils/exportExcel'
export default defineComponent({
  name: 'DaysWord',
  setup() {
    // 表格的数据
    const tableData = ref([] as any[])
    // 筛选的所有日期
    const tableDate = ref([] as any[])
    const tableSearch = ref('')
    const date = ref()
    const default_database = ref('ann_online')
    const count_type = ref('tagging_reduplicate')
    // 日期筛选器
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
    // 用户名选择
    const checkUser = reactive({
      checkAllUser: false,
      checkedUser: [] as any[],
      userOptions: [] as any[],
      isIndeterminateUser: false
    })
    // 请求获取用户列表
    const getUsers = async () => {
      try {
        const res = await indexService.getUsernames({ default_database: default_database.value })
        checkUser.userOptions = res.data.filter((u: any) => ['reviewer', 'user', 'reviewer2', 'reviewer3', 'manager'].includes(u.role))
      } catch (err) {
        logInfo('getTasks err', err)
      }
    }
    // 用户名 全选响应
    const handleCheckAllChangeUser = (val: any) => {
      const option = checkUser.userOptions.map((e) => e['name'])
      checkUser.checkedUser = val ? option : []
      checkUser.isIndeterminateUser = false
    }
    const handleCheckedUserChangeUser = (value: any) => {
      const checkedCount = value.length
      checkUser.checkAllUser = checkedCount === checkUser.userOptions.length
      checkUser.isIndeterminateUser = checkedCount > 0 && checkedCount < checkUser.userOptions.length
    }
    /**选中一个组别所有用户 */
    const handleCheckUserGroup = (group: string, value: any) => {
      const groupUser =
        group === '' ? checkUser.userOptions.filter((e: any) => !e.group || e.group === '').map((e) => e['name']) : checkUser.userOptions.filter((e: any) => e.group === group).map((e) => e['name'])
      const users = checkUser.checkedUser.filter((e: any) => !groupUser.includes(e))
      if (value) {
        checkUser.checkedUser = users.concat(groupUser)
      } else {
        checkUser.checkedUser = users
      }
      handleCheckedUserChangeUser(checkUser.checkedUser)
    }
    // 标注任务选择
    const searchTask = ref('') // 标注任务检索
    const checkTask = reactive({
      checkAllTask: false,
      checkedTask: [] as any[],
      taskOptions: [] as any[],
      isIndeterminateTask: true
    })
    // 请求获取标注任务列表
    const getTasks = async () => {
      try {
        const res = await indexService.getTasks({ default_database: default_database.value })
        checkTask.taskOptions = res.data
      } catch (err) {
        logInfo('getTasks err', err)
      }
    }
    // 标注任务 全选响应
    const handleCheckAllChangeTask = (val: any) => {
      const option = checkTask.taskOptions.map((e) => e['_id'])
      checkTask.checkedTask = val ? option : []
      checkTask.isIndeterminateTask = false
    }
    const handleCheckedUserChangeTask = (value: any) => {
      const checkedCount = value.length
      checkTask.checkAllTask = checkedCount === checkTask.taskOptions.length
      checkTask.isIndeterminateTask = checkedCount > 0 && checkedCount < checkTask.taskOptions.length
    }
    // 设置默认时间，默认为最近7天
    const defaultTime = () => {
      date.value = [dayjs(new Date().getTime() - 3600 * 1000 * 24 * 7).format('YYYY-MM-DD'), dayjs(new Date()).format('YYYY-MM-DD')]
    }
    const router = useRouter()
    // 请求标注统计
    const query = async () => {
      const data = {
        username: checkUser.checkedUser,
        tid: checkTask.checkedTask,
        default_database: default_database.value,
        begin: date.value[0],
        end: date.value[1],
        count_type: count_type.value
      }
      if (checkUser.checkedUser.length === checkUser.userOptions.length || checkUser.checkedUser.length === 0) {
        data.username = ['all']
      }
      if (checkTask.checkedTask.length === checkTask.taskOptions.length || checkTask.checkedTask.length === 0) {
        data.tid = ['all']
      }
      const href = router.resolve({
        name: 'dayswork',
        query: { username: data.username.toString(), tid: data.tid.toString(), default_database: data.default_database, begin: data.begin, end: data.end, count_type: data.count_type }
      })
      window.location.href = href.href
      const res = await indexService.getDaysCount(data)
      tableData.value = res.data.dayswork
      tableDate.value = res.data.dayscount.sort()
    }
    // 表格中的tid对应到具体的任务名称
    const formatterTid = (row: any, column: any) => {
      const task = checkTask.taskOptions.find((e) => e._id === row.tid)
      if (task) {
        return task['name']
      }
    }
    const route = useRoute()
    // 页面初始时判断url中是否传递参数
    const getRouterQuery = () => {
      if (route.query.username) {
        if (route.query.username === 'all') {
          checkUser.checkedUser = []
        } else {
          checkUser.checkedUser = route.query.username.toString().split(',')
        }
      }
      if (route.query.tid) {
        if (route.query.tid === 'all') {
          checkTask.checkedTask = []
        } else {
          checkTask.checkedTask = route.query.tid.toString().split(',')
        }
      }
      if (route.query.default_database) {
        default_database.value = route.query.default_database.toString()
      }
      if (route.query.begin && route.query.end) {
        date.value[0] = route.query.begin.toString()
        date.value[1] = route.query.end.toString()
      }
      if (route.query.count_type) {
        count_type.value = route.query.count_type.toString()
      }
    }
    // 切换数据库后，更新人员和任务
    const dbChange = () => {
      getUsers(), getTasks()
    }
    const role = ref(false)
    const reviewer_role = ref(false)
    // 查询当前的用户权限
    const checkRole = () => {
      const roles = localStorage.getItem('role')
      if (roles?.indexOf('superman') != -1 || roles.indexOf('ann_manager') != -1) {
        role.value = true
      }
      if (roles?.indexOf('reviewer_plus') != -1) {
        reviewer_role.value = true
      }
    }

    onBeforeMount(() => {
      getUsers(), getTasks(), defaultTime(), checkRole()
    })
    onActivated(async () => {
      logInfo('dayswork onActivated')
      getRouterQuery(), query()
    })

    return {
      ...toRefs(checkUser),
      ...toRefs(checkTask),
      date,
      count_type,
      shortcuts,
      default_database,
      visible: ref(false),
      tableData,
      tableDate,
      tableSearch,
      handleCheckAllChangeUser,
      handleCheckedUserChangeUser,
      handleCheckAllChangeTask,
      handleCheckedUserChangeTask,
      searchTask,
      formatterTid,
      query,
      dbChange,
      role,
      reviewer_role,
      exportExcel,
      handleCheckUserGroup
    }
  }
})
</script>
