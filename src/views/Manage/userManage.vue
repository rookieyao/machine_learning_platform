<template>
  <div style="padding: 40px;">
    <el-space>
      <el-select v-model="filterRole" multiple>
        <el-option v-for="(k, r) in roleType" :label="k" :value="r"></el-option>
      </el-select>
      <el-input v-model="filterUserName" placeholder="查询用户" @input="getAllUser"></el-input>
      <el-button @click="getAllUser">查询</el-button>
      <el-button @click="registerVisble = true">创建用户</el-button>
    </el-space>
    <el-table :data="allUser">
      <el-table-column prop="username" label="用户名" sortable></el-table-column>
      <el-table-column prop="email" label="email"></el-table-column>
      <el-table-column prop="disabled" label="是否无效">
        <template #default="scope">
          <el-select v-model="scope.row.disabled">
            <el-option :value="false" label="有效"></el-option>
            <el-option :value="true" label="无效"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="roles" label="角色">
        <template #default="scope">
          <el-select multiple v-model="scope.row.roles" style="width: 80%;">
            <el-option v-for="(k, v) in roleType" :label="k" :value="v" :key="v"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <el-button @click="updateUserInfo(scope.row)">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="registerVisble" title="创建用户" width="40%">
      <el-form ref="ruleFormRef" :model="userInfo" label-width="120px" :rules="userInfoRules">
        <el-form-item label="用户名" prop="username">
          <el-input class="register-input" v-model="userInfo.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input class="register-input" v-model="userInfo.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input class="register-input" v-model="userInfo.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input class="register-input" v-model="userInfo.checkPassword" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="userInfo.roles" multiple>
            <el-option v-for="(k, v) in roleType" :label="k" :value="v" :key="v"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标注系统用户">
          <el-checkbox v-model="isAnnoUser">创建标注系统用户</el-checkbox>
        </el-form-item>
        <el-form-item v-if="isAnnoUser" label="标注系统角色">
          <el-select v-model="userInfo.role">
            <el-option v-for="(i, v) in roleMap" :key="v" :label="i" :value="v"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAnnoUser" label="组别">
          <el-select size="mini" v-model="userInfo.group">
            <el-option v-for="(g, index) in groupMap" :key="index" :label="g" :value="g"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="registerUser(ruleFormRef)">创建</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import manageServe from './api/manage'
import { ref, onMounted, reactive } from 'vue'
import { logInfo } from '@/utils'
import { ElMessage } from 'element-plus'
const registerVisble = ref(false)
const filterRole = ref<string[]>([])
const filterUserName = ref('')
/**
 * 获取所有用户
 */
const allUser = ref([] as any)
const getAllUser = async () => {
  let filter = {} as any
  if (filterRole.value.length !== 0) {
    filter.roles = filterRole.value
  }
  if (filterUserName.value) {
    filter.name = filterUserName.value
  }
  const data = {
    offset: '',
    page_num: 1,
    page_size: 20,
    sort_by: {
      _id: -1
    },
    filter: filter
  }
  const res = await manageServe.getUser(data)
  allUser.value = res.data
}
/**
 *获取所有的权限角色名称
 */
const roleType = ref({} as any)
const getAllRoles = async () => {
  const res = await manageServe.getAllRoles()
  roleType.value = res.data
}
/**
 * 修改用户信息
 */
const updateUserInfo = async (row: any) => {
  const res = await manageServe.updateInfo(row)
  if (res.status === 200) {
    ElMessage.success('更新成功')
  }
}
/**
 * 创建用户
 */
interface userInfo {
  email: String
  password: String
  checkPassword: String
  username: String
  roles: Array<String>
  role: String
  group: String
}
const userInfo: userInfo = reactive({
  email: '',
  password: '',
  checkPassword: '',
  username: '',
  roles: [],
  role: '',
  group: ''
})
/**
 * 密码验证
 */
const ruleFormRef = ref()

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (userInfo.checkPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== userInfo.password) {
    callback(new Error('两次密码不同!'))
  } else {
    callback()
  }
}
const userInfoRules = reactive({
  password: [{ required: true, validator: validatePass, trigger: ['blur', 'change'] }],
  checkPassword: [{ required: true, validator: validatePass2, trigger: ['blur', 'change'] }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入email', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
})
const registerUser = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      // 创建用户
      const registerRes = await manageServe.register({ user: userInfo })
      logInfo(registerRes)
      if (registerRes && isAnnoUser.value) {
        // 创建标注系统用户
        await manageServe.registerAlice({ user: userInfo })
      }
      ElMessage.success('创建用户成功')
    }
  })
}
const resetForm = (formEl: any) => {
  if (!formEl) return
  formEl.resetFields()
}
/**
 * 标注系统用户
 */
const isAnnoUser = ref(false)
const roleMap = reactive({
  user: '普通用户',
  user2: '普通用户(可批量标注)',
  reviewer: '审核员',
  reviewer2: '高级审核员',
  reviewer3: '高级审核员(可以查看自己项目的统计信息)',
  manager: '普通管理员'
})
const groupMap = ref(['云听', '揭阳团队', '菲律宾团队'])
onMounted(() => {
  getAllRoles()
  getAllUser()
})
</script>

<style scoped>
.register-input {
  width: 40%;
}
</style>
