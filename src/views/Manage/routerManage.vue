<template>
  <div style="padding: 5px 20px;">
    <el-table :data="tableData" row-key="path" stripe max-height="800px" fit>
      <el-table-column prop="path" label="页面" fixed width="200px">
        <template #default="scope">
          {{ scope.row.title[lang] }}
        </template>
      </el-table-column>
      <el-table-column v-for="(k, v) in roleType" :label="k" :prop="v" width="100px">
        <template #default="scope">
          <el-checkbox v-model="scope.row[v]" @change="(value:any) => updateRouterRole(scope.row, v.toString(), value)"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { asyncRoutes } from '@/router/index'
import { logInfo } from '@/utils'
import { computed, onMounted, ref } from 'vue'
import manageServe from './api/manage'
import { useStore } from '@/store/index'
const store = useStore()
const lang = computed(() => store.getters['settingsModule/getLangState'])
/**
 *获取所有的权限角色名称
 */
const roleType = ref({} as any)
const tableData = ref([] as any)
const getAllRoles = async (callback: any) => {
  const res = await manageServe.getAllRoles()
  roleType.value = res.data
  callback()
}
/**
 * 获取所有的路由列表
 */
const getAllRoute = async () => {
  const routerRes = await manageServe.allRoute()
  var routerData = {} as any
  for (let index = 0; index < routerRes.data.length; index++) {
    const element = routerRes.data[index]
    routerData[`${element.path}_${element.role}`] = element.active
  }
  // 构建树形table结构
  tableData.value = asyncRoutes.map((e: any) => {
    var eObj = {} as any
    eObj.path = e.path
    eObj.title = e.meta.title
    for (const role1 in roleType.value) {
      eObj[role1] = routerData[`${e.path}_${role1}`] ?? false
    }
    eObj.children = e.children.map((ele: any) => {
      var eleObj = {} as any
      eleObj.path = ele.path
      eleObj.title = ele.meta.title
      for (const role2 in roleType.value) {
        eleObj[role2] = routerData[`${ele.path}_${role2}`] ?? false
      }
      return eleObj
    })
    return eObj
  })
  logInfo(tableData.value)
}
/**
 *更新路由权限
 * @param row
 * @param role
 * @param value
 */
const updateRouterRole = async (row: any, role: string, value: boolean) => {
  await manageServe.routeChange({ path: row.path, role: role, active: value })
  if (row.children) {
    for (let index = 0; index < row.children.length; index++) {
      const element = row.children[index]
      await manageServe.routeChange({ path: element.path, role: role, active: value })
    }
  }
  getAllRoute()
}
onMounted(() => {
  getAllRoles(getAllRoute)
})
</script>

<style scoped></style>
