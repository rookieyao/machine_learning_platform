<style>
.main-tag {
  padding: 20px 5px 20px 5px;
}

.anno-title > * {
  margin-left: 10px;
}

.anno-page {
  text-align: center;
  width: 40%;
}

.el-pagination {
  text-align: center;
}

.el-checkbox__label {
  display: inline-grid;
  width: 100%;
  white-space: pre-line;
  word-wrap: break-word;
  line-height: 20px;
}

.anno-el-checkbox {
  height: inherit;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.box-anno {
  /* display: flex; */
  align-items: left;
  /* justify-content: space-around; */
  /* position: relative; */
  height: 100%;
  width: 100%;
  padding: 10px 20px 20px 20px;
}
.box-anno > .mask {
  position: absolute;
  background: #409eff;
  opacity: 0.4;
  z-index: 100;
}
</style>

<template>
  <div>
    <div class="main-tag">
      <h4 v-if="task" style="padding-bottom: 10px;">
        <span @click="cleanCacheVisble = !cleanCacheVisble">{{ task.name }}</span>
        <el-button v-if="cleanCacheVisble" text @click="cleanCache">{{ langConfig.scene.er.cleanCache[lang] }}</el-button>
      </h4>
      <TagTree v-if="task" :inita-tags="tags" :tags-dict="tagsDict" mode="scene" @add-secen-tag="addTagClick" @change-tag="changeTag" />
    </div>
    <el-row :gutter="50">
      <el-col :span="6" id="filter-query">
        <FilterQuery v-if="task" :tags="tags" :tags-dict="tagsDict" @search="search" />
        <el-divider></el-divider>
        <div>
          <el-form>
            <el-form-item :label="langConfig.scene.er.typingNewPieces[lang]">
              <el-input v-model="addSnippetText" size="small" :placeholder="langConfig.scene.er.typeHere[lang]" style="width: 60%;"></el-input>
            </el-form-item>
            <el-form-item :label="langConfig.scene.er.typeTag[lang]">
              <el-cascader
                size="small"
                v-model="addSnippetTag"
                :options="tags"
                :props="props"
                filterable
                clearable
                :placeholder="langConfig.scene.er.typeTagPlaceholder[lang]"
                @change="cascaderChange"
              >
                <template #default="{node,data}">
                  <span v-if="!node.isLeaf || node.pathValues.length === 1">{{ tagsDict[data.type][lang] }}</span>
                  <span v-else>{{ tagsDict[`${node.pathValues[0]}_${node.pathValues[1]}`][lang] }}</span>
                </template>
              </el-cascader>
              <el-button size="small" style="margin-left: 10px;" @click="addSnippetClick">{{ langConfig.scene.er.add[lang] }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <template v-if="checkBoxMoveData">
          <el-divider></el-divider>
          <el-space direction="vertical" alignment="left" style="padding: 10px 20px;">
            <span>{{ checkBoxMoveData.snippet }}</span>
            <div v-for="tag in checkBoxMoveData.tags.filter((e: any) => e.versions.indexOf(task.version) !== -1)">
              <el-tag style="margin-right: 10px;">{{ tag.scene }}</el-tag>
              <el-tag>{{ tagsDict[`${tag.scene}_${tag.tag}`][lang] }}</el-tag>
            </div>
          </el-space>
        </template>
      </el-col>
      <el-col :span="17" id="anno">
        <div class="anno-title">
          <span>{{ langConfig.scene.er.queryCount[lang](snippetCount) }}</span>
          <span>{{ langConfig.scene.er.selectTag[lang] }}:</span>
          <el-tag size="small" v-if="selectTag.scene">{{ tagsDict[selectTag.scene][lang] }}</el-tag>
          <el-tag size="small" v-if="selectTag.tag">{{ tagsDict[`${selectTag.scene}_${selectTag.tag}`][lang] }}</el-tag>
          <el-button size="small" text v-if="selectTag.tag" @click="cleanSelectTag">
            <el-icon>
              <CircleClose></CircleClose>
            </el-icon>
          </el-button>
        </div>
        <div class="anno-checkbox">
          <el-checkbox size="small" v-model="checkAll" :disabled="!selectTag.tag" :indeterminate="isInIndeterminate" @change="handelCheckAllChange">
            {{ `${langConfig.scene.er.selectAll[lang]}(${allSnippets.length})` }}
          </el-checkbox>
          <div class="box-anno" @mousedown="handelMouseDown">
            <div class="mask" v-show="positionList.is_show_mask" :style="'width:' + mask_width + 'left:' + mask_left + 'height:' + mask_height + 'top:' + mask_top"></div>
            <el-checkbox-group v-model="checkedSnippet">
              <el-space direction="vertical" alignment="right" :wrap="true" :style="{ width: 100 + '%', 'padding-bottom': 0, 'max-height': (isEn ? 1200 : 800) + 'px' }">
                <el-checkbox
                  class="anno-el-checkbox"
                  v-for="(snippet, i) in allSnippets"
                  :disabled="!selectTag.tag"
                  :label="snippet.snippet"
                  :style="getMaxWidth()"
                  @mousemove="checkBoxMove(snippet.snippet)"
                >
                  {{ snippet.snippet }}
                </el-checkbox>
              </el-space>
            </el-checkbox-group>
          </div>
        </div>
        <div class="anno-page">
          <el-pagination v-model:current-page="page" :page-count="pageCount" layout="prev,pager,next"></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog v-model="addTagData.addTagVisible" width="30%" :title="langConfig.alice.tagTree.addNewTag[lang]">
      <template #default>
        <el-form ref="formRef" label-width="150px" :model="addTagData">
          <el-form-item
            :label="langConfig.alice.tagTree.addScene[lang]"
            prop="scene.type"
            :rules="{
              required: true,
              message: 'Tag 1 is required.',
              trigger: 'blur'
            }"
          >
            <el-select v-model="addTagData.scene.type" filterable allow-create default-first-option @change="addSceneChange">
              <el-option v-for="scene in tags.map((e:any) => e.type)" :key="scene" :value="scene" :label="scene"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="langConfig.scene.er.addSceneZh[lang]">
            <el-input v-model="addTagData.scene.type_zh" :disabled="addTagData.newSceneDisable" :placeholder="langConfig.scene.er.addTagPlaceholder[lang]"></el-input>
          </el-form-item>
          <el-form-item :label="langConfig.scene.er.addSceneEn[lang]">
            <el-input v-model="addTagData.scene.type_en" :disabled="addTagData.newSceneDisable" :placeholder="langConfig.scene.er.addTagPlaceholder[lang]"></el-input>
          </el-form-item>
          <el-form-item
            prop="tag.type"
            :label="langConfig.scene.er.addTag[lang]"
            :rules="{
              required: true,
              message: 'Tag 2 is required.',
              trigger: 'blur'
            }"
          >
            <el-input v-model="addTagData.tag.type" :placeholder="langConfig.scene.er.addTagPlaceholder[lang]"></el-input>
          </el-form-item>
          <el-form-item :label="langConfig.scene.er.addTagZh[lang]">
            <el-input v-model="addTagData.tag.type_zh" :placeholder="langConfig.scene.er.addTagPlaceholder[lang]"></el-input>
          </el-form-item>
          <el-form-item :label="langConfig.scene.er.addTagEn[lang]">
            <el-input v-model="addTagData.tag.type_en" :placeholder="langConfig.scene.er.addTagPlaceholder[lang]"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button @click="addTagData.addTagVisible = false">{{ langConfig.scene.er.cancel[lang] }}</el-button>
        <el-button @click="addScene">{{ langConfig.scene.er.confirm[lang] }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import SceneMiningServer from './api/sceneMining'
import TagTree from '@/views/Tag/components/tagTree.vue'
import { getSceneTagDict } from '@/utils/tagsDict'
import { logInfo } from '@/utils'
import FilterQuery from './components/filterQuery.vue'
import { ElMessage, FormInstance } from 'element-plus'
import { langConfig } from '@/utils/constant/config'
import { useStore } from '@/store'
const store = useStore()
const lang = computed(() => store.getters['settingsModule/getLangState'])
const route = useRoute()
const task = ref()
const tags = ref()
const tid = ref('')
/**
 * 初始化
 */
const isEn = ref(false)
const init = async () => {
  tid.value = route.params.tid.toString()
  const res = await SceneMiningServer.getStates({ tid: tid.value })
  tagsDict.value = getSceneTagDict(res.data.config, lang.value)
  tags.value = res.data.config
  task.value = res.data
  if (task.value.name.match(/_en$/g)) {
    isEn.value = true
  }
}
/**
 * 获取checkbox宽度
 */
const getMaxWidth = () => {
  const maxWidth = document.querySelector('.anno-checkbox')!.clientWidth
  if (allSnippets.value.length > 30) {
    return { 'max-width': Math.ceil(maxWidth / 4) + 'px' }
  } else {
    return
  }
}
/**
 * 中英文对应
 */
const tagsDict = ref({} as any)
/**
 * 指标树点击标签
 */
interface SceneTag {
  scene?: string
  tag?: string
}
const selectTag: SceneTag = reactive({
  scene: undefined,
  tag: undefined
})
const changeTag = (value: any) => {
  selectTag.scene = value.scene
  selectTag.tag = value.tag
  checkAll.value = false
  checkedSnippet.value = allSnippets.value
    .filter((e: any) => {
      for (let i = 0; i < e.tags.length; i++) {
        const element = e.tags[i]
        if (element.scene === selectTag.scene && element.tag === selectTag.tag && element.versions.find((e: string) => e === task.value.version)) {
          return e
        }
      }
    })
    .map((e: any) => {
      return e.snippet
    })
  handleCheckSnippetChange(checkedSnippet.value)
}
/**
 * 清空选中标签
 */
const cleanSelectTag = () => {
  selectTag.scene = undefined
  selectTag.tag = undefined
  checkedSnippet.value = []
  checkAll.value = false
  isInIndeterminate.value = false
}

/**
 * 点击查询操作
 */
const page = ref(1)
watch(page, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    getSnippetData()
  }
})
const snippetCount = ref(0)
const cid = ref('')
const search = (q: any, mode: string) => {
  // 点击查询后更新最后一条id和第一条id,并重置cid为空
  query.value.similar = q.similar ?? undefined
  query.value.tag = q.tag ?? undefined
  query.value.words = q.words ?? undefined
  query.value.mode = mode
  cid.value = ''
  selectTag.scene = Boolean(q.similar.scene) ? q.similar.scene : Boolean(q.tag.scene) ? q.tag.scene : undefined
  selectTag.tag = Boolean(q.similar.tag) ? q.similar.tag : Boolean(q.tag.scene) ? q.tag.tag : undefined
  // index归零
  page.value = 1
  getSnippetData()
}
/**
 * 下一页,用于快捷键
 */
const getNext = () => {
  // 如果snippetIndex 等于 snippetCount 则没有下一页了
  if (page.value >= pageCount.value) {
    ElMessage.info(langConfig.scene.er.isLastPage[lang.value])
    return
  }
  page.value += 1
}
/**
 * 上一页，用于快捷键
 */
const getPrev = () => {
  // 如果当前index - 100 小于 0 表示没有前一页了
  if (page.value <= 1) {
    ElMessage.info(langConfig.scene.er.isFirstPage[lang.value])
    return
  }
  page.value -= 1
}
/**
 * 获取查询结果
 */
const allSnippets = ref([] as any)
const getSnippetData = async () => {
  let q = getFilter()
  q.page = page.value
  // 清空当前选中框
  checkedSnippet.value = []
  checkAll.value = false
  // 获取当前页的结果
  const res = await SceneMiningServer.next(q)
  cid.value = res.data.cid
  allSnippets.value = res.data.snippets
  changeTag(selectTag)
  snippetCount.value = res.data.count
}
/**
 * 构建查询条件
 */
const query = ref({} as any)
const getFilter = () => {
  let q = { tid: tid.value, version: task.value.version, mode: query.value.mode, cid: cid.value } as any
  if (query.value.similar && query.value.similar.tag) {
    q.similar = query.value.similar
  }
  if (query.value.tag && query.value.tag.tag) {
    q.tag = query.value.tag
  }
  if (query.value.words && query.value.words.length !== 0) {
    q.words = query.value.words
  }
  return q
}
const pageCount = ref(1)
/**
 * 监听snippet总数，更新总页数
 */
watch(snippetCount, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (newValue > 0) {
      pageCount.value = Math.ceil(newValue / 100)
    }
  }
})
// 所有的snippet
const checkAll = ref(false)
const isInIndeterminate = ref(false)
const checkedSnippet = ref<string[]>([])
const { proxy } = getCurrentInstance() as any
/**
 * 全选操作
 */
const handelCheckAllChange = async (val: boolean) => {
  const all_snippet = allSnippets.value.map((e: any) => e.snippet)
  checkedSnippet.value = val ? all_snippet : []
  isInIndeterminate.value = false
  handleCheckSnippetChange(checkedSnippet.value)
  if (val) {
    //新增标签结果
    const data = { tid: tid.value, texts: checkedSnippet.value, scene: selectTag.scene, tag: selectTag.tag }
    await SceneMiningServer.addTag(data)
  } else {
    // logInfo('checkedSnippet.value', checkedSnippet.value)
    const modify_snippet = all_snippet.filter((v: string) => !checkedSnippet.value.some((item: string) => item === v))
    const data = { tid: tid.value, texts: modify_snippet, scene: selectTag.scene, tag: selectTag.tag }
    await SceneMiningServer.delTag(data)
  }
}
const handleCheckSnippetChange = (value: string[]) => {
  const checkCount = value.length
  checkAll.value = checkCount === allSnippets.value.length
  isInIndeterminate.value = checkCount > 0 && checkCount < allSnippets.value.length
}
/**
 * 单个tag更新
 */
// const handelCheckBoxChange = async (value: boolean, snippet: string, index: number) => {
//   if (!selectTag.tag) {
//     ElMessage.warning('请选择标注的标签')
//     return
//   }
//   if (value) {
//     await SceneMiningServer.addTag({ tid: tid.value, texts: [snippet], scene: selectTag.scene, tag: selectTag.tag })
//     allSnippets.value[index].tags.push({ scene: selectTag.scene, tag: selectTag.tag, versions: [task.value.version] })
//   } else {
//     await SceneMiningServer.delTag({ tid: tid.value, texts: [snippet], scene: selectTag.scene, tag: selectTag.tag })
//     const del_tag_index = allSnippets.value[index].tags.findIndex(
//       (element: any) => element.scene === selectTag.scene && element.tag === selectTag.tag && element.versions.find((e: string) => e === task.value.version)
//     )
//     allSnippets.value[index].tags.splice(del_tag_index, 1)
//   }
// }
// 设置页面快捷键
document.onkeydown = (e) => {
  if (!(e.target instanceof HTMLBodyElement)) return
  if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
    // 添加、修改等操作
    switch (e.key) {
      case 'a':
        getPrev()
        break
      case 'A':
        getPrev()
        break
      case 'd':
        getNext()
        break
      case 'D':
        getNext()
        break
      case 'w':
        // 全选
        if (selectTag.tag) {
          checkAll.value = !checkAll.value
          handelCheckAllChange(checkAll.value)
        } else {
          ElMessage.warning(langConfig.scene.er.isFirstPage[lang.value])
        }
        break
      case 'W':
        // 全选
        if (selectTag.tag) {
          checkAll.value = !checkAll.value
          handelCheckAllChange(checkAll.value)
        } else {
          ElMessage.warning(langConfig.scene.er.isFirstPage[lang.value])
        }
        break
    }
  }
  if (e.ctrlKey) {
    handelCtrlKeyDown()
  }
}
/**
 * 获取snippet对应的数据
 */
const checkBoxMoveData = ref()
const checkBoxMove = (snippet: string) => {
  checkBoxMoveData.value = allSnippets.value.filter((e: any) => e.snippet === snippet)[0]
}
// 按住ctrl键快速选中当前片段编辑
const addSnippetText = ref('')
const handelCtrlKeyDown = () => {
  if (checkBoxMoveData.value) {
    addSnippetText.value = checkBoxMoveData.value.snippet
  }
}
// 手动新增片段和标注
const addSnippetTag = ref<Array<string>[]>([])
const props = {
  multiple: true,
  label: 'type',
  value: 'type',
  children: 'child',
  expandTrigger: 'hover'
}
/**切换指标 */
const cascaderChange = (value: any) => {
  addSnippetTag.value = addSnippetTag.value.filter((e: any) => e.length === 2)
}
const addSnippetClick = async () => {
  if (!addSnippetText.value || addSnippetTag.value.length === 0) {
    ElMessage.warning(langConfig.scene.er.addSnippetErrorTip[lang.value])
    return
  }
  const res = await SceneMiningServer.snippetAdd({ tid: tid.value, snippet: addSnippetText.value, tags: addSnippetTag.value })
  if (res.status === 200) {
    ElMessage.success(langConfig.scene.er.addSnippetSuccess[lang.value])
    addSnippetText.value = ''
  }
}
/**
 * 清除缓存
 */
const cleanCacheVisble = ref(false)
const cleanCache = async () => {
  const res = await SceneMiningServer.cleanCacheTag()
  if (res.status === 200) {
    ElMessage.success(langConfig.scene.er.cleanCacheSucdess[lang.value])
  }
}
/**鼠标滑动多选 */
const positionList = reactive({
  is_show_mask: false,
  box_screen_left: -35,
  box_screen_top: 0,
  start_x: 0,
  start_y: 0,
  end_x: 0,
  end_y: 0
})
//分别计算遮罩层的位置，大小
const mask_width = computed(() => {
  return `${Math.abs(positionList.end_x - positionList.start_x)}px;`
})
const mask_height = computed(() => {
  return `${Math.abs(positionList.end_y - positionList.start_y)}px;`
})
const mask_left = computed(() => {
  return `${Math.min(positionList.start_x, positionList.end_x) - positionList.box_screen_left}px;`
})
const mask_top = computed(() => {
  return `${Math.min(positionList.start_y, positionList.end_y) - positionList.box_screen_top}px;`
})
//单击多选框选中
const checkItem = async (val: any, item: any) => {
  let i = checkedSnippet.value.indexOf(item) // 判断选中列表中是否包含这个点击的div
  if (i < 0) {
    checkedSnippet.value.push(item) // 如果不包含就加进去
    await SceneMiningServer.addTag({ tid: tid.value, texts: [item], scene: selectTag.scene, tag: selectTag.tag })
  } else {
    checkedSnippet.value.splice(i, 1) // 如果包含就删
    await SceneMiningServer.delTag({ tid: tid.value, texts: [item], scene: selectTag.scene, tag: selectTag.tag })
  }
  handleCheckSnippetChange(checkedSnippet.value)
}
/**获取指标树的height */
const getTagTreeHeight = () => {
  const element = document.querySelector('.main-tag')
  return element!.clientHeight
}
const handelMouseDown = (event: any) => {
  const y = getTagTreeHeight()
  const scrollTop = document.documentElement.scrollTop
  positionList.is_show_mask = true
  positionList.start_x = event.clientX
  positionList.start_y = event.clientY - y + scrollTop
  positionList.end_x = event.clientX
  positionList.end_y = event.clientY - y + scrollTop
  document.body.addEventListener('mousemove', handleMouseMove) //监听鼠标移动事件
  document.body.addEventListener('mouseup', handleMouseUp) //监听鼠标抬起事件
}
function handleMouseMove(event: any) {
  const y = getTagTreeHeight()
  const scrollTop = document.documentElement.scrollTop
  positionList.end_x = event.clientX
  positionList.end_y = event.clientY - y + scrollTop
}
function handleMouseUp() {
  document.body.removeEventListener('mousemove', handleMouseMove)
  document.body.removeEventListener('mouseup', handleMouseUp)
  positionList.is_show_mask = false
  handleDomSelect()
  resSetXY()
}
async function handleDomSelect() {
  const dom_mask = window.document.querySelector('.mask')
  //getClientRects()每一个盒子的边界矩形的矩形集合
  const rect_select = dom_mask?.getClientRects()[0]
  const add_list = [] as any
  const del_list = [] as any
  const chechedSnippetData = checkedSnippet.value.slice()
  if (selectTag.tag) {
    document.querySelectorAll('.el-checkbox-group .el-checkbox').forEach((node, index) => {
      const rects = node.getClientRects()[0]
      if (collide(rects, rect_select) === true) {
        if (checkedSnippet.value.includes(allSnippets.value[index].snippet)) {
          del_list.push(allSnippets.value[index].snippet)
        } else {
          add_list.push(allSnippets.value[index].snippet)
        }
      }
    })
  }
  if (add_list.length > 0) {
    await SceneMiningServer.addTag({ tid: tid.value, texts: add_list, scene: selectTag.scene, tag: selectTag.tag })
  }
  if (del_list.length > 0) {
    await SceneMiningServer.delTag({ tid: tid.value, texts: del_list, scene: selectTag.scene, tag: selectTag.tag })
  }
  checkedSnippet.value = chechedSnippetData.filter((item) => !del_list.includes(item)).concat(add_list)
  handleCheckSnippetChange(checkedSnippet.value)
}
//比较checkbox盒子边界和遮罩层边界最大最小值
function collide(rect1: any, rect2: any) {
  const maxX = Math.max(rect1.x + rect1.width, rect2.x + rect2.width)
  const maxY = Math.max(rect1.y + rect1.height, rect2.y + rect2.height)
  const minX = Math.min(rect1.x, rect2.x)
  const minY = Math.min(rect1.y, rect2.y)
  return maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height
}

//清除
function resSetXY() {
  positionList.start_x = 0
  positionList.start_y = 0
  positionList.end_x = 0
  positionList.end_y = 0
}

/**添加新场景标签 */
const formRef = ref<FormInstance>()
const addTagData = reactive<{
  addTagVisible: Boolean
  newSceneDisable: Boolean
  scene: TagItem
  tag: TagItem
}>({
  addTagVisible: false,
  newSceneDisable: false,
  scene: {
    type: '',
    type_zh: '',
    type_en: ''
  },
  tag: {
    type: '',
    type_zh: '',
    type_en: ''
  }
})
interface TagItem {
  type: string
  type_zh: string
  type_en: string
}
const addTagClick = async (scene: string) => {
  addTagData.addTagVisible = true
  await nextTick()
  addTagData.scene.type = scene
  addSceneChange(scene)
}
/**切换场景标签 */
const addSceneChange = (value: string) => {
  addTagData.newSceneDisable = false
  addTagData.scene.type_zh = ''
  addTagData.scene.type_en = ''
  addTagData.tag.type = ''
  addTagData.tag.type_zh = ''
  addTagData.tag.type_en = ''
  const scene = tags.value.find((e: any) => e.type === value)
  if (scene) {
    addTagData.newSceneDisable = true
    addTagData.scene.type_zh = scene.type_zh ?? ''
    addTagData.scene.type_en = scene.type_en ?? ''
  }
}
/**
 * 添加标签
 */
const addScene = async () => {
  const data = {
    tid: tid.value,
    scene: addTagData.scene,
    tag: addTagData.tag
  }
  const res = await SceneMiningServer.addSceneTag(data)
  if (res.status === 200) {
    ElMessage.success(langConfig.scene.er.addTagSuccessTip[lang.value])
    tags.value = res.data
    tagsDict.value = getSceneTagDict(tags.value)
  }
}
onMounted(() => {
  init()
  proxy.$bus.$on('add-secen-tag')
})
onBeforeUnmount(() => {
  proxy.$bus.off('add-secen-tag')
})
</script>
