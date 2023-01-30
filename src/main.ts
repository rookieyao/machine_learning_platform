/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { isPermission } from '@/directive/permission'
import { key, store } from './store/index'
import router from './router/index'
import App from './App.vue'
import '@/styles/index.scss' // global css
import '@/permission' // permission control 全局路由守卫
import mitt from 'mitt'
// import 'default-passive-events'
// 1、挂载vuex
// 2、挂载路由
// 3、挂载 elementPlus UI;
// ElementPlus 样式通过CDN的方式引入来加样式文件，提高应用加载速度；

// import '@/mock'
// 挂载grid-layout
import VueGridLayout from 'vue-grid-layout'
const roles = localStorage.getItem('role')

if (roles) {
  // 在挂载路由之前，先进行异步路由处理
  store.dispatch('permissionModule/getPermissonRoutes', { roleName: roles })
}

store.dispatch('permissionModule/getRoutes')
// 链式注册插件
const app = createApp(App).use(store, key).use(router).use(ElementPlus, { locale: zhCn })
app.use(VueGridLayout)
// 挂载全局方法 isPermission
app.config.globalProperties.$isPermission = isPermission
// 全局挂在element-plus/icons-vue
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 挂载全局事件总线
var emitter = mitt()
app.config.globalProperties.$bus = {
  /**
   * @param {any} event 第一个参数是事件对象，第二个参数是接收到消息信息，可以是任意类型
   * @method $on  事件订阅, 监听当前实例上的自定义事件。
   * @method $off  取消事件订阅，移除自定义事件监听器。
   * @method $emit  事件广播, 触发当前实例上的事件。
   **/

  $on(...event: any[]) {
    emitter.on(event[0], event[1])
  },
  $off(...event: any[]) {
    emitter.off(event[0], event[1])
  },
  $emit(...event: any[]) {
    emitter.emit(event[0], event[1])
  }
}

// 现在所有的导航都是异步的，等路由ready以后再进行挂载组件；
router.isReady().then(() => app.mount('#app'))

// 在导航期间每次发生未捕获的错误时都会调用该处理程序
// eslint-disable-next-line no-console
router.onError((err) => {
  console.error(err)
})
