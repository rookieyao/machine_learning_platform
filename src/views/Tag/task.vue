<style scoped>
.task-search {
  text-align: center;
}
#tasklist {
  padding: 30px;
}
.el-button {
  margin: 0 10px 0 0;
}
.link {
  color: #007bff;
  margin-right: 3px;
}
.tag {
  margin: 0 3px 0 0;
  padding: 0 1px 0 1px;
}
</style>
<template>
  <div class="container">
    <div class="task-search">
      <el-input v-model="searchName" :placeholder="langConfig.alice.task.task[lang]" style="width: 300px;" @change="searchTask()"></el-input>
      <el-select v-model="tag" filterable @change="searchTask()">
        <el-option value="" :label="langConfig.alice.task.all[lang]">全部</el-option>
        <el-option value="非云听">非云听</el-option>
        <el-option v-for="t in tasktags" :value="t" :key="t">{{ t }}</el-option>
      </el-select>
    </div>
    <div id="tasklist">
      <el-table :data="tasklist" stripe max-height="780px">
        <el-table-column type="index" width="70px" label="#">
          <template #header>
            <span v-if="role" @click="managerModel = !managerModel">#</span>
          </template>
          <template #default="scope">
            <div v-if="role">
              <el-button v-if="managerModel" text @click="changeVisible(scope)">删除</el-button>
              <el-button v-else-if="checkTop(scope) == '置顶'" text @click="changeTop(scope, '-1')">{{ checkTop(scope) }}</el-button>
              <el-button v-else text @click="changeTop(scope, '1')">{{ checkTop(scope) }}</el-button>
            </div>
            <div v-else>
              <span>{{ checkTop(scope) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="langConfig.alice.task.task[lang]">
          <template #header>
            <span>{{ langConfig.alice.task.task[lang] }}</span>
            <router-link v-if="role || reviewer_role" :to="{ name: 'taskedit', params: { tid: '0' } }" custom v-slot="{ href }">
              <a class="link" :href="href" target="_blank"> +</a>
            </router-link>
          </template>
          <template #default="scope">
            <router-link v-if="role || reviewer_role" :to="{ name: 'taskedit', params: { tid: scope.row._id } }" custom v-slot="{ href }">
              <a class="link" :href="href" target="_blank">{{ scope.row.name }}</a>
            </router-link>
            <span v-else>{{ scope.row.name }}</span>
            <br />
            <span v-if="role">{{ scope.row._id }}</span>
            <br />
            <span v-if="role">{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="langConfig.alice.task.tag[lang]">
          <template #default="scope">
            <el-button size="small" class="tag" v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-button>
          </template>
        </el-table-column>
        <el-table-column :label="langConfig.alice.task.schedule[lang]">
          <template #default="scope">
            <span>{{ scope.row.current }} / {{ scope.row.total }} ({{ progress(scope) }}%)</span>
            <br />
            <router-link v-if="role || reviewer_role" class="link" :to="{ name: 'dayswork', query: { tid: scope.row._id } }">人/天统计</router-link>
            <router-link v-if="role || reviewer_role" class="link" :to="{ name: 'reviewScore', query: { tid: scope.row._id } }">审阅统计</router-link>
            <router-link v-if="role" :to="{ name: 'tagsvis', params: { tid: scope.row._id } }" custom v-slot="{ href }">
              <a class="link" :href="href" target="_blank">指标分布</a>
            </router-link>
            <router-link v-if="role" class="link" :to="{ name: 'evaluateInfo', query: { tid: scope.row._id } }">查看评估</router-link>
          </template>
        </el-table-column>
        <el-table-column :label="langConfig.alice.task.operation[lang]">
          <template #default="scope">
            <div v-if="scope.row.type === '0'">
              <router-link :to="{ name: 'er2', params: { tid: scope.row._id } }" custom v-slot="{ href }">
                <a class="link" :href="href" target="_blank">{{ langConfig.alice.task.annotation[lang] }}</a>
              </router-link>
              <router-link :to="{ name: 'er2', params: { tid: scope.row._id }, query: { mode: '批量审阅' } }" custom v-slot="{ href }">
                <a class="link" :href="href" target="_blank">{{ langConfig.alice.task.review[lang] }}</a>
              </router-link>
            </div>
            <div v-if="scope.row.type === '1'">
              <router-link :to="{ name: 'label', params: { tid: scope.row._id } }" custom v-slot="{ href }">
                <a class="link" :href="href" target="_blank">{{ langConfig.alice.task.annotation[lang] }}</a>
              </router-link>
            </div>
          </template>
        </el-table-column>
        <template #append>
          <div v-infinite-scroll="getAllTask" :infinite-scroll-disabled="loading"></div>
        </template>
      </el-table>
    </div>
    <el-dialog v-model="deleteVisible" title="删除任务" width="30%">
      <span>是否删除任务:{{ deleteItem.row.name }}({{ deleteItem.row._id }})?</span>
      <template #footer>
        <span style="margin-right: 10px;">
          <el-button @click="deleteVisible = false">取消</el-button>
          <el-button @click="deleteTask">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { useStore } from '@/store'
import { logInfo } from '@/utils'
import { computed, defineComponent, onMounted, ref } from 'vue'
import taskService from './api/task'
import { langConfig } from '@/utils/constant/config'
export default defineComponent({
  name: 'task',
  setup() {
    const tag = ref('非云听')
    const tasktags = ref([])
    const searchName = ref('')
    const lastid = ref('')
    const tasklist = ref([] as any)
    const role = ref(false)
    const reviewer_role = ref(false)
    const loading = ref(true)
    // 查询所有的任务
    const getAllTask = async () => {
      loading.value = true
      if (lastid.value === '-1') {
        return
      } else {
        const res = await taskService.allTask({ tag: tag.value, name: searchName.value, tid: lastid.value })
        if (res.status === 200) {
          if (lastid.value.length > 0 || tasklist.value.length > 0) {
            tasklist.value.push(...res.data.tasks)
          } else {
            tasklist.value = res.data.tasks
          }
          if (res.data.tasks.length < 10) {
            lastid.value = '-1'
          } else {
            lastid.value = res.data.lastid
            loading.value = false
          }
        }
      }
    }
    // 查询置顶的任务
    const getTopTask = async (callback: Function) => {
      const res = await taskService.allTask({ tag: tag.value, name: searchName.value, tid: lastid.value, top: 1 })
      if (res.status === 200) {
        res.data.tasks.map((e: any) => {
          e.istop = 1
        })
        if (lastid.value.length > 0) {
          tasklist.value.push(...res.data.tasks)
        } else {
          tasklist.value = res.data.tasks
        }
        logInfo(tasklist.value)
      }

      callback()
    }
    // 获取所有的任务Tag
    const getTaskTag = async () => {
      const res = await taskService.taskTag()
      tasktags.value = res['data']
    }
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
    // 检查是否为置顶任务
    const checkTop = (scope: any) => {
      if (scope.row.istop == 1) {
        return langConfig.alice.task.top[lang.value]
      } else {
        return scope.$index + 1
      }
    }
    // 设置置顶任务和取消置顶任务
    const changeTop = async (scope: any, top: string) => {
      const res = taskService.set_top(scope.row._id, top)
    }
    // 根据条件查找对应任务
    const searchTask = async () => {
      lastid.value = ''
      tasklist.value.splice(0)
      if (searchName.value === '' || tag.value === '') {
        await getTopTask(getAllTask)
      } else {
        await getAllTask()
      }
    }
    // 计算标注进度
    const progress = (scope: any) => {
      if (scope.row.total == 0) {
        return 0
      } else {
        return Number((scope.row.current / scope.row.total) * 100).toFixed(2)
      }
    }
    // 删除任务
    const managerModel = ref(false)
    const deleteVisible = ref(false)
    const deleteItem = ref()
    const changeVisible = (scope: any) => {
      deleteVisible.value = true
      deleteItem.value = scope
      logInfo('deleteItem', deleteItem.value)
    }
    const deleteTask = async () => {
      const res = await taskService.delete(deleteItem.value.row._id)
      if (res.status === 200) {
        deleteVisible.value = false
        tasklist.value.splice(deleteItem.value.$index, 1)
      }
      deleteVisible.value = false
    }
    const store = useStore()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    onMounted(() => {
      getTaskTag(), getTopTask(getAllTask), checkRole()
    })
    return {
      tag,
      role,
      reviewer_role,
      searchName,
      tasktags,
      tasklist,
      loading,
      getAllTask,
      checkTop,
      searchTask,
      progress,
      changeTop,
      managerModel,
      deleteVisible,
      deleteTask,
      deleteItem,
      changeVisible,
      lang,
      langConfig,
      lastid
    }
  }
})
</script>
