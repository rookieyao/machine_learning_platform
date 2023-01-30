<style scoped>
.tag-svis {
  padding: 10px;
}
</style>
<template>
  <div class="tag-svis">
    <h3>{{ task.name }}</h3>
    <el-row>
      <el-col :span="5">
        <el-table v-if="sentimentCount.length !== 0" stripe :data="sentimentCount">
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column label="标签">
            <template #default="scope">{{ scope.row }}</template>
          </el-table-column>
          <el-table-column label="数量" width="100">
            <template #default="scope">{{ tagCount.sentiment[scope.row] }}</template>
          </el-table-column>
        </el-table>

        <el-table v-if="aspectCount.length !== 0" stripe :data="aspectCount" style="padding-top: 30px;">
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column label="标签">
            <template #default="scope">{{ scope.row }}</template>
          </el-table-column>
          <el-table-column label="数量" width="100">
            <template #default="scope">{{ tagCount.aspect[scope.row] }}</template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8" :offset="1">
        <div v-if="Object.keys(tagCount.sentiment).length > 0" ref="sentimentEchart" style="width: 100%;" :style="{ height: Object.keys(tagCount.sentiment).length * 20 + 160 + 'px' }"></div>
        <div v-if="Object.keys(tagCount.aspect).length > 0" ref="aspectEchart" style="width: 100%;" :style="{ height: Object.keys(tagCount.aspect).length * 20 + 160 + 'px' }"></div>
      </el-col>
      <el-col :span="8" :offset="1">
        <div v-if="lengthCount" ref="relationsEchart" style="width: 100%;" :style="{ height: Object.keys(relationsCount).length * 20 + 160 + 'px' }"></div>
        <div v-if="lengthCount" ref="lengthEchart" style="width: 100%;" :style="{ height: Object.keys(lengthCount).length * 20 + 160 + 'px' }"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import * as Echarts from 'echarts'
import er2Service from './api/er2'
import tagsvisService from './api/tagsvis'
import { logInfo } from '@/utils'
export default defineComponent({
  setup() {
    const route = useRoute()
    const tid = ref('')
    const task = ref({ name: '' })
    const tagCount = ref({ aspect: {} as any, sentiment: {} as any })
    const lengthCount = ref({} as any)
    const relationsCount = ref({})
    const aspectEchart = ref()
    const sentimentEchart = ref()
    const lengthEchart = ref()
    const relationsEchart = ref()
    const sentimentCount = ref([] as any)
    const aspectCount = ref([] as any)
    const load = async () => {
      tid.value = route.params.tid.toString()
      // 获取任务信息
      const taskRes = await er2Service.getOneTask(tid.value)
      task.value = taskRes.data
      // 获取指标统计结果
      const tagCountRes = await tagsvisService.getTagCount(tid.value)
      tagCount.value = tagCountRes.data
      // 获取情感/意图统计结果
      if (tagCount.value.sentiment) {
        sentimentCount.value = sortValue(tagCount.value.sentiment)
      }
      // 获取标签统计结果
      if (tagCount.value.aspect) {
        aspectCount.value = sortValue(tagCount.value.aspect)
      }
      // 获取长度统计结果
      const lengthCountRes = await tagsvisService.getLengthCount(tid.value)
      lengthCount.value = lengthCountRes.data.length
      // 获取关系统计结果
      const relationCountRes = await tagsvisService.getRelationsCount(tid.value)
      relationsCount.value = relationCountRes.data.relations
      // 构建指标数量统计
      if (Object.keys(tagCount.value.aspect).length > 0) {
        const aspectEchartsOption = getOption('指标统计', sortValue(tagCount.value.aspect), tagCount.value.aspect)
        const myaspectChart = Echarts.init(aspectEchart.value)
        myaspectChart.setOption(aspectEchartsOption)
      }
      // 构建情感数量统计
      if (Object.keys(tagCount.value.sentiment).length > 0) {
        const sentimentEchartsOption = getOption('情感指标统计', sortValue(tagCount.value.sentiment), tagCount.value.sentiment)
        const mysentimentChart = Echarts.init(sentimentEchart.value)
        mysentimentChart.setOption(sentimentEchartsOption)
      }
      // 构建长度数量统计
      const lengthEchartsOption = getOption('文本长度统计', sortKey(lengthCount.value), lengthCount.value)
      const mylengthChart = Echarts.init(lengthEchart.value)
      mylengthChart.setOption(lengthEchartsOption)
      // 构建关系数量统计
      const relationsEchartsOption = getOption('关系统计', sortKey(relationsCount.value), relationsCount.value)
      const myrelationsChart = Echarts.init(relationsEchart.value)
      myrelationsChart.setOption(relationsEchartsOption)
    }
    const getOption = (name: string, keys: any, data: any) => {
      var maxX = keys
        .map((x: any) => {
          return data[x]
        })
        .reduce((x: any, y: any) => {
          return x > y ? x : y
        })
      var totalX = keys
        .map((x: any) => {
          return data[x]
        })
        .reduce((x: any, y: any) => {
          return x + y
        })
      logInfo(name, maxX, totalX, keys)
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
          data: keys.map(function (key: any) {
            return data[key]
          })
        }
      }
      return option
    }
    const sortKey = (dic: any) => {
      return Object.keys(dic).sort(function (a, b) {
        return parseInt(b) - parseInt(a)
      })
    }
    const sortValue = (dic: any) => {
      return Object.keys(dic).sort(function (a, b) {
        return dic[a] - dic[b]
      })
    }
    onMounted(() => {
      load()
    })
    return {
      tid,
      task,
      aspectEchart,
      sentimentEchart,
      tagCount,
      lengthEchart,
      lengthCount,
      relationsEchart,
      relationsCount,
      sortValue,
      sentimentCount,
      aspectCount
    }
  }
})
</script>
