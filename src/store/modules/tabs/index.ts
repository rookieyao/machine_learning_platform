import { Module } from 'vuex'
import tabStateTypes from './types'
import RootStateTypes from '../../types'
// create a new Store Modules.
// 导航栏状态管理
const tabModule: Module<tabStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    tabsOption: [
      {
        route: '/home',
        title: {
          '/zh-CN': '首页',
          '/en-US': 'Home Page'
        },
        name: 'home'
      }
    ],
    currentIndex: '/home',
    breadcrumbList: []
  },
  mutations: {
    ADD_TAB: (state: tabStateTypes, data: { route: string; name: string; title: { [key: string]: String } }) => {
      // 在导航栏添加一个tag
      state.tabsOption.push(data)
    },
    DELETE_TAB: (state: tabStateTypes, route: string) => {
      // 移除导航栏中的一个tag
      const index = state.tabsOption.findIndex((tab) => tab.route === route)
      state.tabsOption.splice(index, 1)
    },
    SET_TAB: (state: tabStateTypes, index: string) => {
      state.currentIndex = index
    },
    CLEAR_TAB: (state: tabStateTypes) => {
      // 初始化tab
      state.tabsOption = [
        {
          route: '/home',
          title: {
            '/zh-CN': '首页',
            '/en-US': 'Home Page'
          },
          name: 'home'
        }
      ]
    }
  },
  actions: {},
  getters: {
    getCurrentIndex(state: tabStateTypes) {
      // 当前的路由
      return state.currentIndex
    },
    getTabsOption(state: tabStateTypes) {
      // 获取目前导航栏的路由信息
      return state.tabsOption
    }
  }
}
export default tabModule
