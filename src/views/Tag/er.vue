<template>
  <div id="er2">
    <!-- 头部信息栏 -->
    <div class="top-navbar">
      <el-row>
        <el-col :span="7">
          <label style="margin-right: 20px;">{{ task.name }}</label>
          <el-button v-if="mode == '专一模式'" text @click="changeMode('批量审阅')">{{ langConfig.alice.task.review[lang] }}</el-button>
          <el-button v-if="mode == '批量审阅'" text @click="changeMode('专一模式')">{{ langConfig.alice.task.annotation[lang] }}</el-button>
          <el-button v-if="!hiddenTag" text @click="hiddenTag = true">{{ langConfig.alice.er.hideTag[lang] }}</el-button>
          <el-button v-if="hiddenTag" text @click="hiddenTag = false">{{ langConfig.alice.er.showTag[lang] }}</el-button>
          <el-button v-if="checkEntities" text @click="checkEntities = false">{{ langConfig.alice.er.checkRepetition[lang] }}</el-button>
          <el-button v-if="!checkEntities" text @click="checkEntities = true">{{ langConfig.alice.er.NotcheckRepetition[lang] }}</el-button>
          <el-tooltip v-if="simSearch" effect="light" placement="bottom">
            <template #content>
              <h4>指标推荐根据相似度计算而出，并不能保证推荐的标签绝对正确，标注请以实际结果为准</h4>
              <el-form :inline="true">
                <el-form-item label="最相似的K个片段">
                  <el-input-number v-model="simInfo.top_k" :min="1" :max="50" controls-position="right" size="small"></el-input-number>
                </el-form-item>
                <el-form-item label="相似度阈值">
                  <el-input-number v-model="simInfo.score" :precision="1" :min="0.6" :max="1.0" :step="0.1" size="small" controls-position="right"></el-input-number>
                </el-form-item>
                <el-form-item label="显示标签下相似度最高的N个结果">
                  <el-input-number v-model="simInfo.show_k" :min="1" :max="20" controls-position="right" size="small"></el-input-number>
                </el-form-item>
              </el-form>
            </template>
            <el-button text @click="simSearch = false">{{ langConfig.alice.er.simSearch[lang] }}</el-button>
          </el-tooltip>
          <el-button v-if="!simSearch" text @click="simSearch = true">{{ langConfig.alice.er.NotsimSearch[lang] }}</el-button>
        </el-col>
        <el-col :span="5" class="navbar-progress">
          <span v-if="mode == '专一模式'">
            <el-button text @click="prev">&lt;{{ langConfig.alice.er.prev[lang] }}</el-button>
            <span title="当前位置">{{ index }}</span>
            /
            <span title="已标注总量">{{ count }}</span>
            /
            <span title="总数据量">{{ total }}</span>
            <el-button text @click="next">{{ langConfig.alice.er.next[lang] }}&gt;</el-button>
          </span>
        </el-col>
        <el-col :span="10" style="margin-top: 10px;">
          <el-tag class="m1-2" effect="plain" size="small" type="success">W:{{ langConfig.alice.er.positive[lang] }}</el-tag>
          <el-tag class="m1-2" effect="plain" size="small" type="danger">S:{{ langConfig.alice.er.negative[lang] }}</el-tag>
          <el-tag class="m1-2" effect="plain" size="small">X:{{ langConfig.alice.er.consult[lang] }}</el-tag>
          <el-tag class="m1-2" effect="plain" size="small" type="info">F:{{ langConfig.alice.er.save[lang] }}</el-tag>
          <el-tag class="m1-2" effect="plain" size="small" type="info">A:{{ langConfig.alice.er.prev[lang] }}</el-tag>
          <el-tag class="m1-2" effect="plain" size="small" type="info">D:{{ langConfig.alice.er.next[lang] }}</el-tag>
        </el-col>
        <el-col :span="2">
          <!-- 质量小助手抽屉 -->
          <Quality v-if="tid" :tid="tid" :role="role" @change-mode="changeMode" :tags-dict="secondTagsDict"></Quality>
        </el-col>
      </el-row>
    </div>
    <!-- 标注信息栏 -->
    <div style="padding: 0 5px 0 5px;">
      <!-- 旧版本 -->
      <div v-if="oldVersion">
        <el-affix v-if="!hiddenTag">
          <TagTree v-if="tags" :initaTags="tags" :tags-dict="tagsDict" mode="anno" class="tree-backgroud"></TagTree>
          <el-divider style="margin: 0;"></el-divider>
        </el-affix>
        <el-row>
          <el-col :span="mode === '批量审阅' ? 4 : 0">
            <ReviewQuery v-if="tid" @choose-one="chooseOne" :inital-tid="tid" :inital-mode="mode" :tags-dict="secondTagsDict" :er-Loading="loading"></ReviewQuery>
          </el-col>
          <!-- 标注模块 -->
          <el-col :span="mode === '批量审阅' ? 18 : 22" :offset="1" style="width: 100%;">
            <div style="text-align: center;" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.1)">
              <Annotation
                v-show="did && tid"
                :inital-anno="annoData"
                :inital-did="initDid"
                :inital-tid="tid"
                :inital-mode="mode"
                :inital-tags="tags"
                :lang="lang"
                :tags-dict="secondTagsDict"
                :check-entities="checkEntities"
                :role="role"
                @update-ann-data="receiveAnnUpdate"
                @add-review-result="addReviewResult"
                @remove-review-result="removeReviewResult"
                @choose-snippet="chooseSnippet"
                @set-element-id="getTrinitySearchElementId"
              ></Annotation>
            </div>
            <el-divider></el-divider>
            <div class="text-conter">
              <el-button v-if="spam == '0'" text @click="spamClick('1')" :title="langConfig.alice.er.spamInfo[lang]">{{ langConfig.alice.er.spam[lang] }}</el-button>
              <el-button v-else size="small" @click="spamClick('0')">{{ langConfig.alice.er.cancelSpam[lang] }}</el-button>
              <el-button v-if="special == '0'" text @click="specialClick('1')" :title="langConfig.alice.er.specialInfo[lang]">{{ langConfig.alice.er.special[lang] }}</el-button>
              <el-button v-else size="small" @click="specialClick('0')">{{ langConfig.alice.er.cancelSpecial[lang] }}</el-button>
              <el-button v-if="timeFlag == '0'" text @click="timeFlagClick('1')" :title="langConfig.alice.er.timeFalgInfo[lang]">{{ langConfig.alice.er.timeFalg[lang] }}</el-button>
              <el-button v-else size="small" @click="timeFlagClick('0')">{{ langConfig.alice.er.cancelTimeFalg[lang] }}</el-button>
            </div>
            <div class="text-conter">
              <Review v-if="mode === '批量审阅'" :review="review" :need-review="needReview" :role="role" @cancel-need-review="cancelReview"></Review>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <grid-layout
          v-if="layout"
          v-model:layout="layout"
          :col-num="12"
          :row-height="30"
          :is-draggable="isDraggable"
          :is-resizable="isDraggable"
          vertical-compact
          use-css-transforms
          @layout-updated="layoutUpdateEvent"
        >
          <grid-item i="tagtree" :x="layout[0].x" :y="layout[0].y" :w="layout[0].w" :h="layout[0].h">
            <el-scrollbar :height="40 * layout[0].h - 30">
              <TagTree v-if="tags" :initaTags="tags" :tags-dict="tagsDict" mode="anno"></TagTree>
            </el-scrollbar>
            <el-divider style="margin: 0;"></el-divider>
          </grid-item>
          <grid-item i="anno" :x="layout[1].x" :y="layout[1].y" :w="layout[1].w" :h="layout[1].h">
            <!-- 标注模块 -->
            <div style="text-align: center;" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.1)">
              <annotation
                v-show="did && tid"
                :inital-anno="annoData"
                :inital-did="initDid"
                :inital-tid="tid"
                :inital-mode="mode"
                :inital-tags="tags"
                :lang="lang"
                :tags-dict="secondTagsDict"
                :check-entities="checkEntities"
                :role="role"
                @update-ann-data="receiveAnnUpdate"
                @add-review-result="addReviewResult"
                @remove-review-result="removeReviewResult"
                @choose-snippet="chooseSnippet"
                @set-element-id="getTrinitySearchElementId"
              ></annotation>
            </div>
            <el-divider></el-divider>
            <div class="text-conter">
              <el-button v-if="spam == '0'" text @click="spamClick('1')" :title="langConfig.alice.er.spamInfo[lang]">{{ langConfig.alice.er.spam[lang] }}</el-button>
              <el-button v-else size="small" @click="spamClick('0')">{{ langConfig.alice.er.cancelSpam[lang] }}</el-button>
              <el-button v-if="special == '0'" text @click="specialClick('1')" :title="langConfig.alice.er.specialInfo[lang]">{{ langConfig.alice.er.special[lang] }}</el-button>
              <el-button v-else size="small" @click="specialClick('0')">{{ langConfig.alice.er.cancelSpecial[lang] }}</el-button>
              <el-button v-if="timeFlag == '0'" text @click="timeFlagClick('1')" :title="langConfig.alice.er.timeFalgInfo[lang]">{{ langConfig.alice.er.timeFalg[lang] }}</el-button>
              <el-button v-else size="small" @click="timeFlagClick('0')">{{ langConfig.alice.er.cancelTimeFalg[lang] }}</el-button>
            </div>
            <div id="review-layout" class="text-conter">
              <Review v-if="mode === '批量审阅'" :review="review" :role="role" :need-review="needReview" @cancel-need-review="cancelReview"></Review>
            </div>
          </grid-item>
          <grid-item v-if="mode === '批量审阅'" i="review" :x="layout[2].x" :y="layout[2].y" :w="layout[2].w" :h="layout[2].h">
            <ReviewQuery @choose-one="chooseOne" :inital-tid="tid" :inital-mode="mode" :tags-dict="secondTagsDict" :er-Loading="loading"></ReviewQuery>
          </grid-item>
        </grid-layout>
      </div>
    </div>
    <!-- 底部信息栏 -->
    <div class="rightPanel">
      <el-button class="handle-button" type="primary" :class="{ 'handle-button-close': !openDrawer }" style="bottom: 30px;" @click="copyText(did)">
        {{ langConfig.alice.er.did[lang] }}:{{ did }}
        <br />
        {{ tagUser }} {{ langConfig.alice.er.modify[lang] }} {{ update }}
      </el-button>
    </div>
    <div v-if="task.project_id">
      <TrinitySearch
        ref="trinitySearchRef"
        :sim-texts="simTexts"
        :content="annoData.content"
        :sim-search="simSearch"
        mode="anno"
        :project-name="task.project_id"
        :tid="tid"
        :top_k="simInfo.top_k"
        :score="simInfo.score"
        :show_k="simInfo.show_k"
        :lang="lang"
        :tags-dict="secondTagsDict"
      ></TrinitySearch>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref, Ref, watch, h, nextTick, reactive } from 'vue'
import Annotation from './components/anno.vue'
import TagTree from './components/tagTree.vue'
import ReviewQuery from './components/reviewQuery.vue'
import Quality from './components/quality.vue'
import Review from './components/review.vue'
import { useRoute, useRouter } from 'vue-router'
import er2Service from './api/er2'
import { logInfo } from '@/utils'
import { useStore } from '@/store/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTagsDict } from '@/utils/tagsDict'
import { langConfig } from '@/utils/constant/config'
import TrinitySearch from './components/trinitySearch.vue'
export default defineComponent({
  name: 'er2',
  el: '#er2',
  components: { Annotation, TagTree, ReviewQuery, Quality, Review, TrinitySearch },
  setup() {
    const task = ref({} as any) // 任务的基本信息
    const tags = ref() // 指标树
    // 监听任务变化
    watch(task, (task) => {
      tags.value = JSON.parse(task.config)
    })
    // 数据的当前位置，已标注总数，总标注数
    const index = ref(0) //当前标注的索引位置，用于上一条
    const count = ref(0) //当前任务用户已标注的总量
    const total = ref(0) //任务的数据总量
    const tid = ref('') // 任务的tid
    const did = ref('') // 任务的did
    // 监听did更新
    watch(did, (did, prevdid) => {
      if (did != prevdid) {
        annotationData.value = null
        if (task.value.project_id) {
          trinitySearchRef.value.didChange = true
          trinitySearchRef.value.visible = false
        }
        getOneTagData()
      }
    })
    // 子组件更新did,判断是否更新数据
    const chooseOne = (value: string) => {
      if (mode.value !== '批量审阅') {
        return
      }
      if (changed.value) {
        saveResult(() => {
          did.value = value
          changed.value = false
        })
        return
      }
      did.value = value
      changed.value = false
    }
    const mode = ref('专一模式') // 批量预标,批量审阅,专一模式
    // 监听模式变化
    const changeMode = (value: string) => {
      if (mode.value != value) {
        if (changed.value) {
          ElMessageBox.confirm(langConfig.alice.er.note[lang.value], langConfig.alice.er.notSave[lang.value], {
            confirmButtonText: langConfig.alice.er.doNotSave[lang.value],
            cancelButtonText: langConfig.alice.er.cancel[lang.value],
            type: 'warning'
          }).then(() => {
            mode.value = value
            initLayout()
          })
        } else {
          mode.value = value
          initLayout()
        }
      }
    }
    watch(mode, (mode, prevmode) => {
      const url = router.resolve({ name: 'er2', params: { tid: tid.value }, query: { mode: mode } })
      window.location.href = url.href
      if (mode != prevmode) {
        initLayout()
        if (mode === '专一模式') {
          next()
        } else {
          if (route.query.did) {
            did.value = route.query.did.toString()
          } else {
            did.value = ''
          }
          changed.value = false
        }
      }
    })
    //隐藏标签
    const hiddenTag = ref(false)
    const checkEntities = ref(true) // 判断是否检查重复标注
    const spam = ref('0') // 灌水记录
    const special = ref('0') // 特殊，奇葩，奇怪数据，用于记录
    const timeFlag = ref('0') //插眼数据
    const route = useRoute()
    const router = useRouter()
    // 初始化，页面初始时判断url中是否传递参数
    const init = async (callback: (() => void) | undefined) => {
      tid.value = route.params.tid.toString()
      await checkRole()
      await getTask()
      if (route.query.mode) {
        mode.value = route.query.mode.toString()
      }
      if (!role.value) {
        await getCountReview()
      }
      if (route.query.index) {
        if (route.query.index.toString() === '1') {
          index.value = -1
        } else {
          index.value = parseInt(route.query.index.toString()) - 1
        }
      }
      if (route.query.did) {
        mode.value = '批量审阅'
        did.value = route.query.did.toString()
      }
      if (callback) {
        callback()
      } else {
        getNextOne()
      }
    }
    // 获取任务的相关信息
    const tagsDict = ref({} as any) // 中英词典对照表
    const secondTagsDict = ref({} as any) // 二级指标中英词典对照表
    const getTask = async () => {
      const res = await er2Service.getOneTask(tid.value)
      task.value = res.data
      if (!res.data.project_id) {
        simSearch.value = false
      }
      tags.value = JSON.parse(res.data.config)
      // 配置中英指标的对应关系，type为业务指标，通常为中文指标，type_en为英文指标
      tagsDict.value = await getTagsDict(JSON.parse(res.data.config))
      for (const key of Object.keys(tagsDict.value)) {
        if (tagsDict.value[key].type === 'second') {
          secondTagsDict.value[key] = tagsDict.value[key]
        }
      }
      logInfo('secondTagsDict', secondTagsDict.value)
      await nextTick()
    }
    // 标注数据
    interface entitesFace {
      tag: string
      text: string
      begin: Number
      end: Number
      id: Number
    }
    interface relationsFace {
      type: string
      aspect: string
      sentiment: string
    }
    interface annoFace {
      content: string
      entities: Array<entitesFace>
      relations: Array<relationsFace>
    }
    const annoData: annoFace = reactive({ content: '', entities: [], relations: [] })
    const tagUser = ref('') // 标注数据用户
    const update = ref() // 数据更新时间a
    const initDid = ref('') // 通知标注模块更新did，因为请求tagdata需要时间
    const review = ref([] as any) // 审阅意见信息
    const needReview = ref('0')
    // 获取一条标注数据
    const getOneTagData = async () => {
      if (did.value && tid.value) {
        loading.value = true
        const tag_res = await er2Service.getOneTag(tid.value, { did: did.value })
        annoData.content = tag_res.data.content
        annoData.entities = tag_res.data.entities
        review.value = tag_res.data.review
        annoData.entities.forEach((e: any) => {
          e.tag = secondTagsDict.value[e.tag] ? secondTagsDict.value[e.tag][lang.value] : e.tag
          if (!e.tag) {
            ElMessage.error('')
          }
        })
        review.value.forEach((e: any) => {
          e.target.tag = secondTagsDict.value[e.target.tag] ? secondTagsDict.value[e.target.tag][lang.value] : e.target.tag
        })
        annoData.relations = tag_res.data.relations
        spam.value = tag_res.data.spam
        special.value = tag_res.data.special
        timeFlag.value = tag_res.data.time_flag
        needReview.value = tag_res.data.need_review
        tagUser.value = tag_res.data.tag_user
        initDid.value = did.value
        if (Object.prototype.hasOwnProperty.call(tag_res.data, 'update')) {
          update.value = new Date(parseInt(tag_res.data.update.substring(0, 8), 16) * 1000).toLocaleString()
        } else {
          update.value = new Date().toLocaleString()
        }
        loading.value = false
      }
    }
    // 保存标注数据
    const annotationData = ref(null as any) //当前标注模块中的数据
    // 保存当前结果
    const saveResult = async (callback: (() => void) | undefined) => {
      await nextTick()
      // 如果标注模块中不存在数据，则默认保存
      const value = JSON.parse(JSON.stringify(annoData))
      const data = annotationData.value || {
        did: did.value,
        entities: value.entities.map((e: any) => {
          return { begin: e.begin, end: e.end, id: e.id, tag: e.tag, text: e.text }
        }),
        relations: value.relations
      }
      // 将标注的数据转为对应的type
      if (data.entities.length > 0) {
        for (let i = 0; i < data.entities.length; i++) {
          const tag = getTagAnnotationType(data.entities[i].tag)
          // data.entities[i].tag = getTagType(data.entities[i].tag)
          data.entities[i].tag = tag.type
          if (Object.prototype.hasOwnProperty.call(tag, 'annotation_type')) {
            data.entities[i].annotation_type = tag.annotation_type
          }
        }
      } else {
        ElMessage.info(langConfig.alice.er.saveNullData[lang.value])
      }
      logInfo('saveResult', data)
      const res = await er2Service.saveOneTag(tid.value, { mode: mode.value }, data)
      // 同步到相似检索,只有配置了项目的才同步
      if (task.value.project_id) {
        const simData = {
          tid: tid.value,
          project_name: task.value.project_id,
          texts: data.entities.map((e: any) => e.text),
          ensure_flush: false
        }
        if (simData.texts.length > 0) {
          er2Service.trinityInsertByTexts(simData)
        }
      }
      changed.value = false
      prevAnnData.value = res.data
      if (callback) {
        callback()
      }
    }
    /**将标注的tag转化为type */
    const tagTypeList = ['type', 'type_en', 'type_zh']
    const getTagType = (tag: string) => {
      for (const key in secondTagsDict.value) {
        for (const key2 in secondTagsDict.value[key]) {
          if (tag === secondTagsDict.value[key][key2]) {
            return key
          }
        }
      }
      return tag
    }
    /**获取对应的annotation_type */
    const getTagAnnotationType = (tag: string) => {
      for (let i = 0; i < tags.value.length; i++) {
        const first = tags.value[i]
        for (let j = 0; j < first.child.length; j++) {
          const second = first.child[j]
          for (const key of tagTypeList) {
            if (second[key] === tag) {
              return second
            }
          }
        }
      }
    }
    // 切换上一条
    const prev = () => {
      if (mode.value === '专一模式' && !loading.value) {
        if (changed.value) {
          saveResult(getPrevOne)
        } else if (!loading.value) {
          getPrevOne()
        } else {
          return
        }
      }
    }
    // 获取前一条数据
    const { proxy } = getCurrentInstance() as any
    const getPrevOne = async () => {
      if (mode.value !== '专一模式') {
        return
      } else {
        loading.value = true
        const res = await er2Service.getPrev(tid.value, { index: index.value })
        if (res.data) {
          total.value = res.data.total
          count.value = res.data.count
          index.value = res.data.index
          did.value = res.data.did
          spam.value = '0'
          special.value = '0'
          timeFlag.value = '0'
        } else {
          ElMessage(langConfig.alice.er.notPrev[lang.value])
        }
        loading.value = false
      }
    }
    // 切换下一条
    const next = async () => {
      if (mode.value === '专一模式' && !loading.value) {
        if (changed.value || count.value <= index.value) {
          //save当前的修改
          await saveResult(getNextOne)
        } else if (!loading.value) {
          // 不再loading状态才能下一条
          await getNextOne()
        } else {
          return
        }
      }
    }
    // 获取下一条数据
    const getNextOne = async () => {
      if (mode.value !== '专一模式') {
        return
      }
      loading.value = true
      const res = await er2Service.getNext(tid.value, { index: index.value })
      if (res.data) {
        total.value = res.data.total
        count.value = res.data.count
        index.value = res.data.index
        did.value = res.data.did
        spam.value = '0'
        special.value = '0'
        timeFlag.value = '0'
      } else {
        ElMessage(langConfig.alice.er.notNext[lang.value])
      }
      loading.value = false
    }
    // 设置灌水/插眼/奇怪数据
    const spamClick = async (v: string) => {
      if (tid.value && did.value) {
        const res = await er2Service.setSpam(tid.value, did.value, v)
        if (res.status === 200) {
          spam.value = v
          // changed.value = true
        }
      }
    }
    const specialClick = async (v: string) => {
      if (tid.value && did.value) {
        const res = await er2Service.setSpecial(tid.value, did.value, v)
        if (res.status === 200) {
          special.value = v
          // changed.value = true
        }
      }
    }
    const timeFlagClick = async (v: string) => {
      if (tid.value && did.value) {
        const res = await er2Service.setTimeFlag(tid.value, did.value, v)
        if (res.status === 200) {
          timeFlag.value = v
          // changed.value = true
        }
      }
    }
    const prevAnnData = ref(null as any) // 记录变更前的标注数据
    const changed = ref(false)
    // 更新标注数据
    const receiveAnnUpdate = (data: any, isChanged: boolean) => {
      if (!isChanged) {
        prevAnnData.value = data
      }
      annotationData.value = data
      changed.value = isChanged
    }
    // 更新选中文本，用于复制选中片段或用于相似推荐
    const snippet = ref('')
    const chooseSnippet = async (text: string) => {
      snippet.value = text
      simTexts.value.splice(0, simTexts.value.length, text)
      if (task.value.project_id) {
        trinitySearchRef.value.didChange = false
        trinitySearchRef.value.trinitySearch(simTexts.value)
      }
    }
    // 设置相似推荐位置
    const getTrinitySearchElementId = async (elementId: string | null) => {
      if (elementId) {
        if (task.value.project_id) {
          trinitySearchRef.value.elementId = elementId
        }
      } else {
        if (task.value.project_id) {
          await nextTick()
          const elementsId = document.querySelectorAll('tspan')
          let maxId = 0
          elementsId.forEach((e: any) => {
            const index = Number(e.id.slice(-4))
            if (index > maxId) {
              maxId = index
            }
          })
          trinitySearchRef.value.elementId = `SvgjsTspan${maxId}`
        }
      }
    }
    // 相似推荐查询
    const trinitySearchRef = ref()
    const simTexts = ref<string[]>([])
    const simSearch = ref(true)
    const simInfo = reactive({
      top_k: 20,
      score: 0.8,
      show_k: 5
    })
    // 设置页面快捷键
    document.onkeydown = (e) => {
      if (!(e.target instanceof HTMLBodyElement)) return
      if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
        // 添加、修改等操作
        switch (e.key) {
          case 'a':
            prev()
            proxy.$bus.$emit('prev')
            break
        }
        switch (e.key) {
          case 'A':
            prev()
            proxy.$bus.$emit('prev')
            break
        }
        switch (e.key) {
          case 'd':
            next()
            proxy.$bus.$emit('next')
            break
        }
        switch (e.key) {
          case 'D':
            next()
            proxy.$bus.$emit('next')
            break
        }
        switch (e.key) {
          case 'w':
            proxy.$bus.$emit('positive')
            break
        }
        switch (e.key) {
          case 'W':
            proxy.$bus.$emit('positive')
            break
        }
        switch (e.key) {
          case 's':
            proxy.$bus.$emit('negative')
            break
        }
        switch (e.key) {
          case 'S':
            proxy.$bus.$emit('negative')
            break
        }
        switch (e.key) {
          case 'x':
            proxy.$bus.$emit('consult')
            break
        }
        switch (e.key) {
          case 'X':
            proxy.$bus.$emit('consult')
            break
        }
        switch (e.key) {
          case 'f':
            if (changed.value) {
              saveResult(() => {
                changed.value = false
              })
            }
            break
        }
        switch (e.key) {
          case 'F':
            if (changed.value) {
              saveResult(() => {
                changed.value = false
              })
            }
            break
        }
      }
      if (e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.key) {
          case 'c':
            // 复制选中文本
            copyText(snippet.value)
            e.preventDefault()
            break
        }
        switch (e.key) {
          case 'C':
            // 复制选中文本
            copyText(snippet.value)
            e.preventDefault()
            break
        }
        switch (e.key) {
          case 'a':
            // 复制content文本
            copyText(annoData.content)
            e.preventDefault()
            return
        }
        switch (e.key) {
          case 'A':
            // 复制content文本
            copyText(annoData.content)
            e.preventDefault()
            break
        }
      }
    }
    // 模块自定义移动
    const state = useStore()
    const annLoyout = computed(() => state.getters['settingsModule/getAnnoLayoutState'])
    const reviewLayout = computed(() => state.getters['settingsModule/getReviewLayoutState'])
    const layout = ref()
    const initLayout = () => {
      const data = mode.value === '专一模式' ? JSON.stringify(annLoyout.value) : JSON.stringify(reviewLayout.value)
      layout.value = JSON.parse(data)
      if (hiddenTag.value) {
        layout.value[0].h = 0
      }
    }
    watch(hiddenTag, () => {
      initLayout()
    })
    const isDraggable = computed(() => store.getters['settingsModule/getIsDraggable'])
    const layoutUpdateEvent = (newLayout: any) => {
      if (!hiddenTag.value) {
        if (mode.value === '专一模式') {
          state.dispatch('settingsModule/toSetAnnoLayout', newLayout)
        }
        if (mode.value === '批量审阅') {
          state.dispatch('settingsModule/toSetReviewLayout', newLayout)
        }
      }
    }
    // 当前数据标识，数据id，修改时间
    const openDrawer = ref(false)
    const copyText = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          () => {
            ElMessage.info(langConfig.alice.er.copyIdInfo[lang.value] + text)
          },
          (err: any) => {
            ElMessage.warning(langConfig.alice.er.copyError[lang.value] + ':(' + err)
          }
        )
      } else {
        // 创建text area
        let textArea = document.createElement('textarea')
        textArea.value = text
        // 使text area不在viewport，同时设置不可见
        textArea.style.position = 'absolute'
        textArea.style.opacity = '0'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise<void>((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand('copy') ? res() : rej()
          ElMessage.info(langConfig.alice.er.copyIdInfo[lang.value] + text)
          textArea.remove()
        })
      }
    }
    // 判断用户权限是否满足
    const role = ref(false)
    const checkRole = async () => {
      const roles = localStorage.getItem('role')
      if (roles?.indexOf('superman') != -1 || roles.indexOf('ann_manager') != -1 || roles.indexOf('reviewer_plus') != -1) {
        role.value = true
      }
    }
    // 添加新的审阅意见后更新当前审阅结果
    const addReviewResult = async (reviewData: any) => {
      // 如果当前标注的为英文指标，则转化为中文
      logInfo('reviewData.target.tag', reviewData)
      if (reviewData.target.tag) {
        reviewData.target.tag = getTagType(reviewData.target.tag)
      }
      const res = await er2Service.addReview(tid.value, did.value, reviewData)
      reviewData.rid = res.rid
      reviewData.target.tag = secondTagsDict.value[reviewData.target.tag] ? secondTagsDict.value[reviewData.target.tag][lang.value] : reviewData.target.tag
      review.value.push(reviewData)
    }
    // 删除审阅意见后更新当前审阅结果
    const removeReviewResult = async (value: any) => {
      const res = await er2Service.removeReview(tid.value, did.value, value.rid)
      review.value.splice(value.index, 1)
    }
    const store = useStore()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    // loading 避免前面信息更新不及时
    const loading = ref(false)
    // 旧版本页面，不能自定义位置
    const oldVersion = computed(() => store.getters['settingsModule/getOldVersionState'])
    // 获取需修订数据量
    const total_review = ref(0)
    const yesterday_review = ref(0)
    const getCountReview = async () => {
      const res = await er2Service.countReview(tid.value)
      if (res.data.yesterday_count !== 0) {
        mode.value = '批量审阅'
        total_review.value = res.data.total
        yesterday_review.value = res.data.yesterday_count
        await nextTick()
        setTimeout(open, 200)
      }
    }

    // 需修订数据提示
    const open = () => {
      ElMessageBox.alert(
        h('div', null, [
          h('div', null, `${langConfig.alice.review.reviewMessageBoxInfo1[lang.value]}${total_review.value}`),
          h('div', null, `${langConfig.alice.review.reviewMessageBoxInfo2[lang.value]}${yesterday_review.value}`)
        ]),
        langConfig.alice.review.reviewMessageBoxTitle[lang.value],
        {
          confirmButtonText: langConfig.alice.review.reviewMessageBoxConfire[lang.value],
          callback: () => {
            // mode.value = '批量审阅'
            const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toJSON().split('T')[0].substring(0, 19)
            const filter = { user: localStorage.getItem('username'), filter_review: '未修订数据', start: yesterday, end: yesterday }
            proxy.$bus.$emit('search-review', filter)
          }
        }
      )
    }
    /**
     * 修正需修订状态
     */
    const cancelReview = async () => {
      const res = await er2Service.cancelReview(tid.value, did.value)
      if (res.status === 200) {
        needReview.value = '0'
      }
    }
    onMounted(async () => {
      await init(undefined)
      initLayout()
      if (did.value) {
        getOneTagData()
      }
    })

    onBeforeUnmount(() => {
      proxy.$bus.$off('select-tag')
      proxy.$bus.$off('positive')
      proxy.$bus.$off('negative')
      proxy.$bus.$off('next')
      proxy.$bus.$off('prev')
    })
    return {
      task,
      index,
      total,
      count,
      did,
      initDid,
      tid,
      tags,
      mode,
      hiddenTag,
      checkEntities,
      tagUser,
      update,
      annoData,
      spamClick,
      specialClick,
      timeFlagClick,
      spam,
      special,
      timeFlag,
      prev,
      next,
      receiveAnnUpdate,
      layout,
      isDraggable,
      layoutUpdateEvent,
      chooseOne,
      changeMode,
      openDrawer,
      copyText,
      role,
      review,
      lang,
      tagsDict,
      langConfig,
      addReviewResult,
      removeReviewResult,
      loading,
      chooseSnippet,
      oldVersion,
      needReview,
      cancelReview,
      simTexts,
      simSearch,
      simInfo,
      trinitySearchRef,
      getTrinitySearchElementId,
      secondTagsDict
    }
  }
})
</script>
<style lang="scss">
@import '@/styles/variables.scss';
.m1-2 {
  margin: 0px 0 12px 10px;
  cursor: default;
}
.text-conter {
  text-align: center !important;
}
svg > text tspan {
  font-size: 28px;
}
.query {
  margin-top: 10px;
}
.tag-setting {
  text-align: right;
}
.tag-list {
  max-height: 300;
}
.top-navbar {
  margin: 12px 0 0 12px;
}
.rightDrawer .slot-body {
  padding: 20px;
}
.rightPanel {
  width: 100%;
  max-width: 350px;
  height: 100vh;
  position: fixed;
  padding: 24px;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 2000;

  .handle-button {
    width: 320px;
    height: 48px;
    position: absolute;
    left: -320px;
    text-align: left;
    border-radius: 6px 0 0 6px !important;
    z-index: 0;
    pointer-events: auto;
    cursor: pointer;
    color: #fff;
    display: flex;
    flex-direction: row;
  }
  .handle-button-close {
    left: -8px;
    &:hover {
      left: -320px;
    }
  }
}
.review {
  text-align: center !important;
}
.tree-backgroud {
  background: $backgroundColor;
}
.anno-layout {
  padding: 0 10px 0 15px;
}
</style>
