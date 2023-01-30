<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device === 'mobile' && opened" class="drawer-bg" @click="handleClickOutside" />

    <!--backtop-->
    <el-backtop target=".app-wrapper" :visibility-height="100"></el-backtop>
    <Sidebar v-if="!$route.meta.sidebarHidden" class="sidebar-container" />
    <div :class="{ 'main-container': !$route.meta.sidebarHidden, 'main-container-sidebar-hidden': $route.meta.sidebarHidden, 'backgrand-color': $route.meta.backgrandColor }">
      <!--Navbar-->
      <div v-if="!$route.meta.sidebarHidden" :class="{ 'fixed-header': fixedHeader, 'hide-header': hideHeader }">
        <navbar :primary="primary" />
      </div>
      <!--AppMain-->
      <AppMain />
      <!--RightDrawer-->
      <RightDrawer v-if="showSetting">
        <ul id="lang" class="lang-switch">
          <li class="header-lang" :class="{ 'is-active': lang === '/zh-CN' }" @click="handleSwitchLang('/zh-CN')">中文</li>
          <span>/</span>
          <li class="header-lang" :class="{ 'is-active': lang === '/en-US' }" @click="handleSwitchLang('/en-US')">En</li>
        </ul>
        <div class="setting-item">
          <div class="setting-draw-title">{{ langConfig.form.themePick[lang] }}</div>

          <theme-pick :lang="lang" @submit="submitForm"></theme-pick>
          <div class="divider"></div>
        </div>
        <div class="setting-item">
          <div class="setting-draw-title">{{ langConfig.form.contentArea[lang] }}</div>
          <content-area :lang="lang" @change="handleHeaderChange" @fixedHeader="handleFixedHeaderChange" @sidebarLogo="handleSidebarLogoChange"></content-area>
          <div class="divider"></div>
        </div>
        <div class="setting-item">
          <div class="setting-draw-title">{{ langConfig.form.annotator[lang] }}</div>
          <er-setting
            :tag-slider="tagSlider"
            :old-version="oldVersion"
            :is-draggable="isDraggable"
            :lang="lang"
            :tag-horizontal-layout="tagHorizontalLayout"
            @change="handleTagSlider"
            @change-old-version="changeOldVersion"
            @change-is-draggable="changeIsDraggable"
            @change-tag-horizontal-layout="changeTagHorizontalLayout"
          ></er-setting>
          <div class="divider"></div>
        </div>
      </RightDrawer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, toRefs, ref, watchEffect } from 'vue'
import { useStore } from '@/store/index'

import { generateColors, writeNewStyle, getStyleTemplate, logInfo } from '@/utils'
import useResize from '@/hooks/useResize'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar/index.vue'
import AppMain from './components/AppMain.vue'
import RightDrawer from './components/RightSetting/RightDrawer.vue'
import ThemePick from './components/RightSetting/themePick/index.vue'
import ContentArea from './components/RightSetting/contentArea/index.vue'
import ErSetting from './components/RightSetting/erSetting/index.vue'
import { langConfig } from '@/utils/constant/config'
export default defineComponent({
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    RightDrawer,
    ThemePick,
    ContentArea,
    ErSetting
  },
  setup() {
    useResize()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    const store = useStore()
    const originalStyle = ref('')
    const colors = reactive({
      primary: '#fff'
    })
    const showSetting = computed(() => store.state.settingsModule.showSettings)
    const opened = computed(() => store.getters['appModule/getSidebarState'])
    const hideHeader = computed(() => store.getters['settingsModule/getHideHeaderState'])
    const fixedHeader = computed(() => store.getters['settingsModule/getFixedHeaderState'])
    const tagSlider = computed(() => store.getters['settingsModule/getTagSliderState'])
    const device = computed(() => store.getters['appModule/getDeviceState'])
    const withoutAnimation = computed(() => store.getters['appModule/getSidebarAnimation'])
    const originalStylesheetCount = computed(() => document.styleSheets.length || -1)
    const classObj = computed(() => ({
      hideSidebar: !opened.value,
      openSidebar: opened.value,
      withoutAnimation: withoutAnimation.value,
      mobile: device.value === 'mobile'
    }))
    /**
     * @description 监听device && opend
     * */
    watchEffect(() => {
      if (device.value === 'mobile') {
        store.dispatch('appModule/closeSideBar', { withoutAnimation: false })
      }
    })

    const handleClickOutside = () => {
      store.dispatch('appModule/closeSideBar', { withoutAnimation: false })
    }

    /**
     * @description 切换内容显示
     */
    const handleHeaderChange = () => {
      // 改变state
      store.dispatch('settingsModule/toToggleHeader')
    }
    /**
     * @description 是否固定头部
     */

    const handleFixedHeaderChange = () => {
      // 改变state
      store.dispatch('settingsModule/toToggleFixedHeader')
    }
    const handleSidebarLogoChange = () => {
      // 改变state
      store.dispatch('settingsModule/toToggleSidebarLogo')
    }
    /**
     * @description 指标调整大小
     */
    const handleTagSlider = (_tagSlider: number) => {
      store.dispatch('settingsModule/toSetTagSlider', _tagSlider)
      // localStorage.setItem('sliderValue', _tagSlider.toString())
    }
    /**
     * @description 指标页面版本
     */
    const oldVersion = computed(() => store.getters['settingsModule/getOldVersionState'])
    const changeOldVersion = (_oldVersion: boolean) => {
      store.dispatch('settingsModule/toToggleOldVersion', { oldVersion: _oldVersion })
      location.reload()
    }
    /**
     * @description 指标页面版本
     */
    const isDraggable = computed(() => store.getters['settingsModule/getIsDraggable'])
    const changeIsDraggable = (_isDraggable: boolean) => {
      store.dispatch('settingsModule/toToggleIsDraggable', { isDraggable: _isDraggable })
    }
    /**
     * @description 切换主题
     */
    const submitForm = (primary: string) => {
      colors.primary = primary
      Object.assign(colors, generateColors(primary))
      writeNewStyle(originalStylesheetCount.value, originalStyle.value, colors)
    }
    /**
     * @description 修改指标是否横向布局
     */
    const tagHorizontalLayout = computed(() => store.getters['settingsModule/getTagHorizontalLayoutState'])
    const changeTagHorizontalLayout = (data: boolean) => {
      store.dispatch('settingsModule/toToggleTagHorizontalLayout', { tagHorizontalLayout: data })
    }
    /**切换语种 */
    const handleSwitchLang = (_lang: string) => {
      store.dispatch('settingsModule/toToggleLang', { lang: _lang })
    }
    return {
      opened,
      device,
      hideHeader,
      fixedHeader,
      handleClickOutside,
      handleHeaderChange,
      handleFixedHeaderChange,
      handleSidebarLogoChange,
      handleTagSlider,
      tagSlider,
      classObj,
      submitForm,
      showSetting,
      ...toRefs(colors),
      lang,
      langConfig,
      changeOldVersion,
      oldVersion,
      changeIsDraggable,
      isDraggable,
      tagHorizontalLayout,
      changeTagHorizontalLayout,
      handleSwitchLang
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  // overflow: scroll;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.setting-item {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .setting-draw-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .divider {
    width: 100%;
    display: flex;
    clear: both;
    min-width: 100%;
    margin: 10px 0;

    box-sizing: border-box;
    padding: 0px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    list-style: none;
    line-height: 1.5715;
  }
}
.hide-header {
  display: none;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 63px);
}

.mobile .fixed-header {
  width: 100%;
}

.backgrand-color {
  background-color: $backgroundColor;
}
</style>
<style lang="stylus" scoped>
.lang-switch
  display inline-block
  float right
  height 100%
  & li
    color #2c3e50
    display inline-block
    vertical-align middle
    padding 0 10px
    cursor pointer
  .header-download
    opacity 0.4
    cursor default
    &.is-available
      opacity 1
      cursor pointer
  span
    opacity 0.7
  .header-lang
    cursor pointer
    opacity 0.7
    &.is-active
      opacity 1
      color rgba(24, 144, 255, 1)
.lang-switch::after
  display inline-block
  content ''
  height 100%
  vertical-align middle
  .header-lang
    cursor pointer
    opacity 0.7
    &.is-active
      opacity 1
</style>
