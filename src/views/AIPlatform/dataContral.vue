<template>
  <div class="compoent-main">
    <el-tabs v-model="tabsName" @tab-change="tabChange">
      <el-tab-pane label="原始数据管理" name="originData">
        <OriginDataVue :anno-task-list="annoTaskList" :is-check="tabsName === 'originData' ? true : false"></OriginDataVue>
      </el-tab-pane>
      <el-tab-pane label="词向量管理" name="charWordVector">
        <CharWordVectorVue :is-check="tabsName === 'charWordVector' ? true : false"></CharWordVectorVue>
      </el-tab-pane>
      <el-tab-pane label="训练数据管理" name="trainData">
        <TrainDataVue :anno-task-list="annoTaskList" :is-check="tabsName === 'trainData' ? true : false"></TrainDataVue>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import OriginDataVue from './components/originData.vue'
import CharWordVectorVue from './components/charWordVector.vue'
import TrainDataVue from './components/trainData.vue'
import { ref, reactive, onMounted, onActivated, onDeactivated } from 'vue'
import indexService from '@/views/Tag/api'
import { TabPanelName } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const tabsName = ref('')
const annoTaskList = reactive({
  ann: [],
  ann_online: []
} as any)
const getAnnoTaskList = async () => {
  const annRes = await indexService.getTasks({ default_database: 'ann' })
  annoTaskList.ann = annRes.data
  const annOnlineRes = await indexService.getTasks({ default_database: 'ann_online' })
  annoTaskList.ann_online = annOnlineRes.data
}
/**tab切换 */
const router = useRouter()
const tabChange = (name: TabPanelName) => {
  if (tabsName.value) {
    const route = router.resolve({
      name: 'aiDataContral',
      query: { tab: name }
    })
    window.location.href = route.href
  }
}
const lastSelect = ref('originData')
/**根据url设置默认的tab显示页 */
const route = useRoute()
const init = () => {
  if (route.query.tab) {
    tabsName.value = route.query.tab.toString()
    lastSelect.value = route.query.tab.toString()
  } else {
    tabsName.value = 'originData'
  }
}
onMounted(() => {
  init()
})

onActivated(() => {
  tabsName.value = lastSelect.value
  getAnnoTaskList()
})
onDeactivated(() => {
  lastSelect.value = tabsName.value
  tabsName.value = ''
})
</script>

<style scoped>
.compoent-main {
  padding: 0 20px;
}
</style>
