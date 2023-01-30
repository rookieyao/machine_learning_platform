<template>
  <div>
    <div v-if="simData">
      <div v-for="(text, index) in simData.text">
        <el-tooltip v-model:visible="visible" placement="top" effect="transparent" :show-arrow="false" virtual-triggering :virtual-ref="triggerRef">
          <template #content>
            <el-tooltip v-if="simData.tags[index].length > 0" v-for="(tag, tIndex) in simData.tags[index].filter((e:string) => e !== '')" placement="top" effect="light">
              <template #content>
                <el-space direction="vertical" alignment="left">
                  <span v-for="(result,rIndex) in simData.result[index].filter((e:any)=>e.tags.includes(tag)).slice(0,props.show_k)">
                    <router-link :to="{ name: 'er2', params: { tid: tid }, query: { mode: '批量审阅', text: result.text, tag: tag, search_mode: 'fullmatch' } }" custom v-slot="{ href }">
                      <a class="link" :href="href" target="_blank"> {{ result.text }}-{{ result.score }} </a>
                    </router-link>
                  </span>
                </el-space>
              </template>
              <el-tag effect="dark" @click="changeTag('', tag, $event)" :color="`rgba(64,158,255,${1-0.2*(10-simData.result[index].find((e:any)=>e.tags.includes(tag)).score*10)})`">
                {{ props.tagsDict[tag][lang] }}
              </el-tag>
            </el-tooltip>
            <el-tag v-else effect="dark" :color="`rgba(64,158,255,1)`">{{ langConfig.alice.er.noReferenceYet[lang] }}</el-tag>
          </template>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buttonBlur } from '@/utils'
import { langConfig } from '@/utils/constant/config'
import { ref, getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'
import er2Service from '../api/er2'

const props = defineProps(['simTexts', 'content', 'simSearch', 'mode', 'projectName', 'tid', 'top_k', 'score', 'show_k', 'tagsDict', 'lang'])
const emit = defineEmits(['changeTag'])

const simData = ref()
const didChange = ref(false)
const trinitySearch = async (texts: Array<string>) => {
  //当前页面是否开启相似推荐
  if (!props.simSearch) return
  //当前任务是否配置相似项目
  simData.value = []
  const data = {
    tid: props.tid,
    project_name: props.projectName,
    texts: texts,
    top_k: props.top_k,
    score: props.score
  }
  const res = await er2Service.trinitySearch(data)
  if (didChange.value) {
    didChange.value = false
    return
  }
  simData.value = res.data
  getPosition()
  visible.value = true
}
/**
 * 修改选中指标
 * @param tag
 * @param v
 */
const { proxy } = getCurrentInstance() as any
const selectTag = ref('')
const changeTag = (scene: string, tag: string, v: any) => {
  selectTag.value = tag
  // Anno发起数据传递
  if (props.mode === 'anno') {
    proxy.$bus.$emit('select-tag-anno', selectTag.value)
    visible.value = false
  }
  if (props.mode === 'scene') {
    emit('changeTag', { scene: scene, tag: tag })
  }
  // 按钮点击后失焦
  buttonBlur(v)
}
const triggerRef = ref({
  getBoundingClientRect() {
    return position.value
  }
})

const visible = ref(false)
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
})
/**获取指标推荐悬停位置 */
const elementId = ref('')
const element = ref()
watch(elementId, () => {
  element.value = document.getElementById(elementId.value)
})
const getPosition = async () => {
  if (element.value) {
    position.value = DOMRect.fromRect({
      width: 0,
      height: 0,
      x: element.value.getBoundingClientRect().x,
      y: element.value.getBoundingClientRect().y + 5
    })
  }
}

onMounted(() => {
  document.addEventListener('click', () => {
    visible.value = false
  })
  document.addEventListener('scroll', () => {
    getPosition()
  })
})
onUnmounted(() => {
  document.removeEventListener('click', () => {
    visible.value = false
  })
  document.removeEventListener('scroll', () => {
    getPosition()
  })
})
defineExpose({
  trinitySearch,
  visible,
  didChange,
  elementId
})
</script>

<style scoped>
.el-popper.is-transparent {
  background: transparent;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
