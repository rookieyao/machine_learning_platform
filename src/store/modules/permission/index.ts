/* eslint-disable no-restricted-syntax */
import { Module } from 'vuex'
import router, { constantRoutes, asyncRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import permissionStateTypes from './types'
import RootStateTypes from '../../types'
import Service from './api'
import { logInfo } from '@/utils'

const roles = localStorage.getItem('role') || ''
// create a new Store Modules.
const permissionModule: Module<permissionStateTypes, RootStateTypes> = {
  namespaced: true,
  state: {
    roles, // 用户包含的角色,
    permissions: [], // 用户指定局部操作权限
    accessRoutes: constantRoutes, // 可访问路由集合
    routes: constantRoutes, // 所有路由集合
    authedRoutes: []
  },
  mutations: {
    setRoles: (state: permissionStateTypes, { roleName }) => {
      // 修改用户权限名称
      state.roles = roleName
    },
    setAccessRoutes: (state: permissionStateTypes, routes) => {
      // 设置可访问的路径
      state.accessRoutes = constantRoutes.concat(routes)
      logInfo('accessRoutes', state.accessRoutes)
    },
    setRoutes: (state: permissionStateTypes, routes) => {
      state.routes = constantRoutes.concat(routes)
    },
    setAuthedRoutes: (state: permissionStateTypes, authedRoutes: string[]) => {
      state.authedRoutes = authedRoutes
      localStorage.setItem('authedRoutes', JSON.stringify(authedRoutes))
    },
    setPermissions: (state: permissionStateTypes, permissions: string[]) => {
      state.permissions = permissions
    }
  },
  actions: {
    // 异步接口请求，动态添加路由
    async getPermissonRoutes({ commit }, payload: any) {
      // api request
      const data = {
        roleName: payload.roleName
      }
      // 后端根据角色名称，查询授权菜单
      await Service.postAuthPermission(data).then((res) => {
        
        const { authedRoutes } = res.data
        commit('setAuthedRoutes', authedRoutes)
        // 过滤只显示授权菜单
        const accessedRoutes: RouteRecordRaw[] = []
        for (const item of asyncRoutes) {
          const parentRouter = Object.assign({}, item)
          parentRouter.children = []
          // 判断一级路由是否在authedRoutes中
          if (authedRoutes.find((e: any) => e === item.path)) {
            accessedRoutes.push(item)
          } else {
            if (item.children) {
              for (const children of item.children) {
                if (authedRoutes.find((e: any) => e === children.path)) {
                  parentRouter.children.push(children)
                }
              }
            }
          }
          if (parentRouter.children.length !== 0) {
            accessedRoutes.push(parentRouter)
          }
        }
        // for (const item of asyncRoutes) {
        //   const parentRouter = Object.assign({}, item)
        //   parentRouter.children = []
        //   for (const path of authedRoutes) {
        //     if (item.path === path) {
        //       // accessedRoutes.push(item)
        //     } else {
        //       // 如果path没有匹配上一级路由，则向下二级匹配
        //       // TODO 如果有三级路由？修改成递归的格式？
        //       if (item.children) {
        //         for (const children of item.children) {
        //           if (children.path === path) {
        //             parentRouter.children.push(children)
        //           }
        //         }
        //       }
        //     }
        //   }
        //   // 只有children存在的情况下才显示
        //   if (parentRouter.children.length !== 0) {
        //     accessedRoutes.push(parentRouter)
        //   }
        // }
        // 动态添加路由  vue-router4.x 暂时没有addRoutes
        router.isReady().then(() => {
          accessedRoutes.forEach((route: RouteRecordRaw) => {
            const routeName: any = route.name
            if (!router.hasRoute(routeName)) {
              router.addRoute(route)
            }
          })
          router.options.routes = constantRoutes.concat(asyncRoutes)
          commit('setAccessRoutes', accessedRoutes)
        })
      })
    },

    getRoutes({ commit }) {
      // api request
      // 动态添加路由  vue-router4.x 暂时没有addRoutes
      if (localStorage.getItem('authedRoutes')) {
        const authedRoutes = JSON.parse(localStorage.getItem('authedRoutes') as string)
        const accessedRoutes: RouteRecordRaw[] = []
        for (const item of asyncRoutes) {
          const parentRouter = Object.assign({}, item)
          parentRouter.children = []
          // 判断一级路由是否在authedRoutes中
          if (authedRoutes.find((e: any) => e === item.path)) {
            accessedRoutes.push(item)
          } else {
            if (item.children) {
              for (const children of item.children) {
                if (authedRoutes.find((e: any) => e === children.path)) {
                  parentRouter.children.push(children)
                }
              }
            }
          }

          // for (const path of authedRoutes) {
          //   if (item.path === path) {
          //     accessedRoutes.push(item)
          //   } else {
          //     // 如果path没有匹配上一级路由，则向下二级匹配
          //     // TODO 如果有三级路由？修改成递归的格式？
          //     if (item.children) {
          //       for (const children of item.children) {
          //         if (children.path === path) {
          //           parentRouter.children.push(children)
          //         }
          //       }
          //     }
          //   }
          // }
          // 只有children存在的情况下才显示
          if (parentRouter.children.length !== 0) {
            accessedRoutes.push(parentRouter)
          }
        }
        accessedRoutes.forEach((route: RouteRecordRaw) => {
          const routeName: any = route.name
          if (!router.hasRoute(routeName)) {
            router.addRoute(route)
          }
        })
      }
      commit('setRoutes', asyncRoutes)
    },
    // 授权角色
    getPermissonRoles({ commit }, payload: any) {
      // api request
      localStorage.setItem('role', payload.roles)
      logInfo('getPermissonRoles', payload.roles)
      commit('setRoles', payload)
    }
  },
  getters: {
    getAccessRoutes(state: permissionStateTypes) {
      return state.routes
    },
    authedRoutes(state: permissionStateTypes) {
      return state.authedRoutes
    },
    getRoles(state: permissionStateTypes) {
      return state.roles
    },
    getPermission(state: permissionStateTypes) {
      return state.permissions
    }
  }
}
export default permissionModule
