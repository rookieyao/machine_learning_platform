<template>
  <div style="padding: 5px 20px;">
    <el-space>
      <el-select v-model="filter" @change="getApi(getAllrbac)">
        <el-option value="auth" label="Auth"></el-option>
        <el-option value="alice" label="Alice"></el-option>
        <el-option value="scene" label="Scene"></el-option>
        <el-option value="tools" label="Tools"></el-option>
        <el-option value="aiPlatform" label="AiPlatform"></el-option>
      </el-select>
    </el-space>
    <el-table :data="tableData" row-key="unique_id" stripe max-height="800px" fit>
      <el-table-column prop="path" label="后端api" fixed width="200px"></el-table-column>
      <el-table-column prop="methods" label="method" fixed></el-table-column>
      <el-table-column prop="description" label="描述" width="300px" fixed></el-table-column>
      <el-table-column prop="all" label="所有用户">
        <template #default="scope">
          <el-checkbox v-model="scope.row.all" @change="(value:any) => rabcChange(scope.row, '*', value)"></el-checkbox>
        </template>
      </el-table-column>
      <template v-for="(k, v) in roleType">
        <el-table-column v-if="v.toString() !== 'superman'" :label="k" :prop="v.toString()" width="100px">
          <template #default="scope">
            <el-checkbox v-model="scope.row[v]" @change="(value:any) => rabcChange(scope.row, v.toString(), value)"></el-checkbox>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import manageServe from './api/manage'

const filter = ref('alice')
/**
 *获取所有的权限角色名称
 */
const roleType = ref()
const getAllRoles = async () => {
  const res = await manageServe.getAllRoles()
  roleType.value = res.data
}
/**
 * 获取所有的rbac权限
 */
const rabc = ref()
const getAllrbac = async () => {
  const rabcRes = await manageServe.allrabc()
  const data = {} as any
  for (let index = 0; index < rabcRes.data.length; index++) {
    const element = rabcRes.data[index]
    data[`${element.route}#${element.role}`] = element
  }
  rabc.value = data
  getTableData()
}
/**
 * 获取各个api的路由
 */
const apiData = reactive({
  auth: [],
  alice: [],
  scene: [],
  tools: [],
  aiPlatform: []
}) as any
const getApi = async (callback: any) => {
  if (filter.value === 'alice') {
    const aliceApi = await manageServe.aliceApi()
    apiData.alice = aliceApi.data
  }
  if (filter.value === 'auth') {
    const authApi = await manageServe.authApi()
    apiData.auth = authApi.data
  }
  if (filter.value === 'scene') {
    const sceneApi = await manageServe.sceneApi()
    apiData.scene = sceneApi.data
  }
  if (filter.value === 'tools') {
    const toolsApi = await manageServe.toolsApi()
    apiData.tools = toolsApi.data
  }
  if (filter.value === 'aiPlatform') {
    const aiPlatformApi = await manageServe.aiPlatformApi()
    apiData.aiPlatform = aiPlatformApi.data.map((e: any) => {
      e.path = '/api/skieernlpweb' + e.path
      return e
    })
  }
  callback()
}
/**
 * 构建table结构数据
 */
const tableData = ref([] as any)
const getTableData = () => {
  //清空tableData数据
  tableData.value.splice(0, tableData.value.length + 1)
  for (let index = 0; index < apiData[filter.value].length; index++) {
    const element = JSON.parse(JSON.stringify(apiData[filter.value][index]))
    // 循环每一个角色名称
    element['all'] = rabc.value[`${element.path}#*`] ? true : false
    for (const role in roleType.value) {
      element[role] = rabc.value[`${element.path}#${role}`] || element['all'] ? true : false
    }
    tableData.value.push(element)
  }
}
/**
 * 权限change
 */
const rabcChange = async (row: any, role: string, value: boolean) => {
  const data = {
    route: row.path,
    role: role,
    action: '*',
    description: row.description ?? ''
  }
  // 新增一条权限
  if (value) {
    await manageServe.createRoleApi(data)
  } else {
    await manageServe.deleteRoleApi(data)
  }
  // getAllrbac()
}
onMounted(() => {
  getAllRoles()
  getApi(getAllrbac)
})
</script>

<style scoped></style>
