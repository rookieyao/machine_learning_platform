<style scoped>
.el-form-item {
  margin-bottom: 5px;
}
.el-divider--horizontal {
  margin: 5px;
}
.filter-form-input {
  width: 100%;
}
.filter-form-div {
  width: 100%;
}
</style>

<template>
  <div>
    <el-form ref="filterFormRes" :v-model="filterQuery" label-width="120px">
      <el-form-item :label="langConfig.scene.er.similarityScene[lang]">
        <el-select size="small" v-model="filterQuery.similar.scene" clearable>
          <el-option v-for="scene in scenes" :key="scene" :label="tagsDict[scene][lang]" :value="scene"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="langConfig.scene.er.similarityTag[lang]">
        <el-select size="small" v-model="filterQuery.similar.tag" clearable>
          <el-option v-for="tag in similarTag" :key="tag" :label="tagsDict[`${filterQuery.similar.scene}_${tag}`][lang]" :value="tag"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="langConfig.scene.er.similarityRange[lang]">
        <el-select size="small" v-model="filterQuery.similar.min_value" allow-create filterable default-first-option clearable style="width: 40%;">
          <el-option value="1" label="1.0"></el-option>
          <el-option value="0.9" label="0.9"></el-option>
          <el-option value="0.8" label="0.8"></el-option>
          <el-option value="0.7" label="0.7"></el-option>
          <el-option value="0.6" label="0.6"></el-option>
          <el-option value="0.5" label="0.5"></el-option>
        </el-select>
        <span>-</span>
        <el-select size="small" v-model="filterQuery.similar.max_value" allow-create filterable default-first-option clearable style="width: 40%;">
          <el-option value="1" label="1.0"></el-option>
          <el-option value="0.9" label="0.9"></el-option>
          <el-option value="0.8" label="0.8"></el-option>
          <el-option value="0.7" label="0.7"></el-option>
          <el-option value="0.6" label="0.6"></el-option>
          <el-option value="0.5" label="0.5"></el-option>
        </el-select>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item :label="langConfig.scene.er.selectedScene[lang]">
        <el-select size="small" v-model="filterQuery.tag.scene" clearable>
          <el-option v-for="scene in scenes" :key="scene" :label="tagsDict[scene][lang]" :value="scene"></el-option>
        </el-select>
        <el-checkbox style="margin-left: 10px;" v-model="rightClickType">{{ langConfig.scene.er.rightSelectTag[lang] }}</el-checkbox>
      </el-form-item>
      <el-form-item :label="langConfig.scene.er.selectedTag[lang]">
        <el-select size="small" v-model="filterQuery.tag.tag" clearable>
          <el-option v-for="tag in tagTag" :key="tag" :label="tagsDict[`${filterQuery.tag.scene}_${tag}`][lang]" :value="tag"></el-option>
        </el-select>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item :label="langConfig.scene.er.keywords[lang]">
        <el-space>
          <el-tooltip effect="dark" :hide-after="0" :content="langConfig.scene.er.beginsWith[lang]">
            <el-checkbox size="small" v-model="isBegin" :disabled="beginDisble" border>^</el-checkbox>
          </el-tooltip>
          <el-tooltip effect="dark" :hide-after="0" :content="langConfig.scene.er.notInclude[lang]">
            <el-checkbox size="small" v-model="isNot" border>！</el-checkbox>
          </el-tooltip>
          <el-tooltip effect="dark" :hide-after="0" :content="langConfig.scene.er.or[lang]">
            <el-checkbox size="small" v-model="isOr" :disabled="endDisble" border>|</el-checkbox>
          </el-tooltip>
          <el-input size="small" class="filter-form-input" v-model="word" :placeholder="langConfig.scene.er.inputKeywords[lang]" clearable @change="addFilterWord"></el-input>
          <el-tooltip effect="dark" :hide-after="0" :content="langConfig.scene.er.endsWith[lang]">
            <el-checkbox size="small" v-model="isEnd" :disabled="endDisble" border>$</el-checkbox>
          </el-tooltip>
        </el-space>
        <span>{{ langConfig.scene.er.queryTip[lang] }}</span>
      </el-form-item>
      <el-form-item>
        <el-button size="small" class="filter-form-button" @click="search('')">{{ langConfig.scene.er.query[lang] }}</el-button>
        <el-button size="small" class="filter-form-button" @click="search('reverses')">{{ langConfig.scene.er.reverseQuery[lang] }}</el-button>
        <el-button size="small" class="filter-form-button" @click="deleteAllWords()">{{ langConfig.scene.er.emptyAllKeywords[lang] }}</el-button>
      </el-form-item>
      <el-form-item>
        <div class="filter-form-div" v-for="(words, index) in filterQuery.words" :key="index">
          <el-space>
            <el-tag size="small" v-if="words.type.indexOf('begin') !== -1" closable @close="deleteOneType(index, 'begin')">^</el-tag>
            <el-tag size="small" v-if="words.type.indexOf('not') !== -1" closable @close="deleteOneType(index, 'not')">!</el-tag>
            <el-tag size="small" v-for="(tag, tagIndex) in words.word" :key="tag" closable @close="deleteOneWord(index, tagIndex)">{{ tag }}</el-tag>
            <el-tag size="small" v-if="words.type.indexOf('end') !== -1" closable @close="deleteOneType(index, 'end')">$</el-tag>
            <el-button text @click="deleteWords(index)">
              <el-icon>
                <CircleClose></CircleClose>
              </el-icon>
            </el-button>
          </el-space>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { logInfo } from '@/utils'
import { langConfig } from '@/utils/constant/config'
import { useStore } from '@/store'
import { watch, reactive, ref, getCurrentInstance, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
const { proxy } = getCurrentInstance() as any
const props = defineProps(['tags', 'tagsDict'])
const emit = defineEmits(['search'])
const store = useStore()
const lang = computed(() => store.getters['settingsModule/getLangState'])
const filterFormRes = ref('')
const scenes = ref(props.tags.map((e: any) => e.type))
const similarTag = ref<string[]>([])
const tagTag = ref<string[]>([])
const tagsDict = ref(props.tagsDict)
interface OneWord {
  word: Array<string>
  type: Array<string>
}
interface FilterFace {
  similar: {
    scene?: string
    tag?: string
    min_value?: string
    max_value?: string
  }
  tag: {
    scene?: string
    tag?: string
  }
  words: Array<OneWord>
}
const filterQuery: FilterFace = reactive({
  similar: {
    scene: '',
    tag: '',
    min_value: '',
    max_value: ''
  },
  tag: {
    scene: undefined,
    tag: undefined
  },
  words: []
})
/**
 * 监听相似度场景变化，更新标签
 */
watch(
  () => filterQuery.similar.scene,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue) {
        similarTag.value = props.tags.find((e: any) => e.type === filterQuery.similar.scene).child.map((e: any) => e.type)
      } else {
        similarTag.value = []
      }
      filterQuery.similar.tag = ''
    }
  }
)
/**
 * 监听相似度标签变更
 */
watch(
  () => filterQuery.similar.tag,
  (newValue) => {
    // 如果有相似度标签，并且相似度值为空，设置相似度值为默认0.5
    if (!newValue) {
      filterQuery.similar.max_value = undefined
      filterQuery.similar.min_value = undefined
    }
  }
)
/**
 * 监听标注场景变化，更新标签
 */
watch(
  () => filterQuery.tag.scene,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (newValue) {
        tagTag.value = props.tags.find((e: any) => e.type === filterQuery.tag.scene).child.map((e: any) => e.type)
      } else {
        tagTag.value = []
      }
      if (filterQuery.tag.tag && tagTag.value.indexOf(filterQuery.tag.tag) === -1) {
        filterQuery.tag.tag = ''
      }
    }
  }
)
/**
 * 指标树右键查询
 */
const rightClickType = ref(false)
const sceneRightClick = async (data: any) => {
  const key = rightClickType.value ? 'tag' : 'similar'
  filterQuery[key].scene = data.scene
  await nextTick()
  filterQuery[key].tag = data.tag
}
/**
 * 输入词组
 */
const isBegin = ref(false)
const isEnd = ref(false)
const isOr = ref(false)
const isNot = ref(false)
const beginDisble = ref(false)
const endDisble = ref(false)
const word = ref('')
/**
 * 添加一组关键词组
 * @param value
 */
const addFilterWord = (value: string) => {
  let words = [value]
  let types = []
  if (isNot.value) {
    types.push('not')
  }
  if (isBegin.value) {
    types.push('begin')
    isBegin.value = false
    beginDisble.value = true
  }
  if (isEnd.value) {
    types.push('end')
    isEnd.value = false
    endDisble.value = true
  }
  if (isOr.value) {
    types.push('or')
    words = value.split(' ').filter((e) => e !== '')
  }
  if (words.length !== 0) {
    filterQuery.words.push({ word: words, type: types })
  }
  word.value = ''
}
/**
 * 删除一个关键词
 * @param index
 * @param tagIndex
 */
const deleteOneWord = (index: number, tagIndex: number) => {
  filterQuery.words[index].word.splice(tagIndex, 1)
  if (filterQuery.words[index].word.length === 0) {
    filterQuery.words.splice(index, 1)
  }
  logInfo(filterQuery.words)
}
/**
 * 删除一个选择
 * @param index
 * @param typeName
 */
const deleteOneType = (index: number, typeName: string) => {
  filterQuery.words[index].type = filterQuery.words[index].type.filter((e: string) => e !== typeName)
  if (typeName === 'end') {
    endDisble.value = false
  }
  if (typeName === 'begin') {
    beginDisble.value = false
  }
  logInfo(filterQuery.words)
}
/**
 * 删除一组关键词
 * @param index
 */
const deleteWords = (index: number) => {
  // 判断这个关键词组是否有begin或end
  if (filterQuery.words[index].type.indexOf('begin') !== -1) {
    beginDisble.value = false
  }
  if (filterQuery.words[index].type.indexOf('end') !== -1) {
    endDisble.value = false
  }
  filterQuery.words.splice(index, 1)
}
/**
 * 清空所有关键词组
 */
const deleteAllWords = async () => {
  filterQuery.words = []
  beginDisble.value = false
  endDisble.value = false
}
/**
 * 点击查询操作，查询下一页数据
 * @param mode
 */
const search = (mode: string) => {
  const query = JSON.parse(JSON.stringify(filterQuery))
  emit('search', query, mode)
}
onMounted(() => {
  // search('')
  proxy.$bus.$on('select-tag-scene', sceneRightClick)
})
onBeforeUnmount(() => {
  proxy.$bus.$off('select-tag-scene')
})
</script>
