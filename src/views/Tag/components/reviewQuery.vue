<style lang="scss" scoped>
@import '@/styles/variables.scss';
.transparent {
  background-color: transparent;
}
.row {
  margin-top: 10px;
}
.table-wrapper :deep() .el-table,
.el-table__expanded-cell {
  background-color: $backgroundColor;
}

.table-wrapper :deep() .el-table tr {
  background-color: $backgroundColor;
}
.table-wrapper :deep() .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: $backgroundColor;
}
.table-wrapper :deep() .el-table--enable-row-transition .el-table__body .current-row td,
.el-table .cell {
  background-color: #ecf5ff !important;
}
.table-wrapper :deep() .el-table--enable-row-transition .el-table__header th,
.el-table .cell {
  background-color: $backgroundColor;
}
.table-pagination {
  padding-top: 30px;
}
.table-pagination :deep() .el-pagination__jump {
  justify-content: left !important;
}
.jumper {
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  margin-bottom: 10px;
}
.jumper-input {
  height: 24px;
  line-height: 24px;
  width: 56px;
  margin: 0 8px;
}
.select-tag {
  margin: 5px;
}
</style>
<template>
  <div>
    <el-row class="row">
      <el-col :span="12">
        <el-select v-model="filter_user" size="small" class="filter">
          <el-option value="all" :label="langConfig.alice.review.allUser[lang]">{{ langConfig.alice.review.allUser[lang] }}</el-option>
          <el-option v-for="u in members" :key="u" :value="u" :label="u"></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-select v-model="filter_review" size="small" class="filter">
          <el-option value="all" :label="langConfig.alice.review.all[lang]"></el-option>
          <el-option value="包含审阅意见" :label="langConfig.alice.review.includeComments[lang]"></el-option>
          <el-option value="不包含审阅意见" :label="langConfig.alice.review.noCommentInclude[lang]"></el-option>
          <el-option value="未修订数据" :label="langConfig.alice.review.needToModify[lang]"></el-option>
          <el-option value="已修订数据" :label="langConfig.alice.review.isModifyData[lang]"></el-option>
          <el-option value="插眼" :label="langConfig.alice.review.timeFalg[lang]"></el-option>
          <el-option value="奇怪" :label="langConfig.alice.review.special[lang]"></el-option>
          <el-option value="灌水" :label="langConfig.alice.review.spam[lang]"></el-option>
          <el-option value="数据格式错误" :label="langConfig.alice.review.formatError[lang]"></el-option>
          <el-option value="多选文字" :label="langConfig.alice.review.多选文字[lang]"></el-option>
          <el-option value="少选文字" :label="langConfig.alice.review.少选文字[lang]"></el-option>
          <el-option value="漏标分类" :label="langConfig.alice.review.漏标分类[lang]"></el-option>
          <el-option value="多标分类" :label="langConfig.alice.review.多标分类[lang]"></el-option>
          <el-option value="漏标情感" :label="langConfig.alice.review.漏标情感[lang]"></el-option>
          <el-option value="多标情感" :label="langConfig.alice.review.多标情感[lang]"></el-option>
          <el-option value="分类错误" :label="langConfig.alice.review.分类错误[lang]"></el-option>
          <el-option value="情感错误" :label="langConfig.alice.review.情感错误[lang]"></el-option>
          <el-option value="连线错误" :label="langConfig.alice.review.连线错误[lang]"></el-option>
          <el-option value="标记合格" :label="langConfig.alice.review.标记合格[lang]"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24">
        <div class="block filter">
          <el-date-picker
            size="small"
            v-model="date"
            type="daterange"
            unlink-panels
            range-separator="-"
            :start-placeholder="langConfig.alice.review.start[lang]"
            :end-placeholder="langConfig.alice.review.end[lang]"
            :shortcuts="shortcuts"
            value-format="YYYY-MM-DD"
            @change="change"
            style="width: 100%;"
          >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24">
        <el-input size="small" v-model="words" :placeholder="langConfig.alice.review.searchKeyword[lang]" :clearable="true" style="width: 50%;"></el-input>
        <el-checkbox v-model="relations" size="small" style="margin-left: 20px;">{{ langConfig.alice.review.searchRelations[lang] }}</el-checkbox>
      </el-col>
      <el-col :span="24">
        <el-tooltip effect="dark" placement="top-start" :content="langConfig.alice.review.cancelTagInfo[lang]" :hide-after="0">
          <div style="width: fit-content;">
            <el-tag class="select-tag" v-if="selectTag === '' && selectSentiment === ''">{{ langConfig.alice.review.noSearchTag[lang] }}</el-tag>
            <el-tag class="select-tag" v-if="selectTag" closable @close="selectTag = ''">{{ tagsDict[selectTag] ? tagsDict[selectTag][lang] : selectTag }}</el-tag>
            <el-tag class="select-tag" v-if="selectSentiment" closable @close="selectSentiment = ''">{{ tagsDict[selectSentiment] ? tagsDict[selectSentiment][lang] : selectSentiment }}</el-tag>
          </div>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-row :span="24">
        <el-button size="small" @click="search('fuzzy', $event)">{{ langConfig.alice.review.fuzzyQuery[lang] }}</el-button>
        <el-button size="small" @click="search('fullmatch', $event)">{{ langConfig.alice.review.exactQuery[lang] }}</el-button>
      </el-row>
    </el-row>
    <el-row class="row">
      <el-button v-if="(selectTag || selectSentiment) && words" size="small" @click="search('halfmatch', $event)">{{ langConfig.alice.review.halfExactQuery[lang] }}</el-button>
      <el-button v-if="(selectTag || selectSentiment) && words" size="small" @click="search('reverseWord', $event)">{{ langConfig.alice.review.reverseQuery[lang] }}</el-button>
    </el-row>
    <el-row class="row">
      <el-col :span="24">
        <span>{{ langConfig.alice.review.keyword[lang] }}:{{ words }}</span>
      </el-col>
      <el-col :span="24">
        <span>{{ langConfig.alice.review.tag[lang] }}:</span>
        <span v-for="t in tag" style="padding-right: 10px;">{{ t ? tagsDict[t][lang] : t }}</span>
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col class="table-wrapper" :span="24">
        <div class="jumper">
          <span>{{ langConfig.alice.er.goToPcs[lang] }}</span>
          <el-input-number class="jumper-input" v-model="jumperIndex" :controls="false" size="small" :min="1" :max="batchView.length" @change="jumperChange"></el-input-number>
          <span>{{ langConfig.alice.er.pcs[lang] }}</span>
        </div>
        <el-table
          ref="tableRef"
          class="batch-row"
          max-height="400px"
          v-loading="loading"
          :data="batchView.slice(pageSize * (currentPage - 1), pageSize * currentPage)"
          row-key="did"
          @row-click="rowClick"
          :row-class-name="RowClassName"
          :scrollbar-always-on="true"
        >
          <el-table-column prop="content" :label="langConfig.alice.review.data[lang] + '(' + batchView.length + ')'">
            <template #default="scope">
              <span>{{ scope.$index + 1 + pageSize * (currentPage - 1) }} # {{ scope.row.content.slice(0, 50) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="table-pagination"
          :small="true"
          v-model:currentPage="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[100]"
          layout="prev, pager, next,jumper"
          :total="total"
          @current-change="currentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { useStore } from '@/store/index'
import { buttonBlur, logInfo } from '@/utils'
import { ElMessage } from 'element-plus'
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref, toRefs, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import er2Service from '../api/er2'
import taskService from '../api/task'
import { langConfig } from '@/utils/constant/config'
export default defineComponent({
  name: 'reviewQuery',
  props: {
    initalTid: {
      type: String,
      required: true
    },
    initalMode: {
      type: String,
      required: true
    },
    tagsDict: {
      type: Object,
      required: true
    },
    erLoading: {
      type: Boolean
    }
  },
  emits: ['chooseOne'],
  setup(props, { emit }) {
    const tid = ref(props.initalTid)
    const date = ref<string[]>([])
    const filter = reactive({
      words: '',
      tag: ['', ''],
      filter_user: 'all',
      filter_review: 'all',
      review_from: '',
      review_to: '',
      relations: false
    })
    // 标注人员列表
    const members = ref<string[]>([])
    const getMembers = async () => {
      const membersRes = await taskService.get_members(tid.value)
      members.value = membersRes.data.map((m: any) => m.name)
    }
    // 时间选择
    const shortcuts = [
      {
        text: '最近1天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
          return [start, end]
        }
      },
      {
        text: '最近3天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
          return [start, end]
        }
      },
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
      }
    ]
    const change = () => {
      if (date.value) {
        filter.review_from = date.value[0]
        filter.review_to = date.value[1]
      } else {
        filter.review_from = ''
        filter.review_to = ''
      }
    }
    // 标注数据查询展示结果
    const batchView = ref<any[]>([])
    const scrollIndex = ref(-1)
    const loading = ref(false)
    // 查询标注数据
    const search = async (search_mode: string, v: any) => {
      loading.value = true
      // 如果查询指标为type_en，则转换为type查询
      // 如果只有一个标签，老样子
      if (selectTag.value === '' || selectSentiment.value === '') {
        const tag = selectTag.value === '' ? selectSentiment.value : selectTag.value
        const data = {
          words: filter.words,
          tag: tag ?? '',
          filter_user: filter.filter_user == 'all' ? '' : filter.filter_user,
          filter_review: filter.filter_review == 'all' ? '' : filter.filter_review,
          review_from: filter.review_from,
          review_to: filter.review_to,
          search_mode: search_mode,
          relations: filter.relations
        }
        var searchRes = await er2Service.searchTag(tid.value, { mode: props.initalMode }, data)
      } else {
        const tags = [selectTag.value, selectSentiment.value]
        const data = {
          words: filter.words,
          tags: tags,
          filter_user: filter.filter_user == 'all' ? '' : filter.filter_user,
          filter_review: filter.filter_review == 'all' ? '' : filter.filter_review,
          review_from: filter.review_from,
          review_to: filter.review_to,
          search_mode: search_mode,
          relations: filter.relations
        }
        var searchRes = await er2Service.searchTags(tid.value, { mode: props.initalMode }, data)
      }
      if (searchRes.status !== 200) {
        ElMessage.warning(searchRes.msg)
      } else {
        filter.tag = [selectTag.value, selectSentiment.value]
        proxy.$bus.$emit('search-tag', selectTag.value ?? '')
        batchView.value = searchRes.data
        if (batchView.value.length > 0) {
          choose(batchView.value[0].did, 0)
        }
        total.value = batchView.value.length
        currentPage.value = 1
      }
      loading.value = false
      buttonBlur(v)
      // 换到第一条
      showIndex.value = 0
      setScroll(0)
      setCurrentRow(0)
    }
    const store = useStore()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    // 快捷键切换上下条
    const prev = async () => {
      if (props.initalMode === '批量审阅' && !props.erLoading) {
        if (jumperIndex.value === 1) {
          ElMessage(langConfig.alice.er.notPrev[lang.value])
          return
        }
        if (scrollIndex.value == 0) {
          currentPage.value -= 1
          await nextTick()
          scrollIndex.value = 100
        }
        const index = scrollIndex.value - 1
        choose(batchView.value[scrollIndex.value + pageSize.value * (currentPage.value - 1) - 1].did, index)
      }
    }
    const next = async () => {
      if (props.initalMode === '批量审阅' && !props.erLoading) {
        // 判断是否为当前页最后一条
        if (jumperIndex.value === batchView.value.length) {
          ElMessage(langConfig.alice.er.notNext[lang.value])
          return
        }
        scrollIndex.value += 1
        if (scrollIndex.value === pageSize.value) {
          currentPage.value += 1
          await nextTick()
          scrollIndex.value = 0
        }
        choose(batchView.value[scrollIndex.value + pageSize.value * (currentPage.value - 1)].did, scrollIndex.value)
      }
    }
    // 选中单条数据后，向父组件通知
    const RowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
      row.index = rowIndex
      return ''
    }
    const rowClick = (row: any) => {
      if (!props.erLoading) {
        choose(row.did, row.index)
        setCurrentRow(row.index)
      }
    }

    const choose = async (did: any, index: number) => {
      const chooseIndex = index + showIndex.value
      if (chooseIndex < 100) {
        scrollIndex.value = index
        showIndex.value = 0
      } else if (chooseIndex > batchView.value.length - 100) {
        const i = batchView.value.length - 200
        if (i < 0) {
          scrollIndex.value = index
        } else {
          showIndex.value = i
          scrollIndex.value = 200 - (batchView.value.length - chooseIndex)
        }
      } else {
        scrollIndex.value = 100
        showIndex.value = chooseIndex - 100
      }
      emit('chooseOne', did)
      await nextTick()
      setScroll(scrollIndex.value)
      setCurrentRow(scrollIndex.value)
    }

    // 接收质量小助手的参数
    const get_quality = (value: { text: string; tag: string }) => {
      filter.words = value.text
      // 需要先将查询指标清空
      selectSentiment.value = ''
      selectTag.value = ''
      get_select_tag(value.tag)
      search('fullmatch', undefined)
    }
    // 当前选中的指标
    const selectTag = ref('')
    const selectSentiment = ref('')
    const sentimentType = ['正面', '负面', '中性', 'negative', 'positive', 'nertual']
    const get_select_tag = (tag: string) => {
      if (sentimentType.includes(tag)) {
        selectSentiment.value = tag
      } else {
        selectTag.value = tag
      }
    }
    // 清空当前选中指标
    const cleanSelectTag = () => {
      selectTag.value = ''
    }
    // 查询数据table滚动条位置更新
    const showIndex = ref(0)
    const { proxy } = getCurrentInstance() as any
    const tableRef = ref()
    const setScroll = (newValue: number) => {
      const BatchRowElement = document.getElementsByClassName('batch-row')[0].getElementsByClassName('el-table__row')
      const chooseCurrentRow = BatchRowElement[newValue - 2]
      if (chooseCurrentRow) {
        const scrollTop = (chooseCurrentRow as HTMLElement).offsetTop
        tableRef.value.$refs.scrollBarRef.wrap$.scrollTop = scrollTop
      } else {
        tableRef.value.$refs.scrollBarRef.wrap$.scrollTop = 0
      }
    }
    // 更新高亮选中行
    const setCurrentRow = (index: number) => {
      const currentRow = document.getElementsByClassName('batch-row')[0].getElementsByClassName('el-table__row current-row')[0]
      if (currentRow) {
        currentRow.setAttribute('class', 'el-table__row')
      }
      const chooseCurrentRow = document.getElementsByClassName('batch-row')[0].getElementsByClassName('el-table__row')[index]
      chooseCurrentRow?.setAttribute('class', 'el-table__row current-row')
    }

    // 根据url中带有的信息，初始化相关参数，如果查询的text和tag都不为空则search
    const route = useRoute()
    const initReview = async () => {
      filter.words = route.query.text?.toString() ?? ''
      if (route.query.tag) {
        route.query.tag
          .toString()
          .split(',')
          .forEach((e: string) => {
            get_select_tag(e)
          })
      }
      // selectTag.value = route.query.tag?.toString() ?? ''
      const search_mode = route.query.search_mode?.toString() ?? ''
      await nextTick()
      if (route.query.text || route.query.tag) {
        search(search_mode, undefined)
      }
    }
    /**
     * 查询需修订数据
     */
    const search_review = (data: any) => {
      filter.filter_user = data.user
      filter.filter_review = data.filter_review
      filter.review_from = data.start
      filter.review_to = data.end
      date.value = [data.start, data.end]
      nextTick()
      search('fuzzy', undefined)
    }
    /**
     * 滚动条监听事件
     */
    const scrollListen = (res: any) => {
      if (res.srcElement.scrollTop + res.srcElement.clientHeight >= res.srcElement.scrollHeight && showIndex.value + 1 + 200 < batchView.value.length) {
        if (showIndex.value + 200 < batchView.value.length) {
          showIndex.value += 100
        } else {
          showIndex.value = batchView.value.length - 200
        }
        setScroll(100)
        setCurrentRow(100)
        return
      }
      if (res.srcElement.scrollTop === 0 && showIndex.value) {
        if (showIndex.value - 200 < 0) {
          showIndex.value = 0
        } else {
          showIndex.value -= 200
        }
        setScroll(100)
        setCurrentRow(100)
        return
      }
    }
    /**查询分页展示 */
    const total = ref(0)
    const pageSize = ref(100)
    const currentPage = ref(1)
    const currentChange = (value: number) => {
      scrollIndex.value = 0
      choose(batchView.value[scrollIndex.value + pageSize.value * (currentPage.value - 1)].did, scrollIndex.value)
    }
    /**跳转序号 */
    const jumperIndex = computed(() => {
      return scrollIndex.value + 1 + pageSize.value * (currentPage.value - 1)
    })
    const jumperChange = async (currentValue: any) => {
      // 先判断对应的页码
      currentPage.value = Math.ceil(currentValue / pageSize.value)
      await nextTick()
      scrollIndex.value = currentValue % pageSize.value === 0 ? pageSize.value - 1 : (currentValue % pageSize.value) - 1
      choose(batchView.value[jumperIndex.value - 1].did, scrollIndex.value)
    }
    onMounted(() => {
      // 滚动条监听
      nextTick()
      // tableRef.value.$refs.scrollBarRef.wrap$.addEventListener('scroll', (res: any) => {
      //   window.setTimeout(() => scrollListen(res), 1000)
      // })
      getMembers()
      initReview()
      if (filter.filter_review !== 'all') {
        search('fuzzy', undefined)
      }
      proxy.$bus.$on('prev', prev)
      proxy.$bus.$on('next', next)
      proxy.$bus.$on('quality', get_quality)
      proxy.$bus.$on('select-tag', get_select_tag)
      proxy.$bus.$on('search-review', search_review)
    })
    onBeforeUnmount(() => {
      proxy.$bus.$off('prev')
      proxy.$bus.$off('next')
      proxy.$bus.$off('quality')
      proxy.$bus.$off('select-tag')
      proxy.$bus.$off('search-tag')
    })
    return {
      ...toRefs(filter),
      members,
      shortcuts,
      date,
      batchView,
      change,
      search,
      rowClick,
      RowClassName,
      selectTag,
      selectSentiment,
      cleanSelectTag,
      setCurrentRow,
      loading,
      langConfig,
      lang,
      showIndex,
      tableRef,
      currentPage,
      total,
      pageSize,
      scrollIndex,
      jumperIndex,
      jumperChange,
      currentChange
    }
  }
})
</script>
