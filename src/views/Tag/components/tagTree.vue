<style scoped>
.tag {
  font-size: 16px;
  margin: 0 3px 0 0;
  padding: 0 1px 0 1px;
  color: black;
}
.tag.enable {
  cursor: pointer;
  background-color: #d6d4c8;
  display: inline-block;
  padding: 0px 2px;
  margin: 2px;
}
.tag.active {
  background-color: #23d02e;
}

.tag.disable {
  cursor: default;
  padding: 2px 5px;
}
.container-tag {
  margin: 0 10px 0 10px;
}
.tag-item {
  padding: 0 2px 0 2px;
  height: max-content;
}
.first-tag {
  width: fit-content;
}
</style>
<template>
  <div id="tag-tree">
    <el-row class="container-tag">
      <div :span="1" v-for="(i, index) in tagsSort" class="tag-item" :key="index" :style="getStyle(index)">
        <h6 class="first-tag">{{ setTag(initaTags[i[0]].type) }}</h6>
        <el-button
          size="small"
          class="tag"
          v-for="second in initaTags[i[0]].child"
          type="info"
          plain
          :key="second"
          :class="{ active: second.type == selectTag, enable: second.enable, disable: !second.enable }"
          :disabled="!second.enable"
          :title="second.tip"
          @click="changeTag(initaTags[i[0]].type, second.type, $event)"
          @contextmenu.prevent="rightClick(initaTags[i[0]].type, second.type, $event)"
          :style="{ fontSize: tagFontSize + 'px', lineHeight: tagButtonHeight + 'px', minHeight: tagMinHeight + 'px' }"
        >
          {{ mode === 'scene' ? setTag(`${initaTags[i[0]].type}_${second.type}`) : setTag(second.type) }}
        </el-button>
        <el-button v-if="mode === 'scene'" text icon="CirclePlus" @click="clickAddTag(initaTags[i[0]].type)"></el-button>
      </div>
      <el-button v-if="mode === 'scene'" text icon="CirclePlus" @click="clickAddTag('')"></el-button>
    </el-row>
  </div>
</template>
<script lang="ts">
import { buttonBlur, logInfo } from '@/utils'
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStore } from '@/store/index'
import { langConfig } from '@/utils/constant/config'
export default defineComponent({
  name: 'tagTree',
  props: {
    initaTags: {
      type: Array as any,
      required: true,
      default: []
    },
    tagsDict: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  emits: ['addSecenTag', 'changeTag'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() as any
    const store = useStore()
    const tags = ref(props.initaTags as any)
    const selectTag = ref('')

    /**
     * ???????????????,???????????????????????????
     */
    const tagsSort = ref([] as any)
    const sortTag = () => {
      var tagCountIndex = []
      const filterTag = ['????????????', 'sentiment', '?????????', '????????????', 'intent']
      for (let i = 0; i < props.initaTags.length; i++) {
        const element = props.initaTags[i] as any
        tagCountIndex.push([i, filterTag.indexOf(element.type) === -1 ? element.child.length : 999])
      }
      tagsSort.value = tagCountIndex.sort(function (a, b) {
        return b[1] - a[1]
      })
    }
    watch(
      () => props.initaTags,
      () => {
        sortTag()
        waterFall()
      }
    )
    sortTag()

    /**
     * ??????????????????
     * @param tag
     * @param v
     */
    const changeTag = (scene: string, tag: string, v: any) => {
      selectTag.value = tag
      logInfo('changeTag', tag)
      // Anno??????????????????
      if (props.mode === 'anno') {
        // proxy.$bus.$emit('select-tag', selectTag.value)
        proxy.$bus.$emit('select-tag-anno', selectTag.value)
      }
      if (props.mode === 'scene') {
        emit('changeTag', { scene: scene, tag: tag })
      }
      // ?????????????????????
      buttonBlur(v)
    }
    /**
     * ????????????tag???????????????tag
     * @param tag
     * @param v
     */
    const rightClick = (first_tag: string, tag: string, v: any) => {
      logInfo('rightClick set search Tag', tag)
      if (props.mode === 'scene') {
        proxy.$bus.$emit('select-tag-scene', { scene: first_tag, tag: tag })
      }
      proxy.$bus.$emit('select-tag', tag)
      // ?????????????????????
      buttonBlur(v)
    }

    /**
     * ??????????????????
     */
    const tagSlider = computed(() => store.getters['settingsModule/getTagSliderState'])
    const tagFontSize = ref(16 + parseInt(tagSlider.value))
    const tagButtonHeight = ref(24 + parseInt(tagSlider.value))
    const tagMinHeight = ref(32 + parseInt(tagSlider.value))
    watch(tagSlider, (newValue, prevValue) => {
      tagFontSize.value = 16 + newValue
      tagButtonHeight.value = 24 + newValue
      tagMinHeight.value = 32 + newValue
    })
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    /**
     * ?????????????????????
     * @param tag
     */
    const setTag = (tag: string) => {
      return props.tagsDict[tag][lang.value]
    }
    const activeStyle = ref(false)
    const tag_item_width = ref<Number[]>([])
    /**
     * ????????????????????????
     */
    const waterFall = () => {
      tag_item_width.value.slice(0, tag_item_width.value.length)
      // ????????????????????????
      const container_tag = document.querySelector('.container-tag')
      let container_tag_width = 0
      if (container_tag) {
        container_tag_width = container_tag.clientWidth - 20
      } else {
        container_tag_width = 1600
      }
      // tag_item ?????????
      let tag_item_total_width = 0
      // ????????????????????????
      let max_column = 1
      // tag-item ?????????????????????
      let tag_item_column = []
      // ???????????????????????????????????????
      let children_count = []
      let children_height = []
      // ????????????????????????????????????????????????
      let tag_item_init_width = []
      // tag_item ???????????????????????????????????????button
      const tag_item = document.querySelectorAll('.tag-item')
      for (let i = 0; i < tag_item.length; i++) {
        const element = tag_item[i].children
        let tag_item_child_max_width = 0
        children_count.push(element.length)
        children_height.push(element.length)
        // ??????????????????????????????????????????????????????????????????????????????
        for (let j = 0; j < element.length; j++) {
          const button_width = element[j].clientWidth + 6
          tag_item_child_max_width = button_width > tag_item_child_max_width ? button_width : tag_item_child_max_width
        }
        tag_item_total_width += tag_item_child_max_width
        tag_item_width.value.push(tag_item_child_max_width)
        tag_item_init_width.push(tag_item_child_max_width)
        tag_item_column.push(max_column)
      }
      // ????????????tag_item?????????????????????????????????
      let f = false
      if (tag_item_total_width >= container_tag_width) {
        f = true
      }
      while (tag_item_total_width < container_tag_width) {
        // ??????height????????????????????????????????????
        let max_position: any = children_height.indexOf(Math.max.apply(Math, children_height))
        // ???????????????+1
        tag_item_column[max_position] += 1
        // ??????tag-item?????????
        tag_item_total_width += tag_item_init_width[max_position]
        if (tag_item_total_width < container_tag_width) {
          // ????????????/???????????????
          children_height[max_position] = children_count[max_position] / tag_item_column[max_position]
          // tag-item ????????????
          tag_item_width.value[max_position] = tag_item_init_width[max_position] * tag_item_column[max_position]
        }
      }
      // ????????????tag_item??????????????????????????????
      while (tag_item_total_width > container_tag_width && f && tag_item_total_width < 2 * container_tag_width - 135) {
        // ??????height????????????????????????????????????
        let max_position: any = children_height.indexOf(Math.max.apply(Math, children_height))
        // ???????????????+1
        tag_item_column[max_position] += 1
        // ??????tag-item?????????
        tag_item_total_width += tag_item_init_width[max_position]
        // ????????????/???????????????
        children_height[max_position] = children_count[max_position] / tag_item_column[max_position]
        if (tag_item_column[max_position] < 3) {
          // tag-item ????????????
          tag_item_width.value[max_position] = tag_item_init_width[max_position] * tag_item_column[max_position]
        } else {
          tag_item_column[max_position] -= 1
        }
      }
      activeStyle.value = true
    }
    /**
     * ??????tag-item???style
     * @param index
     */
    const getStyle = (index: number) => {
      if (activeStyle.value && !tagHorizontalLayout.value) {
        return {
          width: tag_item_width.value[index].toString() + 'px'
        }
      } else {
        return { border: 'double #828485', 'border-width': '0 0 0 1px' }
      }
    }
    const tagHorizontalLayout = computed(() => store.getters['settingsModule/getTagHorizontalLayoutState'])
    const clickAddTag = (tag: string) => {
      emit('addSecenTag', tag)
    }
    onMounted(() => {
      waterFall()
    })
    onBeforeUnmount(() => {
      proxy.$bus.$off('select-tag')
      proxy.$bus.$off('select-tag-anno')
      proxy.$bus.$off('select-tag-scene')
    })
    return {
      lang,
      // tags,
      selectTag,
      changeTag,
      tagSlider,
      tagFontSize,
      tagButtonHeight,
      tagMinHeight,
      setTag,
      activeStyle,
      tag_item_width,
      getStyle,
      tagsSort,
      rightClick,
      clickAddTag,
      langConfig
    }
  }
})
</script>
