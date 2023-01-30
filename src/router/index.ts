import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { store } from '@/store'
import layout from '../layout/index.vue'
// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: layout,
    redirect: '/home',
    meta: {
      title: {
        '/zh-CN': '首页',
        '/en-US': 'Home'
      },
      icon: 'homeFilled'
    },
    children: [
      {
        path: '/home',
        // redirect: '/alice/task',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home/home.vue'),
        meta: {
          title: {
            '/zh-CN': '首页',
            '/en-US': 'Home'
          },
          icon: 'homeFilled'
        }
      }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login/index.vue'),
    meta: {
      title: {
        '/zh-CN': '登录',
        '/en-US': 'Login'
      },
      hidden: true,
      hiddenTab: true
    }
  },
  {
    path: '/noFound',
    name: 'NoFound',
    component: () => import(/* webpackChunkName: "noFound" */ '@/views/noFound.vue'),
    meta: {
      title: {
        '/zh-CN': '404',
        '/en-US': '404'
      },
      hidden: true,
      hiddenTab: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: "noFound" */ '@/views/noFound.vue'),
    meta: {
      title: {
        '/zh-CN': '未找到',
        '/en-US': 'NOT FOUND'
      },
      hidden: true,
      hiddenTab: true
    }
  }
]

// 异步路由
// hidden:
export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/alice',
    component: layout,
    redirect: '/alice/task',
    meta: {
      title: {
        '/zh-CN': '标注系统',
        '/en-US': 'Alice'
      },
      icon: 'List'
    },
    children: [
      {
        path: '/alice/task',
        name: 'task',
        component: () => import(/* webpackChunkName: "task" */ '@/views/Tag/task.vue'),
        meta: {
          title: {
            '/zh-CN': '标注系统',
            '/en-US': 'Alice'
          },
          icon: 'List'
        }
      },
      {
        path: '/alice/:tid/er',
        name: 'er2',
        component: () => import(/* webpackChunkName: "er2" */ '@/views/Tag/er.vue'),
        meta: {
          title: {
            '/zh-CN': '标注页面',
            '/en-US': 'Annotation'
          },
          icon: 'Tickets',

          hidden: true,
          keepAlive: true,
          sidebarHidden: true,
          backgrandColor: true
        }
      },
      {
        path: '/alice/:tid/label',
        name: 'label',
        component: () => import(/* webpackChunkName: "label" */ '@/views/Tag/label.vue'),
        meta: {
          title: {
            '/zh-CN': '标注页面',
            '/en-US': 'Annotation'
          },
          icon: 'Tickets',
          hidden: true,
          keepAlive: true,
          sidebarHidden: true,
          backgrandColor: true
        }
      },
      {
        path: '/alice/:tid/edit',
        name: 'taskedit',
        component: () => import(/* webpackChunkName: "taskedit" */ '@/views/Tag/taskedit.vue'),
        meta: {
          title: {
            '/zh-CN': '标注任务配置',
            '/en-US': '标注任务配置'
          },
          icon: 'SetUp',
          hidden: true,
          keepAlive: true,
          sidebarHidden: true
        }
      },
      {
        path: '/alice/task/:tid/tagsvis',
        name: 'tagsvis',
        component: () => import(/* webpackChunkName: "tagsvis" */ '@/views/Tag/tagsvis.vue'),
        meta: {
          title: {
            '/zh-CN': '指标分布',
            '/en-US': '指标分布'
          },
          icon: 'DataBoard',
          hidden: true,
          keepAlive: true,
          sidebarHidden: true
        }
      },
      {
        path: '/alice/dayswork',
        name: 'dayswork',
        component: () => import(/* webpackChunkName: "dayswork" */ '@/views/Tag/dayswork.vue'),
        meta: {
          title: {
            '/zh-CN': '人天统计',
            '/en-US': 'Work count'
          },
          icon: 'Histogram'
        }
      },
      {
        path: '/alice/reviewscore',
        name: 'reviewScore',
        component: () => import(/* webpackChunkName: "reviewScore" */ '@/views/Tag/reviewScore.vue'),
        meta: {
          title: {
            '/zh-CN': '审阅统计',
            '/en-US': 'Review count'
          },
          icon: 'Histogram'
        }
      },
      {
        path: '/alice/manager',
        name: 'aliceManager',
        component: () => import(/* webpackChunkName: "aliceManager" */ '@/views/Tag/aliceManager.vue'),
        meta: {
          title: {
            '/zh-CN': '用户情况',
            '/en-US': 'manager'
          },
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/evaluate',
    component: layout,
    meta: {
      title: {
        '/zh-CN': '评估报告系统',
        '/en-US': 'Evaluate'
      },
      icon: 'DataLine'
    },
    children: [
      {
        path: '/evaluate/:eid',
        name: 'evaluate',
        component: () => import(/* webpackChunkName: "evaluate" */ '@/views/Evaluate/evaluate.vue'),
        meta: {
          title: {
            '/zh-CN': '评估报告',
            '/en-US': '评估报告'
          },
          icon: '',
          hidden: true,
          keepAlive: true,
          sidebarHidden: true
        }
      },
      {
        path: '/evaluate/eval',
        name: 'evaluateInfo',
        component: () => import(/* webpackChunkName: "evaluateInfo" */ '@/views/Evaluate/evaluateInfo.vue'),
        meta: {
          title: {
            '/zh-CN': '评估报告列表',
            '/en-US': '评估报告列表'
          },
          icon: 'DataLine'
        }
      }
    ]
  },
  {
    path: '/scene',
    redirect: '/scene/all',
    component: layout,
    meta: {
      title: {
        '/zh-CN': '场景挖掘',
        '/en-US': 'Scene mining'
      }
    },
    children: [
      {
        path: '/scene/all',
        name: 'sceneTaskList',
        component: () => import(/* webpackChunkName:"sceneTaskList" */ '@/views/SceneMining/sceneTaskList.vue'),
        meta: {
          title: {
            '/zh-CN': '场景挖掘任务列表页',
            '/en-US': 'Scene mining'
          },
          icon: 'Tickets'
        }
      },
      {
        path: '/scene/:tid/task',
        name: 'sceneTask',
        component: () => import(/* webpackChunkName:"sceneTask" */ '@/views/SceneMining/sceneTask.vue'),
        meta: {
          title: {
            '/zh-CN': '场景挖掘任务配置',
            '/en-US': 'Scene task'
          },
          hidden: true,
          keepAlive: true,
          sidebarHidden: true
        }
      },
      {
        path: '/scene/:tid/er2',
        name: 'sceneEr2',
        component: () => import(/* webpackChunkName:"sceneEr" */ '@/views/SceneMining/sceneEr.vue'),
        meta: {
          title: {
            '/zh-CN': '场景挖掘标注',
            '/en-US': 'Scene mining'
          },
          hidden: true,
          keepAlive: true,
          sidebarHidden: true,
          backgrandColor: true
        }
      },
      {
        path: '/scene/:tid/tagsvis',
        name: 'sceneTagsvis',
        component: () => import(/* webpackChunkName: "tagsvis" */ '@/views/SceneMining/tagsvis.vue'),
        meta: {
          title: {
            '/zh-CN': '场挖指标分布',
            '/en-US': '场挖指标分布'
          },
          icon: 'DataBoard',
          hidden: true,
          keepAlive: true,
          sidebarHidden: true
        }
      }
    ]
  },
  {
    path: '/manage',
    redirect: '/manage/user',
    component: layout,
    meta: {
      title: {
        '/zh-CN': '权限管理',
        '/en-US': 'Manage'
      },
      icon: 'Management'
    },
    children: [
      {
        path: '/manage/user',
        name: 'userManage',
        component: () => import(/* webpackChunkName:"userManage" */ '@/views/Manage/userManage.vue'),
        meta: {
          title: {
            '/zh-CN': '用户管理',
            '/en-US': 'User Manage'
          },
          icon: 'Avatar'
        }
      },
      {
        path: '/manage/rabc',
        name: 'rabcManage',
        component: () => import(/* webpackChunkName:"rabcManage" */ '@/views/Manage/rabcManage.vue'),
        meta: {
          title: {
            '/zh-CN': 'API权限管理',
            '/en-US': 'API Manage'
          },
          icon: 'Ticket'
        }
      },
      {
        path: '/manage/router',
        name: 'routerManage',
        component: () => import(/* webpackChunkName:"rabcManage" */ '@/views/Manage/routerManage.vue'),
        meta: {
          title: {
            '/zh-CN': '菜单权限管理',
            '/en-US': 'Router Manage'
          },
          icon: 'Coin'
        }
      }
    ]
  },
  {
    path: '/tools',
    component: layout,
    meta: {
      title: {
        '/zh-CN': '模型工具',
        '/en-US': 'Tools'
      },
      icon: 'Tools'
    },
    children: [
      {
        path: '/tools/nerdemo',
        name: 'nerDemo',
        component: () => import(/* webpackChunkName:"nerDemo" */ '@/views/Tools/nerDemo.vue'),
        meta: {
          title: {
            '/zh-CN': '细粒度模型测试',
            '/en-US': 'Ner Demo'
          },
          icon: 'Cloudy'
        }
      },
      {
        path: '/tools/scenedemo',
        name: 'sceneDemo',
        component: () => import(/* webpackChunkName:"sceneDemo" */ '@/views/Tools/sceneDemo.vue'),
        meta: {
          title: {
            '/zh-CN': '场景挖掘测试',
            '/en-US': 'Scene Demo'
          },
          icon: 'Cloudy'
        }
      },
      {
        path: '/tools/runmodel',
        name: 'runModel',
        component: () => import(/* webpackChunkName:"runModel" */ '@/views/Tools/runModel.vue'),
        meta: {
          title: {
            '/zh-CN': '模型本地跑',
            '/en-US': 'Run model'
          },
          icon: 'DataAnalysis'
        }
      },
      {
        path: '/tools/export',
        name: 'toolsExport',
        component: () => import(/* webpackChunkName:"toolsExport" */ '@/views/Tools/toolsExport.vue'),
        meta: {
          title: {
            '/zh-CN': '数据导出/格式化',
            '/en-US': 'Export'
          },
          icon: 'Expand'
        }
      }
    ]
  },
  {
    path: '/aiPlatform',
    component: layout,
    redirect: '/aiPlatform/data',
    meta: {
      title: {
        '/zh-CN': '机器学习平台',
        '/en-US': 'AI Platform'
      },
      icon: 'Platform'
    },
    children: [
      {
        path: '/aiPlatform/data',
        name: 'aiDataContral',
        component: () => import(/* webpackChunkName:"dataContral" */ '@/views/AIPlatform/dataContral.vue'),
        meta: {
          title: {
            '/zh-CN': '数据管理',
            '/en-US': 'Data Contral'
          },
          icon: 'Coin'
        }
      },
      {
        path: '/aiPlatform/train',
        name: 'aiTrainContral',
        component: () => import(/* webpackChunkName:"trainContral" */ '@/views/AIPlatform/trainContral.vue'),
        meta: {
          title: {
            '/zh-CN': '训练管理',
            '/en-US': 'Train Contral'
          },
          icon: 'SetUp'
        }
      },
      {
        path: '/aiPlatform/model',
        name: 'aiModelContral',
        component: () => import(/* webpackChunkName:"modelContral" */ '@/views/AIPlatform/modelContral.vue'),
        meta: {
          title: {
            '/zh-CN': '服务管理',
            '/en-US': 'Model Contral'
          },
          icon: 'Cpu'
        }
      },
      {
        path: '/aiPlatform/approving',
        name: 'aiApprovingContral',
        component: () => import(/* webpackChunkName:"approvingContral" */ '@/views/AIPlatform/approvingContral.vue'),
        meta: {
          title: {
            '/zh-CN': '审核管理',
            '/en-US': 'Approving Contral'
          },
          icon: 'Checked'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  scrollBehavior: () => ({
    top: 0
  }),
  routes: constantRoutes
})
router.beforeEach((to, from, next) => {
  // 当前导航栏的路由
  const tabsOption = store.getters['tabModule/getTabsOption']
  // 判断当前路由中是否已经入栈
  const flag = tabsOption.findIndex((tab: { route: string }) => tab.route === to.path) > -1
  if (!flag && !to.meta.hiddenTab) {
    store.commit('tabModule/ADD_TAB', { route: to.path, title: to.meta.title, name: to.name })
  }
  store.commit('tabModule/SET_TAB', to.path)
  if (localStorage.getItem('auth')) {
    next()
  } else if (to.path === '/login') {
    console.log('/login')
    next()
  } else {
    console.log('unauthed into login')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})

export default router
