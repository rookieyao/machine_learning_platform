<template>
  <div>
    <div class="top-navbar">
      <el-row>
        <el-col>
          <label style="margin-right: 20px;">{{ task.name }}</label>
        </el-col>
        <el-col> </el-col>
      </el-row>
    </div>
    <div class="tag-tree" v-if="task.config">
      <el-button v-for="tag in tags" :type="selectTag === tag.value ? 'warning' : 'info'" @click="selectTag = tag.value">{{ tag.name }}</el-button>
      <el-button>+</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import er2Service from './api/er2'
const tid = ref()
/**获取任务配置信息 */
const task = ref({}) as any
interface Tag {
  key: string
  name: string
  value: number | string
}
const tags = ref<Tag[]>([])
const getTask = async () => {
  const res = await er2Service.getOneTask(tid.value)
  task.value = res.data
  tags.value = JSON.parse(res.data.config)
  // 选中的指标默认第一个
  if (tags.value.length == 0) {
    ElMessage.warning('目前暂无指标配置，请先配置指标')
    return
  }
  selectTag.value = tags.value[0].value
}
/**选中指标 */
const selectTag = ref()
/**左右切换标签 */
const quickChange = (index: number) => {
  // 先查询当前标签所在位置
  const selectIndex = tags.value.findIndex((e: any) => e.value === selectTag.value)
  // 超出标签范围的不变更
  if (index === 1 && selectIndex === tags.value.length - 1) return
  if (index === -1 && selectIndex === 0) return
  selectTag.value = tags.value[selectIndex + index].value
}
/**初始化 */
const route = useRoute()
const init = () => {
  tid.value = route.params.tid.toString()
  if (!tid.value) {
    ElMessage.warning('错误的任务')
  }
  getTask()
}
onMounted(() => {
  init()
  onKeyDown()
})
const onKeyDown = () => {
  document.onkeydown = (e) => {
    if (!(e.target instanceof HTMLBodyElement)) return
    if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
      tags.value.forEach((tag: any) => {
        if (e.key === tag.key) {
          selectTag.value = tag.value
        }
      })
      switch (e.key) {
        case 'ArrowUp':
          break
        case 'ArrowDown':
          break
        case 'ArrowRight':
          quickChange(1)
          break
        case 'ArrowLeft':
          quickChange(-1)
          break
      }
    }
  }
}
</script>

<style scoped>
.tag-tree {
  text-align: center;
}
</style>
