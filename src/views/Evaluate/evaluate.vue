<style scoped>
.main-evaluate {
  margin: 20px;
}
.el-table .el-table__cell {
  padding: 0;
}
.tag-contrast {
  margin-top: 20px;
}
#annotation {
  text-align: left;
}
.contrast-content {
  margin-top: 20px;
}
.table-evaluate :deep() .el-table__body tr.current-row > td.el-table__cell {
  background: #d8f5da !important;
}
</style>
<template>
  <div class="main-evaluate">
    <el-row>
      <el-col :span="11">
        <el-tabs v-model="report" @tab-click="getReport">
          <el-tab-pane :label="langConfig.train.evaluate.report1[lang]" name="report1">
            <el-table
              id="report1"
              class="table-evaluate"
              border
              :fit="true"
              :data="report1Data"
              max-height="400px"
              highlight-current-row
              :empty-text="langConfig.train.evaluate.errorReport[lang]"
              :row-class-name="RowClassName"
              @cell-click="getDataset"
              table-layout="fixed"
            >
              <el-table-column fixed sortable type="index" :index="indexMethod" />
              <el-table-column width="110px" fixed sortable prop="first" :label="langConfig.train.evaluate.first[lang]">
                <template #default="scope">
                  <span v-if="scope.row.first !== '总'">{{ tagsDict[scope.row.first] ? tagsDict[scope.row.first][lang] : scope.row.first }}</span>
                  <span v-else>{{ langConfig.train.evaluate.total[lang] }}</span>
                </template>
              </el-table-column>
              <el-table-column width="110px" fixed sortable prop="second" :label="langConfig.train.evaluate.second[lang]">
                <template #default="scope">
                  <span>{{ tagsDict[scope.row.second] ? tagsDict[scope.row.second][lang] : scope.row.second }}</span>
                </template>
              </el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '80px' : '115px'" sortable prop="precision" :label="langConfig.train.evaluate.precision[lang]"></el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '80px' : '95px'" sortable prop="recall" :label="langConfig.train.evaluate.recall[lang]"></el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '80px' : '70px'" sortable prop="f1" :label="langConfig.train.evaluate.f1[lang]"></el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '95px' : '115px'" sortable prop="accuracy" :label="langConfig.train.evaluate.accuracy[lang]"></el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '95px' : '105px'" sortable prop="actual" :label="langConfig.train.evaluate.actual[lang]"></el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '80px' : '105px'" sortable prop="right" label="一致">
                <template #header>
                  {{ langConfig.train.evaluate.一致[lang] }}
                </template>
              </el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '110px' : '165px'" sortable prop="aspect_right_but_sentiment_wrong" label="情感错误">
                <template #header>
                  {{ langConfig.train.evaluate.情感错误[lang] }}
                </template>
              </el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '120px' : '155px'" sortable prop="aspect_empty" label="分类未识别">
                <template #header>
                  {{ langConfig.train.evaluate.分类未识别[lang] }}
                </template>
              </el-table-column>
              <el-table-column :width="lang === '/zh-CN' ? '110px' : '155px'" sortable prop="aspect_wrong" label="分类误判">
                <template #header>
                  {{ langConfig.train.evaluate.分类误判[lang] }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="langConfig.train.evaluate.report2[lang]" name="report2">
            <el-table
              id="report2"
              class="table-evaluate"
              border
              fit
              :data="report2Data"
              max-height="400px"
              highlight-current-row
              :empty-text="langConfig.train.evaluate.errorReport[lang]"
              :row-class-name="RowClassName"
              @cell-click="getDataset"
            >
              <el-table-column fixed sortable type="index" :index="indexMethod" />
              <el-table-column fixed sortable prop="first" :label="langConfig.train.evaluate.first[lang]">
                <template #default="scope">
                  <span>{{ tagsDict[scope.row.first] ? tagsDict[scope.row.first][lang] : scope.row.first }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed sortable prop="second" :label="langConfig.train.evaluate.second[lang]">
                <template #default="scope">
                  <span>{{ tagsDict[scope.row.second] ? tagsDict[scope.row.second][lang] : scope.row.second }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed sortable prop="sentiment" :label="langConfig.train.evaluate.sentiment[lang]">
                <template #default="scope">
                  <span>{{ tagsDict[scope.row.sentiment] ? tagsDict[scope.row.sentiment][lang] : scope.row.sentiment }}</span>
                </template>
              </el-table-column>
              <el-table-column sortable prop="precision" :label="langConfig.train.evaluate.precision[lang]"></el-table-column>
              <el-table-column sortable prop="recall" :label="langConfig.train.evaluate.recall[lang]"></el-table-column>
              <el-table-column sortable prop="f1" :label="langConfig.train.evaluate.f1[lang]"></el-table-column>
              <el-table-column sortable prop="accuracy" :label="langConfig.train.evaluate.accuracy[lang]"></el-table-column>
              <el-table-column sortable prop="actual" :label="langConfig.train.evaluate.actual[lang]"></el-table-column>
              <el-table-column sortable prop="right" label="一致">
                <template #header>
                  {{ langConfig.train.evaluate.一致[lang] }}
                </template>
              </el-table-column>
              <el-table-column sortable prop="aspect_right_but_sentiment_wrong" label="情感错误">
                <template #header>
                  {{ langConfig.train.evaluate.情感错误[lang] }}
                </template>
              </el-table-column>
              <el-table-column sortable prop="aspect_empty" label="分类未识别">
                <template #header>
                  {{ langConfig.train.evaluate.分类未识别[lang] }}
                </template>
              </el-table-column>
              <el-table-column sortable prop="aspect_wrong" label="分类误判">
                <template #header>
                  {{ langConfig.train.evaluate.分类误判[lang] }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="11" :offset="1">
        <el-tabs v-if="queryData.first">
          <el-tab-pane name="dataset">
            <template #label>
              <span v-if="queryData.first">
                {{ tagsDict[queryData.first] ? tagsDict[queryData.first][lang] : queryData.first }}
              </span>
              <span> # </span>
              <span v-if="queryData.second">
                {{ tagsDict[queryData.second] ? tagsDict[queryData.second][lang] : queryData.second }}
              </span>
              <span> # </span>
              <span v-if="queryData.equal">
                {{ langConfig.train.evaluate[queryData.equal][lang] ?? queryData.equal }}
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
        <el-table
          v-show="datasetData.length > 0"
          id="dataset"
          ref="tableRef"
          class="table-evaluate"
          border
          :data="datasetData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
          max-height="400px"
          :row-class-name="RowClassNameDataset"
          @row-click="RowCickDataset"
        >
          <el-table-column type="index" :index="datasetIndex"></el-table-column>
          <el-table-column prop="index" label="index"></el-table-column>
          <el-table-column prop="content" :label="langConfig.train.evaluate.content[lang]" width="170px">
            <template #default="scope">
              <span v-if="scope.row.content">{{ scope.row.content.slice(0, 10) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="equal" :label="langConfig.train.evaluate.equal[lang]">
            <template #default="scope">
              {{ langConfig.train.evaluate[scope.row.equal][lang] }}
            </template>
          </el-table-column>
          <el-table-column prop="first" :label="langConfig.train.evaluate.a_first[lang]">
            <template #default="scope">
              <span>{{ tagsDict[scope.row.first] ? tagsDict[scope.row.first][lang] : scope.row.first }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="second" :label="langConfig.train.evaluate.a_second[lang]">
            <template #default="scope">
              <span>{{ tagsDict[scope.row.second] ? tagsDict[scope.row.second][lang] : scope.row.second }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sentiment" :label="langConfig.train.evaluate.a_sentiment[lang]">
            <template #default="scope">
              <span>{{ tagsDict[scope.row.sentiment] ? tagsDict[scope.row.sentiment][lang] : scope.row.sentiment }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="m_first" :label="langConfig.train.evaluate.m_first[lang]">
            <template #default="scope">
              <span>{{ tagsDict[scope.row.m_first] ? tagsDict[scope.row.m_first][lang] : scope.row.m_first }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="m_second" :label="langConfig.train.evaluate.m_second[lang]">
            <template #default="scope">
              <span>{{ tagsDict[scope.row.m_second] ? tagsDict[scope.row.m_second][lang] : scope.row.m_second }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="m_sentiment" :label="langConfig.train.evaluate.m_sentiment[lang]">
            <template #default="scope">
              <span>{{ tagsDict[scope.row.m_sentiment] ? tagsDict[scope.row.m_sentiment][lang] : scope.row.m_sentiment }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-pagination"
          :small="true"
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[100]"
          layout="total, prev, pager, next"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="tag-contrast" v-if="did">
          <div>
            <el-checkbox v-model="showAllTag" :label="langConfig.train.evaluate.showAllTag[lang]"></el-checkbox>
            <el-checkbox v-model="showType" :label="langConfig.train.evaluate.viewType[lang]"></el-checkbox>
            <router-link :to="{ name: 'er2', params: { tid: subtask.tid }, query: { did: did, mode: '批量审阅' } }" custom v-slot="{ href }">
              <a class="link" :href="href" target="_blank" style="margin-left: 20px;">{{ langConfig.train.evaluate.annotation[lang] }}</a>
            </router-link>
          </div>
          <div class="contrast" v-if="showType">
            <el-row>
              <el-col :span="24">
                <div v-if="subtask.content" style="max-height: 260px; overflow: auto;" id="sourceContent" v-html="subtask.content.replace(/\t(waiter|customer)/g, '<br/>$1').replace(/\t/g, ' ')"></div>
              </el-col>
              <el-col :span="7" class="contrast-content">
                <h3>{{ langConfig.train.evaluate.pRestult[lang] }}</h3>
                <div v-for="p in ptag" :key="p">
                  <div v-if="p.sentiment">
                    <span>
                      【{{ tagsDict[p.aspect.tag] ? tagsDict[p.aspect.tag][lang] : p.aspect.tag }}】 - 【{{ tagsDict[p.sentiment.tag] ? tagsDict[p.sentiment.tag][lang] : p.sentiment.tag }}】
                    </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(p.aspect.text)">{{ p.aspect.text }}</span>
                    -
                    <span style="cursor: pointer;" @click.stop="findString(p.sentiment.text)">{{ p.sentiment.text }}</span>
                  </div>
                  <div v-else>
                    <span> 【{{ tagsDict[p.aspect.tag] ? tagsDict[p.aspect.tag][lang] : p.aspect.tag }}】 </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(p.aspect.text)">{{ p.aspect.text }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" :offset="1" class="contrast-content">
                <h3>{{ langConfig.train.evaluate.mRestult[lang] }}</h3>
                <div v-for="m in mtag" :key="m">
                  <div v-if="m.sentiment">
                    <span>
                      【{{ tagsDict[m.aspect.type] ? tagsDict[m.aspect.type][lang] : m.aspect.type }}】 - 【{{ tagsDict[m.sentiment.type] ? tagsDict[m.sentiment.type][lang] : m.sentiment.type }}】
                    </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(m.aspect.word)">{{ m.aspect.word }}</span>
                    -
                    <span style="cursor: pointer;" @click.stop="findString(m.sentiment.word)">{{ m.sentiment.word }}</span>
                  </div>
                  <div v-else>
                    <span> 【{{ tagsDict[m.aspect.type] ? tagsDict[m.aspect.type][lang] : m.aspect.type }}】 </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(m.aspect.word)">{{ m.aspect.word }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-divider></el-divider>
          </div>
          <div id="annotation">
            <annotation v-show="did" :inital-anno="annoData" :lang="lang" :inital-did="did" :tags-dict="tagsDict" :listen-point="listenPoint" inital-mode="查看模式"> </annotation>
            <el-divider></el-divider>
          </div>
          <div class="contrast" v-if="!showType">
            <el-row>
              <el-col :span="24">
                <div v-if="subtask.content" style="max-height: 260px; overflow: auto;" id="sourceContent" v-html="subtask.content.replace(/\t(waiter|customer)/g, '<br/>$1').replace(/\t/g, ' ')"></div>
              </el-col>
              <el-col :span="7" class="contrast-content">
                <h3>{{ langConfig.train.evaluate.pRestult[lang] }}</h3>
                <div v-for="p in ptag" :key="p">
                  <div v-if="p.sentiment">
                    <span>
                      【{{ tagsDict[p.aspect.tag] ? tagsDict[p.aspect.tag][lang] : p.aspect.tag }}】 - 【{{ tagsDict[p.sentiment.tag] ? tagsDict[p.sentiment.tag][lang] : p.sentiment.tag }}】
                    </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(p.aspect.text)">{{ p.aspect.text }}</span>
                    -
                    <span style="cursor: pointer;" @click.stop="findString(p.sentiment.text)">{{ p.sentiment.text }}</span>
                  </div>
                  <div v-else>
                    <span> 【{{ tagsDict[p.aspect.tag] ? tagsDict[p.aspect.tag][lang] : p.aspect.tag }}】 </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(p.aspect.text)">{{ p.aspect.text }}</span>
                  </div>
                </div>
              </el-col>
              <el-col :span="7" :offset="1" class="contrast-content">
                <h3>{{ langConfig.train.evaluate.mRestult[lang] }}</h3>
                <div v-for="m in mtag" :key="m">
                  <div v-if="m.sentiment">
                    <span>
                      【{{ tagsDict[m.aspect.type] ? tagsDict[m.aspect.type][lang] : m.aspect.type }}】 - 【{{ tagsDict[m.sentiment.type] ? tagsDict[m.sentiment.type][lang] : m.sentiment.type }}】
                    </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(m.aspect.word)">{{ m.aspect.word }}</span>
                    -
                    <span style="cursor: pointer;" @click.stop="findString(m.sentiment.word)">{{ m.sentiment.word }}</span>
                  </div>
                  <div v-else>
                    <span> 【{{ tagsDict[m.aspect.type] ? tagsDict[m.aspect.type][lang] : m.aspect.type }}】 </span>
                    ///
                    <span style="cursor: pointer;" @click.stop="findString(m.aspect.word)">{{ m.aspect.word }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <div v-if="subtask" style="color: #ccc; z-index: 1; bottom: 0; position: fixed;">did: {{ did }} user: {{ subtask.name }}</div>
  </div>
</template>
<script lang="ts">
import { logInfo } from '@/utils'
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, nextTick, Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import evaluateService from './api/evaluate'
import { useStore } from '@/store/index'
import { ElMessage } from 'element-plus'
import annotation from '@/views/Tag/components/anno'
import { getTagsDict } from '@/utils/tagsDict'
import { langConfig } from '@/utils/constant/config'
export default defineComponent({
  name: 'evaluate',
  components: { annotation },
  setup() {
    const store = useStore()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    // 评估报告的eid
    const eid = ref('')
    // 页面初始时判断url中是否传递参数
    const route = useRoute()
    const queryData = ref({
      first: '',
      second: '',
      equal: '',
      sentiment: ''
    })
    const init = () => {
      eid.value = route.params.eid.toString()
      if (route.query.first) {
        queryData.value.first = route.query.first.toString()
      }
      if (route.query.second) {
        queryData.value.second = route.query.second.toString()
      }
      if (route.query.equal) {
        queryData.value.equal = route.query.equal.toString()
      }
      if (route.query.sentiment) {
        queryData.value.sentiment = route.query.sentiment.toString()
      }
      getReport()
    }
    // 报告的类型，report1=>无情感区分报告，report2=>带情感区分,dataset=>具体的评估报告结果
    const report1Data = ref([] as any)
    const report2Data = ref([] as any)
    const datasetData = ref([] as any)
    const report = ref('report1')
    const getReport = async () => {
      if (report.value === 'report1' && report1Data.value.length === 0) {
        const res = await evaluateService.getReport({ eid: eid.value, table_name: report.value })
        if (res.status === 200) {
          report1Data.value.slice(0, report1Data.value.length + 1)
          report1Data.value = res.data
        }
      }
      if (report.value === 'report2' && report2Data.value.length === 0) {
        const res = await evaluateService.getReport({ eid: eid.value, table_name: report.value })
        if (res.status === 200) {
          report2Data.value.slice(0, report2Data.value.length + 1)
          report2Data.value = res.data
        }
      }
    }
    // 获取dataset表格数据
    const showNum = ref(100)
    const getDataset = async (row: any, column: any) => {
      showNum.value = 100
      tableRef.value.$refs.scrollBarRef.wrap$.scrollTop = 0
      // 从表格点击中获取相关参数
      if (row && column) {
        queryData.value.first = row.first
        queryData.value.second = row.second
        queryData.value.sentiment = row.sentiment ?? ''
        if (column.property === 'aspect_wrong' || column.property === 'aspect_right_but_sentiment_wrong' || column.property === 'aspect_empty' || column.property === 'right') {
          queryData.value.equal = column.label
        } else {
          queryData.value.equal = ''
        }
      }
      const query = { eid: eid.value, first: queryData.value.first, second: queryData.value.second, sentiment: queryData.value.sentiment, equal: queryData.value.equal }
      const res = await evaluateService.getDataset(query)
      if (res.status === 200) {
        datasetData.value = res.data
        total.value = datasetData.value.length
        currentPage.value = 1
      }
      setRoutequery()
      SetCurrentCell(row.index, column.no)
    }

    // 设置url参数
    const router = useRouter()
    const setRoutequery = () => {
      const route = router.resolve({
        name: 'evaluate',
        query: { first: queryData.value.first.toString(), second: queryData.value.second.toString(), sentiment: queryData.value.sentiment, equal: queryData.value.equal.toString() }
      })
      window.location.href = route.href
    }
    // table index
    const indexMethod = (index: number) => {
      return index + 1
    }
    const RowClassName = ({ row, rowIndex }: any) => {
      row.index = rowIndex
      return ''
    }
    const currentCell = ref()
    // 修改current cell 颜色
    const SetCurrentCell = (rowIndex: number, columnIndex: number) => {
      // 取消原来点击的单元格颜色
      if (currentCell.value) {
        currentCell.value.removeAttribute('style')
      }
      if (columnIndex <= 2) {
        const cell = document.querySelector('#report1')?.querySelector('.el-table__fixed')?.querySelectorAll('.el-table__row')[rowIndex].children[columnIndex]
        cell?.setAttribute('style', 'color:red;')
        currentCell.value = cell
      } else {
        const cell = document.querySelector('#report1')?.querySelector('.el-table__body-wrapper')?.querySelectorAll('.el-table__row')[rowIndex].children[columnIndex]
        cell?.setAttribute('style', 'color:red;')
        currentCell.value = cell
      }
    }
    // 高亮已经查看过的数据
    const RowClassNameDataset = ({ row, rowIndex }: any) => {
      row.rowIndex = rowIndex + (currentPage.value - 1) * pageSize.value
      if (row.viewed) {
        return 'current-row'
      }
    }
    const did = ref('')
    const subtask = ref()
    const tag = ref()
    const m_tag = ref()
    const ptag = ref([] as any)

    const tableRef = ref()

    // dataset点击操作
    const RowCickDataset = async (row: any, column: any, event: any) => {
      const res = await evaluateService.getTag({ eid: eid.value, did: row.did })
      await evaluateService.setViewed({ id: row._id, viewed: row.viewed })
      // 当前行设置高亮
      datasetData.value[row.rowIndex].viewed = 1
      subtask.value = res.data.subtask
      tag.value = res.data.tag
      m_tag.value = res.data.m_tag
      filterTags.value.splice(0, filterTags.value.length)
      filterTags.value.push(row.second)
      filterTags.value.push(row.m_second)
      for (const t in tagsDict.value) {
        let t_tag = []
        t_tag.push(t)
        for (const t_type in tagsDict.value[t]) {
          t_tag.push(tagsDict.value[t][t_type])
        }
        // logInfo('t_tag', t_tag)
        if (t_tag.includes(row.second) || t_tag.includes(row.m_second)) {
          filterTags.value.push(...t_tag)
        }
      }
      logInfo('filterTags', filterTags.value)
      const select_tag = row.second === '' ? row.m_second : row.second
      proxy.$bus.$emit('search-tag', tagsDict.value[select_tag] ? tagsDict.value[select_tag][lang.value] : select_tag)
      renderBottom()
      // 如果有返回信息，则显示错误信息
      if (res.data.msg) {
        ElMessage.warning(res.data.msg)
      }
      did.value = row.did
      SetDataCurrentCell(row.rowIndex, column.no)
    }
    const dataCurrentCell = ref()
    // 修改current cell 颜色
    const SetDataCurrentCell = (rowIndex: number, columnIndex: number) => {
      // 取消原来点击的单元格颜色
      if (dataCurrentCell.value) {
        dataCurrentCell.value.removeAttribute('style')
      }
      const cell = document.querySelector('#dataset')?.querySelector('.el-table__body-wrapper')?.querySelectorAll('.el-table__row')[rowIndex - (currentPage.value - 1) * pageSize.value].children[
        columnIndex
      ]
      cell?.setAttribute('style', 'border: solid 1px #ccc;')
      dataCurrentCell.value = cell
    }
    // 将接口返回的一条数据做处理用于展示
    const renderBottom = () => {
      filterPtags()
      filterMtags()
      annotation()
    }
    // 用于展示过滤的结果
    const filterTags = ref([] as any)
    const matchTag = (value: any) => {
      return showAllTag.value || filterTags.value.includes(value)
    }
    // 处理人工标注结果
    const filterPtags = () => {
      if (!tag.value) {
        return
      }
      ptag.value.splice(0, ptag.value.length)
      let entities = {} as any
      // 处理entities中的标签
      tag.value.entities.forEach((e: any) => {
        entities[String(e.id)] = e
      })
      // 处理relations中的关系
      var record = new Set()
      tag.value.relations.forEach((e: any) => {
        var key = String(e.aspect)
        if (matchTag(entities[key].tag)) {
          record.add(key)
          record.add(String(e.sentiment))
          ptag.value.push({
            aspect: entities[key],
            sentiment: entities[String(e.sentiment)]
          })
        }
      })
      tag.value.entities.forEach((e: any) => {
        if (matchTag(e.tag) && !record.has(String(e.id))) {
          ptag.value.push({ aspect: e, sentiment: null })
        }
      })
    }
    // 处理模型识别结果
    const mtag = ref([] as any)
    const filterMtags = () => {
      mtag.value.splice(0, mtag.value.length)
      if (!m_tag.value) {
        return
      }
      // let entities = [] as any
      if (m_tag.value.length === 0) {
        return
      }
      const mmm = JSON.parse(JSON.stringify(m_tag.value))
      // aspect-sentiment 接口适配
      if (Array.isArray(mmm[0])) {
        mmm[1].forEach((ele: any) => {
          var record = new Set()
          if (ele.relations) {
            // relations部分适配
            ele.relations.forEach((e: any) => {
              if (matchTag(e[0].type)) {
                if (!Object.prototype.hasOwnProperty.call(e[1], 'c_start')) {
                  e[0].start = ele.padding
                  e[0].end += ele.padding
                  e[1].start += ele.padding
                  e[1].end += ele.padding
                }
                record.add(e[0].start + '_' + e[0].end + '_' + e[0].type)
                record.add(e[1].start + '_' + e[1].end + '_' + e[1].type)
                mtag.value.push({ aspect: e[0], sentiment: e[1] })
              }
            })
            // aspects部分适配
            ele.aspects.forEach((e: any) => {
              if (!Object.prototype.hasOwnProperty.call(e, 'c_start')) {
                e.start += ele.padding
                e.end += ele.padding
              }
              var key = String(e.start + '_' + e.end + '_' + e.type)
              if (matchTag(e.type) && !record.has(key)) {
                mtag.value.push({ aspect: e, sentiment: null })
              }
            })
            // sentiments部分适配
            ele.sentiments.forEach((e: any) => {
              if (!Object.prototype.hasOwnProperty.call(e, 'c_start')) {
                e.start += ele.padding
                e.end += ele.padding
              }
              var key = String(e.start + '_' + e.end + '_' + e.type)
              if (matchTag(e.type) && !record.has(key)) {
                mtag.value.push({ aspect: e, sentiment: null })
              }
            })
          }
          if (ele.data) {
            ele.data.forEach((e: any) => {
              e.pair.forEach((p: any) => {
                if (p.relation && matchTag(p.input[0].type)) {
                  mtag.value.push({ aspect: p.input[0], sentiment: p.input[1] })
                  var i = mtag.value.indexOf({ aspect: p.input[0], sentiment: null })
                  if (i > -1) {
                    mtag.value.splice(i, 1)
                  }
                }
              })
            })
          }
        })
      } else {
        // ner接口适配
        mmm.forEach((e: any) => {
          if (matchTag(e.type)) {
            if (e.padding) {
              if (!Object.prototype.hasOwnProperty.call(e, 'c_start')) {
                e.start += e.padding
                e.end += e.padding
              }
            }
            mtag.value.push({ aspect: e, sentiment: null })
          }
        })
      }
    }
    // 是否展示所有指标
    const showAllTag = ref(false)
    // 提醒anno插件，数据发生了变化
    const listenPoint = ref(true)
    // 显示的标注-模型结果对比样式
    const showType = ref(false)
    watch(showAllTag, (newValue, oldValue) => {
      listenPoint.value = !listenPoint.value
      if (newValue != null && newValue != oldValue) {
        renderBottom()
      }
    })
    // 构建anno结构
    // 标注数据
    interface entitesFace {
      tag: String
      text: String
      begin: Number
      end: Number
      id: Number
    }
    interface relationsFace {
      type: String
      aspect: String
      sentiment: String
    }
    interface annoFace {
      content: String
      entities: Array<entitesFace>
      relations: Array<relationsFace>
    }

    const { proxy } = getCurrentInstance() as any
    const annoData: annoFace = { content: '', entities: [], relations: [] }
    const annotation = () => {
      let pdata = [] as any
      let mdata = [] as any
      if (showAllTag.value) {
        mdata = convertAnnotationStyle(JSON.parse(JSON.stringify(m_tag.value)))
        pdata = JSON.parse(JSON.stringify(tag.value))
      } else {
        const md = JSON.parse(JSON.stringify(mtag.value))
        mdata = convertFilteredAnnotationStyle(md)
        pdata = convertFilteredAnnotationStyle(JSON.parse(JSON.stringify(ptag.value)))
      }
      logInfo('pdata', pdata)
      logInfo('mdata', mdata)
      annoData.content = subtask.value.content
      annoData.entities = [
        ...pdata.entities.map((e: any, index: number) => {
          const t = tagsDict.value[e.tag] ? tagsDict.value[e.tag][lang.value] : e.tag
          e.tag = langConfig.train.evaluate.tagFrom[lang.value] + t
          e.id = index
          return e
        }),
        ...mdata.entities.map((e: any, index: number) => {
          e.id = pdata.entities.length + index + 1
          e.tag = tagsDict.value[e.tag] ? tagsDict.value[e.tag][lang.value] : e.tag
          return e
        })
      ]
      logInfo('annoData', annoData)
    }
    // 将模型预测的结果 eval 接口返回的数据转换为标注结构
    const convertAnnotationStyle = (data: any) => {
      if (data.length === 0) {
        return { entities: [], relations: [] }
      }
      // 转化aspect-sentiment 接口
      if (Array.isArray(data[0])) {
        let ddd = data[1]
        const entities = []
        for (let i = 0; i < ddd.length; i++) {
          const segment = ddd[i]
          // aspect 部分适配
          for (let j = 0; j < segment.aspects.length; j++) {
            const aspect = segment.aspects[j]
            if (!Object.prototype.hasOwnProperty.call(aspect, 'c_start')) {
              aspect.start += segment.padding
              aspect.end += segment.padding
            }
            entities.push({
              begin: aspect.start,
              end: aspect.end - 1,
              id: 0,
              tag: aspect.type,
              text: aspect.word
            })
          }
          // sentiments 部分适配
          for (let j = 0; j < segment.sentiments.length; j++) {
            const sentiment = segment.sentiments[j]
            if (!Object.prototype.hasOwnProperty.call(sentiment, 'c_start')) {
              sentiment.start += segment.padding
              sentiment.end += segment.padding
            }
            entities.push({
              begin: sentiment.start,
              end: sentiment.end - 1,
              id: 0,
              tag: sentiment.type,
              text: sentiment.word
            })
          }
        }
        return {
          entities: entities,
          relations: []
        }
      } else {
        const entities = [] as any
        data.forEach((d: any) => {
          entities.push({
            begin: d.start,
            end: d.end - 1,
            id: 0,
            tag: d.type,
            text: d.word
          })
        })
        return {
          entities: entities,
          relations: []
        }
      }
    }
    // 非显示全部指标下，根据二级指标进行过滤
    const convertFilteredAnnotationStyle = (data: any) => {
      const entities = [] as any
      data.forEach((d: any) => {
        if (d.aspect) {
          if (d.aspect.hasOwnProperty('type')) {
            entities.push({
              begin: d.aspect.start,
              end: d.aspect.end - 1,
              id: 0,
              tag: d.aspect.type,
              text: d.aspect.word
            })
          } else {
            entities.push(d.aspect)
          }
        }
        if (d.sentiment) {
          if (d.sentiment.hasOwnProperty('type')) {
            // 处理 sentiment
            entities.push({
              begin: d.sentiment.start,
              end: d.sentiment.end - 1,
              id: 0,
              tag: d.sentiment.type,
              text: d.sentiment.word
            })
          } else {
            // 处理 sentiment
            entities.push(d.sentiment)
          }
        }
      })
      return {
        entities: entities,
        relations: []
      }
    }
    // 获得任务的配置信息
    const tags: Ref<Array<[]> | null> = ref(null)
    const tagsDict = ref({} as any) // 中英词典对照表
    const getConfig = async () => {
      const res = await evaluateService.erConfig({ eid: eid.value })
      tags.value = JSON.parse(res.data.config)
      tagsDict.value = getTagsDict(JSON.parse(res.data.config))
      await nextTick()
      translateTag()
      logInfo(tagsDict.value)
    }
    const findString = (str: string) => {
      var el = document.getElementById('sourceContent')!
      const text = el?.innerHTML
      const marked = text?.replace(/<\/?mark>/g, '').replace(RegExp(`(${str})`, 'g'), '<mark>' + str + '</mark>')
      el.innerHTML = marked
    }
    /**右边table翻页 */
    const currentPage = ref(1)
    const total = ref(0)
    const pageSize = ref(200)
    const currentChange = async () => {
      await nextTick()
      tableRef.value.$refs.scrollBarRef.wrap$.scrollTop = 0
      tableRef.value.doLayout()
    }
    const datasetIndex = (index: number) => {
      return (currentPage.value - 1) * pageSize.value + index + 1
    }
    /**指标翻译 */
    const translateTag = () => {
      for (const [key, value] of Object.entries(tagsDict.value)) {
        tagsDict.value[value['/zh-CN']] = value
        tagsDict.value[value['/en-US']] = value
      }
    }
    onMounted(() => {
      init()
      getConfig()
    })
    onBeforeUnmount(() => {
      proxy.$bus.$off('search-tag')
    })
    return {
      queryData,
      report,
      report1Data,
      report2Data,
      datasetData,
      indexMethod,
      getDataset,
      RowClassName,
      RowClassNameDataset,
      RowCickDataset,
      subtask,
      ptag,
      mtag,
      did,
      annoData,
      lang,
      showAllTag,
      listenPoint,
      showType,
      tagsDict,
      findString,
      langConfig,
      getReport,
      showNum,
      tableRef,
      total,
      currentPage,
      pageSize,
      currentChange,
      datasetIndex
    }
  }
})
</script>
