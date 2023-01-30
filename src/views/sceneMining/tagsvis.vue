<template>
  <div style="margin: 10px;">
    <h3>{{ taskName }}</h3>
    <el-row>
      <el-col :span="5">
        <el-table :data="snippetCount" stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="类型" prop="tag"></el-table-column>
          <el-table-column label="数量" prop="count"></el-table-column>
        </el-table>
        <el-table :data="tagCount" stripe style="padding-top: 30px;">
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="一级标签" prop="scene" sortable></el-table-column>
          <el-table-column label="二级标签" prop="tag" sortable></el-table-column>
          <el-table-column label="数量" prop="count" sortable></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12" :offset="1">
        <div ref="snippetCountEchart" id="snippetCount" v-if="snippetCount.length > 0" style="width: 100%;" :style="{ height: snippetCount.length * 20 + 160 + 'px' }"></div>
        <div ref="tagCountEchart" id="tagCount" v-if="tagCount.length > 0" style="width: 100%;" :style="{ height: tagCount.length * 20 + 160 + 'px' }"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SceneMiningServer from './api/sceneMining'
import * as Echarts from 'echarts'
import logInfo from '@/utils/logInfo'
const route = useRoute()
const tid = ref('')
const taskName = ref('')
const snippetCount = ref<any>([])
const tagCount = ref<any>([])
/**图表 */
const getOption = (name: string, data: any) => {
  var keys = data
    .map((e: any) => {
      if (e.scene) {
        return `${e.scene}-${e.tag}`
      } else {
        return e.tag
      }
    })
    .reverse()
  var values = data.map((e: any) => e.count).reverse()
  var maxX = values.reduce((x: any, y: any) => {
    return x > y ? x : y
  })
  var totalX = values.reduce((x: any, y: any) => {
    return x + y
  })
  logInfo(name, maxX, totalX, keys, values)
  const option = {
    tooltip: {},
    title: [
      {
        text: name,
        subtext: '总计 ' + totalX,
        x: '50%',
        textAlign: 'center'
      }
    ],
    grid: {
      left: '30',
      right: '50',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        max: maxX,
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: keys,
        splitLine: {
          show: true
        },
        axisLabel: {
          margin: 0,
          padding: [0, 10, 0, 10],
          align: 'right'
        }
      }
    ],
    series: {
      type: 'bar',
      label: {
        position: 'right'
      },
      data: values
    }
  }
  return option
}
/**加载数据 */
const load = async () => {
  tid.value = route.params.tid.toString()
  const snippetCountRes = await SceneMiningServer.countSnippet({ tid: tid.value })
  const tagCountRes = await SceneMiningServer.countTag({ tid: tid.value })
  const taskRes = await SceneMiningServer.getStates({ tid: tid.value })
  taskName.value = taskRes.data.name
  snippetCount.value = [
    { tag: '片段总数量', count: snippetCountRes.data.snippet },
    { tag: '带标签的片段数量', count: snippetCountRes.data.hasTagSnippet }
  ]
  tagCount.value = tagCountRes.data
  await nextTick()
  initEcharts()
}

const snippetCountEchart = ref()
const tagCountEchart = ref()
const initEcharts = () => {
  if (snippetCount.value.length > 0) {
    const snippetCountEchartsOption = getOption('片段统计', snippetCount.value)
    const snippetCountChart = Echarts.init(snippetCountEchart.value)
    snippetCountChart.setOption(snippetCountEchartsOption)
  }
  if (tagCount.value.length > 0) {
    const tagCountEchartsOption = getOption('指标统计', tagCount.value)
    const tagCountChart = Echarts.init(tagCountEchart.value)
    tagCountChart.setOption(tagCountEchartsOption)
  }
}
onMounted(() => {
  load()
})
</script>

<style scoped></style>
