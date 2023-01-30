<template>
  <div style="margin: 10px;">
    <div class="task-search">
      <el-input v-model="name" :placeholder="langConfig.scene.task.searchPlaceholder[lang]" style="width: 300px;" @change="nameChaneg"></el-input>
    </div>
    <el-table :data="tasks" stripe max-height="780px">
      <el-table-column type="index">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="langConfig.scene.task.name[lang]">
        <template #header>
          <span>{{ langConfig.alice.task.task[lang] }}</span>
          <router-link v-if="role" :to="{ name: 'sceneTask', params: { tid: '0' } }" custom v-slot="{ href }">
            <a class="link" :href="href" target="_blank"> + </a>
          </router-link>
        </template>
        <template #default="scope">
          <router-link v-if="role" :to="{ name: 'sceneTask', params: { tid: scope.row._id } }" custom v-slot="{ href }">
            <a class="link" :href="href" target="_blank">{{ scope.row.name }}</a>
          </router-link>
          <span v-else>{{ scope.row.name }}</span>
          <p v-if="role">{{ scope.row._id }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="langConfig.scene.task.version[lang]"></el-table-column>
      <el-table-column :label="langConfig.scene.task.info[lang]">
        <template #default="scope">
          <router-link :to="{ name: 'sceneTagsvis', params: { tid: scope.row._id } }" custom v-slot="{ href }">
            <a class="link" :href="href" target="_blank">指标分布</a>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="langConfig.scene.task.createdAt[lang]"></el-table-column>
      <el-table-column prop="updated_at" :label="langConfig.scene.task.updatedAt[lang]"></el-table-column>
      <el-table-column :label="langConfig.scene.task.operation[lang]">
        <template #default="scope">
          <router-link :to="{ name: 'sceneEr2', params: { tid: scope.row._id } }" custom v-slot="{ href }">
            <a class="link" :href="href" target="_blank">{{ langConfig.scene.task.annotation[lang] }}</a>
          </router-link>
        </template>
      </el-table-column>
      <template #append>
        <div v-infinite-scroll="getTasks" :infinite-scroll-disabled="loading"></div>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SceneMiningServer from './api/sceneMining'
import { langConfig } from '@/utils/constant/config'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'

const store = useStore()
const lang = computed(() => store.getters['settingsModule/getLangState'])

/**获取任务 */
const tasks = ref<any[]>([])
const loading = ref(true)
const lastTid = ref('')
const getTasks = async () => {
  loading.value = true
  if (lastTid.value === '-1') return
  const data = { tid: lastTid.value } as any
  if (name.value) {
    data.name = name.value
  }
  const res = await SceneMiningServer.getTasks(data)
  if (res.data.length === 0) {
    ElMessage.warning('没有更多的任务了')
    lastTid.value = '-1'
  } else {
    tasks.value = tasks.value.concat(res.data)
    lastTid.value = res.data[res.data.length - 1]._id
  }
  loading.value = false
}
/**
 * id -> name
 */
const id2name = (id: string) => {
  for (let i = 0; i < tasks.value.length; i++) {
    const element = tasks.value[i]
    if (element._id === id) {
      return element.name
    }
  }
  return null
}
/**
 * 任务查询
 */
const name = ref('')
const nameChaneg = () => {
  // 需要先清空tasks
  lastTid.value = ''
  tasks.value.splice(0)
  getTasks()
}
/** 查询当前的用户权限 */
const role = ref(false)
const checkRole = () => {
  const roles = localStorage.getItem('role')
  if (roles?.indexOf('superman') != -1 || roles.indexOf('scene_manager') != -1) {
    role.value = true
  }
}
onMounted(() => {
  getTasks()
  checkRole()
})
</script>

<style scoped>
.link {
  color: #007bff;
  margin-right: 3px;
}
.task-search {
  text-align: center;
}
</style>
