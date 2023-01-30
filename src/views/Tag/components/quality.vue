<style scoped>
/* .quality {
  margin: 30px;
} */
.tag {
  margin: 5px;
  cursor: pointer;
}
.similar-page-div {
  margin-top: 10px;
}
.similar-page-button {
  background-color: #f0f2f5;
  border: none;
}
</style>
<template>
  <el-button text @click="drawer = true">{{ langConfig.alice.er.quality[lang] }}</el-button>
  <el-drawer v-model="drawer" size="40%" @open="tagChange">
    <template #title>
      <h4>
        {{ langConfig.alice.er.quality[lang] }}
      </h4>
    </template>
    <el-tabs v-model="activeName" @tab-change="tagChange">
      <el-tab-pane :label="langConfig.alice.er.quality[lang]" name="words">
        <div class="quality">
          <el-button text type="primary" @click="load">
            更新数据
            <el-icon><Refresh /></el-icon>
          </el-button>
          <el-scrollbar height="800px">
            <el-table :data="rows" :highlight-current-row="true" v-loading="loading">
              <el-table-column prop="_id" :label="langConfig.alice.er.text[lang] + '(' + rows.length.toString() + ')'"></el-table-column>
              <el-table-column v-for="(tid, index) in tids" :key="index" :label="langConfig.alice.task.task[lang] + (index + 1).toString()" prop="tags">
                <template #default="scope">
                  <el-tag
                    class="tag"
                    v-for="tag in get_tid_row(scope.row, tid)"
                    :type="getTagType(tid, scope.row._id, tagsDict[tag.tag] ? tagsDict[tag.tag][lang] : tag.tag)"
                    :key="tag"
                    size="small"
                    @click="choose(tid, scope.row._id, tag.tag)"
                  >
                    {{ tagsDict[tag.tag] ? tagsDict[tag.tag][lang] : tag.tag }}({{ tag.total }})
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="role" label="相似小助手" name="similar">
        <el-form :inline="true">
          <el-form-item label="文本内容">
            <el-input v-model="searchSimilarData.text" placeholder="请输入查询的文本内容，默认为空"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="searchSimilarData.tag" filterable clearable>
              <el-option v-for="(k, v) in tagsDict" :value="v">{{ k[lang] }}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="searchSimilarData.is_check" true-label="1" false-label="0">查看已审阅数据</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="searchCheckSimialr(1)">查询</el-button>
            <el-popconfirm title="是否要重新计算质量小助手结果" @confirm="checkSimilar">
              <template #reference>
                <el-button text type="primary">
                  更新数据
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </template>
            </el-popconfirm>
          </el-form-item>
        </el-form>
        <el-table :data="searchSimilarData.searchData" v-loading="searchSimilarData.loading">
          <el-table-column prop="text" label="文本内容"></el-table-column>
          <el-table-column label="标注标签">
            <template #default="scope">
              <el-tooltip v-for="tag in scope.row.tags.filter((e:any)=>e.similar_texts.includes(scope.row.text))" placement="top" effect="light" :hide-after="50">
                <template #content>
                  <el-scrollbar max-height="200px">
                    <el-space direction="vertical" alignment="left">
                      <span v-for="snippet in tag.similar_texts" @click="choose(props.tid, snippet, tag.tag)">{{ snippet }}</span>
                    </el-space>
                  </el-scrollbar>
                </template>
                <el-tag class="tag" :type="getTagType(tid, scope.row.tid, tagsDict[tag.tag] ? tagsDict[tag.tag][lang] : tag.tag)" @click="choose(props.tid, scope.row.text, tag.tag)">
                  {{ tagsDict[tag.tag] ? tagsDict[tag.tag][lang] : tag.tag }}
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="未标注的推荐标签">
            <template #default="scope">
              <el-tooltip v-for="tag in scope.row.tags.filter((e:any)=>!e.similar_texts.includes(scope.row.text))" placement="top" effect="light" :hide-after="50">
                <template #content>
                  <el-scrollbar max-height="200px">
                    <el-space direction="vertical" alignment="left">
                      <span v-for="snippet in tag.similar_texts" @click="choose(props.tid, snippet, tag.tag)">{{ snippet }}</span>
                    </el-space>
                  </el-scrollbar>
                </template>
                <el-tag class="tag" :type="getTagType(tid, scope.row.tid, tagsDict[tag.tag] ? tagsDict[tag.tag][lang] : tag.tag)" @click="choose(props.tid, scope.row.text, tag.tag)">
                  {{ tagsDict[tag.tag] ? tagsDict[tag.tag][lang] : tag.tag }}
                </el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="similar-page-div">
          <templa></templa>
          <el-pagination v-if="searchSimilarData.pageType === '0'" background layout="total, next" :total="searchSimilarData.searchTotal" @current-change="searchCheckSimialr(1)"></el-pagination>
          <el-pagination
            v-else
            background
            layout="total, prev, pager, next"
            :total="searchSimilarData.searchTotal"
            v-model:currentPage="searchSimilarData.currentPage"
            @current-change="searchCheckSimialr(searchSimilarData.currentPage)"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script lang="ts">
import { useStore } from '@/store'
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import er2Service from '../api/er2'
import { langConfig } from '@/utils/constant/config'
import { logInfo } from '@/utils'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'quality',
  props: ['tid', 'tagsDict', 'role'],
  emits: ['changeMode'],
  setup(props, { emit }) {
    const rows = ref([] as any)
    const tids = ref([] as any)
    const maxSize = ref(0)
    const loading = ref(true)
    const tagType = ref({
      正面: 'success',
      positive: 'success',
      负面: 'danger',
      negative: 'danger',
      '咨询/求助': '',
      consult: ''
    })
    // 返回tag颜色
    const getTagType = (tid: string, text: string, tag: string) => {
      if (tid === chooseTid.value && text === chooseText.value && tag === chooseTag.value) {
        return 'warning'
      } else {
        if (['正面', 'positive'].includes(tag)) {
          return 'success'
        } else if (['负面', 'negative'].includes(tag)) {
          return 'danger'
        } else if (['咨询/求助', 'consult'].includes(tag)) {
          return ''
        } else {
          return 'info'
        }
      }
    }
    // 获取质量小助手数据
    const load = async () => {
      loading.value = true
      const res = await er2Service.checkQuality(props.tid)
      rows.value.splice(0, rows.value.length, ...res.data.data)
      tids.value.splice(0, tids.value.length, ...res.data.tids)
      maxSize.value = res.data.max_size
      loading.value = false
    }
    // 如果当前使用英文系统则翻译指标
    const store = useStore()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    // 返回指定tid的数据
    const get_tid_row = (row: any, tid: string) => {
      const result = row.tids.filter((element: { tid: string }) => element.tid === tid)
      return result[0]?.tags
    }
    const { proxy } = getCurrentInstance() as any
    // 选中质量小助手tag
    // 当前任务的指标则通知审阅筛选功能更新数据
    // 不是当前任务则跳转到对应任务页面
    const router = useRouter()
    // 当前选中的文本和tag和tid用于高亮选中指标
    const chooseText = ref('')
    const chooseTag = ref('')
    const chooseTid = ref('')
    const choose = (tid: string, text: string, tag: string) => {
      // 更新当前URL
      const route = router.resolve({ name: 'er2', params: { tid: tid }, query: { mode: '批量审阅', text: text, tag: tag, search_mode: 'fullmatch' } })
      chooseTid.value = tid
      chooseText.value = text
      chooseTag.value = tag
      if (tid === props.tid) {
        // window.location.href = route.href
        emit('changeMode', '批量审阅')
        proxy.$bus.$emit('quality', { text: text, tag: tag })
        drawer.value = false
      } else {
        window.open(route.href, '_blank')
      }
    }
    // 抽屉控制
    const drawer = ref(false)
    /**tabs */
    const activeName = ref('words')
    /**相似推荐异常 */
    const searchSimilarData = reactive({
      text: '',
      tag: '',
      is_check: '0',
      searchData: <any[]>[],
      searchTotal: 0,
      pageSize: 10,
      totalPage: 0,
      currentPage: 1,
      loading: false,
      pageType: '0'
    })
    /**支持双语快捷查询标签 */
    const filterTag = (value: string) => {
      logInfo(value)
    }
    /**查询相似推荐异常结果 */
    const searchCheckSimialr = async (page: number) => {
      searchSimilarData.loading = true
      const data = {
        tid: props.tid,
        text: searchSimilarData.text,
        tag: searchSimilarData.tag,
        is_check: searchSimilarData.is_check,
        page: page
      }
      const res = await er2Service.searchCheckSimilar(data)
      searchSimilarData.searchTotal = res.data.count
      searchSimilarData.searchData = res.data.check_data
      searchSimilarData.loading = false
      searchSimilarData.pageType = data.is_check
    }
    /**切换相似标签页 */
    const tagChange = () => {
      if (activeName.value === 'words' && maxSize.value === 0) {
        load()
      }
      if (activeName.value === 'similar' && searchSimilarData.searchData.length === 0) {
        searchCheckSimialr(1)
      }
    }
    /**更新小助手数据 */
    const checkSimilar = async () => {
      const res = await er2Service.checkSimilar({ tid: props.tid })
      if (res.status === 200) {
        ElMessage.success('操作成功，请等待数据计算完成，预计5分钟')
      }
    }
    onBeforeUnmount(() => {
      proxy.$bus.$off('quality')
    })
    return {
      maxSize,
      rows,
      tids,
      get_tid_row,
      choose,
      loading,
      drawer,
      load,
      tagType,
      langConfig,
      lang,
      chooseTid,
      chooseText,
      chooseTag,
      getTagType,
      activeName,
      searchSimilarData,
      filterTag,
      searchCheckSimialr,
      props,
      tagChange,
      checkSimilar
    }
  }
})
</script>
