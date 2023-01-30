import { Module } from 'vuex'
import defaultSetting from '@/config'
import settingStateTypes from './types'
import RootStateTypes from '../../types'
import { logInfo } from '@/utils'

const { title, fixedHeader, sideBarLogo, showSettings } = defaultSetting.default
// create a new Store Modules.
const tagSliderLocal = localStorage.getItem('sliderValue')
const annoLayoutLocal = localStorage.getItem('annoLayout')
const reviewLayoutLocal = localStorage.getItem('reviewLayout')
const langLocal = localStorage.getItem('langLocal') ?? '/zh-CN'
const oldVersionLocal = localStorage.getItem('oldVersion') ?? 'false'
const tagHorizontalLayout = localStorage.getItem('tagHorizontalLayout') ?? 'false'
const settingsModule: Module<settingStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    title,
    fixedHeader,
    sideBarLogo,
    showSettings,
    tableHeight: 600, // 表格宽度
    hideHeader: false,
    lang: langLocal ? langLocal : '/zh-CN',
    oldVersion: oldVersionLocal === 'false' ? false : true,
    tagSlider: tagSliderLocal ? parseInt(tagSliderLocal) : 0, //指标调整的大小
    isDraggable: false,
    tagHorizontalLayout: tagHorizontalLayout === 'false' ? false : true,
    annoLayout: annoLayoutLocal
      ? JSON.parse(annoLayoutLocal)
      : [
          { x: 0, y: 0, w: 12, h: 8, i: 'tagtree' },
          { x: 2, y: 0, w: 12, h: 20, i: 'anno' }
        ], // 标注页面布局
    reviewLayout: reviewLayoutLocal
      ? JSON.parse(reviewLayoutLocal)
      : [
          { x: 0, y: 0, w: 12, h: 8, i: 'tagtree' },
          { x: 2, y: 0, w: 10, h: 20, i: 'anno' },
          { x: 0, y: 6, w: 2, h: 16, i: 'review' }
        ] // 审阅页面布局
  },
  mutations: {
    // 设置参数
    setTableHeight: (state: settingStateTypes, height) => {
      state.tableHeight = height
    },
    toggleHeader: (state: settingStateTypes) => {
      state.hideHeader = !state.hideHeader
    },
    toggleFixedHeader: (state: settingStateTypes) => {
      state.fixedHeader = !state.fixedHeader
    },
    toggleSidebarLogo: (state: settingStateTypes) => {
      state.sideBarLogo = !state.sideBarLogo
    },
    toggleLang: (state: settingStateTypes, payload: any) => {
      state.lang = payload.lang
      localStorage.setItem('langLocal', payload.lang)
    },
    toggleTagHorizontalLayout: (state: settingStateTypes, payload: any) => {
      state.tagHorizontalLayout = payload.tagHorizontalLayout
      localStorage.setItem('tagHorizontalLayout', payload.tagHorizontalLayout)
    },
    toggleOldVersion: (state: settingStateTypes, payload: any) => {
      state.oldVersion = payload.oldVersion
      localStorage.setItem('oldVersion', payload.oldVersion)
    },
    toggleIsDraggable: (state: settingStateTypes, payload: any) => {
      state.isDraggable = payload.isDraggable
    },
    setTagSlider: (state: settingStateTypes, payload: number) => {
      state.tagSlider = payload
      localStorage.setItem('sliderValue', payload.toString())
    },
    setAnnoLayout: (state: settingStateTypes, payload: any) => {
      state.annoLayout = payload
      localStorage.setItem('annoLayout', JSON.stringify(payload))
    },
    setReviewLayout: (state: settingStateTypes, payload: any) => {
      state.reviewLayout = payload
      localStorage.setItem('reviewLayout', JSON.stringify(payload))
    }
  },
  actions: {
    toToggleHeader({ commit }) {
      commit('toggleHeader')
    },
    toToggleFixedHeader({ commit }) {
      commit('toggleFixedHeader')
    },
    toToggleSidebarLogo({ commit }) {
      commit('toggleSidebarLogo')
    },
    toToggleLang({ commit }, payload) {
      commit('toggleLang', payload)
    },
    toToggleOldVersion({ commit }, payload) {
      commit('toggleOldVersion', payload)
    },
    toToggleTagHorizontalLayout({ commit }, payload) {
      commit('toggleTagHorizontalLayout', payload)
    },
    toToggleIsDraggable({ commit }, payload) {
      commit('toggleIsDraggable', payload)
    },
    toSetTagSlider({ commit }, payload) {
      commit('setTagSlider', payload)
    },
    toSetAnnoLayout({ commit }, payload) {
      commit('setAnnoLayout', payload)
    },
    toSetReviewLayout({ commit }, payload) {
      commit('setReviewLayout', payload)
    }
  },
  getters: {
    getHideHeaderState(state: settingStateTypes) {
      return state.hideHeader
    },
    getFixedHeaderState(state: settingStateTypes) {
      return state.fixedHeader
    },
    getSidebarLogoState(state: settingStateTypes) {
      return state.sideBarLogo
    },
    getLangState(state: settingStateTypes) {
      if (!['/zh-CN', '/en-US'].includes(state.lang)) {
        return '/zh-CN'
      }
      return state.lang
    },
    getOldVersionState(state: settingStateTypes) {
      return state.oldVersion
    },
    getTagHorizontalLayoutState(state: settingStateTypes) {
      return state.tagHorizontalLayout
    },
    getIsDraggable(state: settingStateTypes) {
      return state.isDraggable
    },
    getTagSliderState(state: settingStateTypes) {
      return state.tagSlider
    },
    getAnnoLayoutState(state: settingStateTypes) {
      return state.annoLayout
    },
    getReviewLayoutState(state: settingStateTypes) {
      return state.reviewLayout
    }
  }
}
export default settingsModule
