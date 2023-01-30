<style>
.query {
  width: 350px;
}
</style>
<template>
  <div>
    <el-form>
      <el-row>
        <el-col :span="5">
          <el-form-item class="query" label="标注系统">
            <el-select size="small" v-model="default_database" style="width: 150px;" :disabled="!role">
              <el-option label="本地标注系统" value="ann"></el-option>
              <el-option label="线上标注系统" value="ann_online"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item class="query" label="角色">
            <el-select size="small" v-model="queryRole" placeholder="角色" style="width: 100px;" :disabled="!role">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(i, v) in roleMap" :key="v" :label="i" :value="v"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="组别">
            <el-select size="small" v-model="queryGroup" style="width: 100px;" :disabled="!role">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="g in groupMap" :key="g" :label="g" :value="g"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="是否有效">
            <el-select size="small" v-model="queryActive" style="width: 100px;" :disabled="!role">
              <el-option label="有效" :value="true"></el-option>
              <el-option label="无效" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item>
          <el-button size="small" @click="get_user">查询</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="user">
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column v-if="role" prop="role" label="角色">
        <template #default="scope">
          <el-select size="small" v-model="scope.row.role">
            <el-option v-for="(i, v) in roleMap" :key="v" :label="i" :value="v"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-if="role" prop="group" label="组别">
        <template #default="scope">
          <el-select size="small" v-model="scope.row.group">
            <el-option v-for="(g, index) in groupMap" :key="index" :label="g" :value="g"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="active" label="是否有效">
        <template #default="scope">
          <el-select size="small" v-model="scope.row.active" :disabled="!role">
            <el-option label="有效" :value="true"></el-option>
            <el-option label="无效" :value="false"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="_id" label="注册时间">
        <template #default="scope">
          {{ new Date(parseInt(scope.row._id.substring(0, 8), 16) * 1000).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="role">
        <template #default="scope">
          <el-button size="small" @click="modifyUser(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { logInfo, fmtDate } from '@/utils'
import { defineComponent, onMounted, ref } from 'vue'
import indexService from './api'

export default defineComponent({
  setup() {
    const default_database = ref('ann_online')
    const queryRole = ref('')
    const roleMap = ref({
      user: '普通用户',
      user2: '普通用户(可批量标注)',
      reviewer: '审核员',
      reviewer2: '高级审核员',
      reviewer3: '高级审核员(可以查看自己项目的统计信息)',
      manager: '普通管理员'
    } as any)
    const groupMap = ref(['云听', '揭阳团队', '菲律宾团队'])
    const queryGroup = ref('')
    const queryActive = ref(true)
    const user = ref([])
    const get_user = async () => {
      const query = {
        default_database: default_database.value,
        role: queryRole.value,
        group: queryGroup.value,
        active: queryActive.value.toString()
      }
      logInfo(query)
      const userRes = await indexService.queryUser(query)
      user.value = userRes.data
    }
    const role = ref(false)
    const reviewer_role = ref(false)
    // 查询当前的用户权限
    const checkRole = () => {
      const roles = localStorage.getItem('role')
      if (roles?.indexOf('superman') != -1 || roles.indexOf('ann_manager') != -1) {
        role.value = true
      }
      if (roles?.indexOf('reviewer_plus') != -1) {
        reviewer_role.value = true
      }
    }
    const modifyUser = async (row: any) => {
      logInfo(row)
      const query = { default_database: default_database.value, uid: row._id, role: row.role, group: row.group, active: row.active.toString() }
      const res = await indexService.updataUser(query)
    }
    onMounted(() => {
      get_user(), checkRole()
    })
    return {
      default_database,
      queryRole,
      roleMap,
      queryActive,
      groupMap,
      queryGroup,
      get_user,
      user,
      role,
      reviewer_role,
      fmtDate,
      modifyUser
    }
  }
})
</script>
