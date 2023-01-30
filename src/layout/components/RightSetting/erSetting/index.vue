<template>
  <el-form ref="erFromRes" label-position="left" class="er-form" label-width="120px">
    <el-form-item :label="langConfig.form.tagButton[lang]">
      <el-slider v-model="sliderValue" :min="-10" :max="10" @change="handleChange"></el-slider>
    </el-form-item>
    <el-form-item :label="langConfig.form.tagHorizontalLayout[lang]">
      <el-switch v-model="tagHorizontalLayout" size="small" @change="changeTagHorizontalLayout"></el-switch>
    </el-form-item>
    <el-form-item :label="langConfig.form.oldVersion[lang]">
      <el-switch size="small" v-model="version" @change="changeOldVersion" />
    </el-form-item>
    <el-form-item :label="langConfig.form.position[lang]">
      <el-switch size="small" v-model="position" @change="changeIsDraggable" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { langConfig } from '@/utils/constant/config'

export default defineComponent({
  props: {
    lang: {
      type: String,
      default: '/zh-CN'
    },
    tagSlider: {
      type: Number,
      required: true
    },
    oldVersion: {
      type: Boolean,
      request: true
    },
    isDraggable: {
      type: Boolean,
      request: true
    },
    tagHorizontalLayout: {
      type: Boolean,
      request: true
    }
  },
  emits: ['change', 'change-old-version', 'change-is-draggable', 'change-tag-horizontal-layout'],
  setup(props, { emit }) {
    const erFromRes = ref(null)
    // 指标大小变更
    const sliderValue = ref(props.tagSlider)
    const handleChange = () => {
      emit('change', sliderValue.value)
    }
    // 新旧版本页面变更
    const version = ref(props.oldVersion)
    const changeOldVersion = (newValue: boolean) => {
      emit('change-old-version', newValue)
    }
    // 是否开启位置调整
    const position = ref(props.isDraggable)
    const changeIsDraggable = (newValue: boolean) => {
      emit('change-is-draggable', newValue)
    }
    // 指标树布局
    const tagHorizontalLayout = ref(props.tagHorizontalLayout)
    const changeTagHorizontalLayout = (newValue: boolean) => {
      emit('change-tag-horizontal-layout', newValue)
    }
    return {
      langConfig,
      sliderValue,
      erFromRes,
      handleChange,
      version,
      changeOldVersion,
      position,
      changeIsDraggable,
      changeTagHorizontalLayout,
      tagHorizontalLayout
    }
  }
})
</script>
<style lang="stylus" scoped>
.er-form{
width:100%
}
</style>
