<template>
  <div style="padding: 30px;">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form ref="taskFormRef" :model="taskForm" :rules="taskRules" label-width="120px">
          <el-form-item label="场景挖掘项目名" prop="taskName">
            <el-input size="small" v-model="taskForm.taskName"></el-input>
          </el-form-item>
          <el-form-item label="标注使用版本" prop="version">
            <el-select size="small" v-model="taskForm.version" allow-create filterable default-first-option @change="versionSeleteChange">
              <el-option v-for="item in taskForm.versions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <p style="color: red; line-height: 20px; padding-left: 10px;">PS:版本使用 YYMMDDXX 的格式例如 22050501 表示22年05月05日01版。</p>
          </el-form-item>
          <el-form-item label="当前线上版本">
            <el-input v-model="taskForm.onlineVersion" disabled style="width: 40%; padding-right: 10px;"></el-input>
            <!-- <el-button @click="setOnlineVersion">更新线上版本为当前标注版本</el-button> -->
            <el-popover trigger="click" width="250px" placement="top">
              <p class="popover-p">需要上线到哪个环境?</p>
              <p class="popover-p-red">*同个环境不同版本服务会替换,生产为正式环境.</p>
              <div class="popover-button">
                <el-button type="primary" size="small" :disabled="taskForm.onlineInfo.environmentType && taskForm.onlineInfo.environmentType.includes('1')" @click="online('1', '1')">FAT</el-button>
                <el-button type="primary" size="small" :disabled="taskForm.onlineInfo.environmentType && taskForm.onlineInfo.environmentType.includes('2')" @click="online('1', '2')">生产</el-button>
              </div>
              <template #reference>
                <el-button type="primary">上线</el-button>
              </template>
            </el-popover>
            <el-popover trigger="click" width="250px" placement="top">
              <p class="popover-p">需要下线哪个服务?</p>
              <div class="popover-button">
                <el-button type="primary" size="small" :disabled="!taskForm.onlineInfo.environmentType || !taskForm.onlineInfo.environmentType.includes('1')" @click="online('2', '1')">FAT</el-button>
                <el-button type="primary" size="small" :disabled="!taskForm.onlineInfo.environmentType || !taskForm.onlineInfo.environmentType.includes('2')" @click="online('2', '2')">生产</el-button>
              </div>
              <template #reference>
                <el-button type="primary">下线</el-button>
              </template>
            </el-popover>
            <p v-if="taskForm.onlineInfo.msg" style="color: red; line-height: 20px; width: 100%;">{{ taskForm.onlineInfo.msg }}</p>
          </el-form-item>
          <el-form-item label="关联项目">
            <el-select size="small" v-model="taskForm.relations" multiple filterable placeholder="关联项目后，会复用项目已有规则" style="width: 100%;">
              <el-option v-for="item in taskList" :key="item._id" :label="item.name" :value="item._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场景标签配置" prop="config">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input
                  v-model="taskForm.config"
                  type="textarea"
                  rows="16"
                  placeholder='[{"type":"scene","type_zh":"scene_zh","type_en":"scene_en","child":[{"type":"tag","type_zh":"tag_zh","type_en":"tag_en"}]}]'
                ></el-input>
              </el-col>
              <el-col :span="12">
                <p style="color: red; line-height: 20px;">PS:场景标签有固定名称，不能随意修改，不同场景下可以存在相同名称标签。</p>
                <el-scrollbar height="300px">
                  <el-tree :data="treeData" :props="treeProps" :default-expand-all="true">
                    <template #default="{data}">
                      <span v-if="data.type_en && data.type_zh">
                        {{ data.type + ' (' + data.type_zh + '|' + data.type_en + ')' }}
                      </span>
                      <span v-else-if="data.type_en || data.type_zh">
                        {{ data.type + '(' + (data.type_en ?? data.type_zh) + ')' }}
                      </span>
                      <span v-else>
                        {{ data.type }}
                      </span>
                    </template>
                  </el-tree>
                </el-scrollbar>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="save(taskFormRef)">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-alert :title="taskForm.status" :closable="false" type="info" style="margin-bottom: 20px;"></el-alert>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="选择标注人员" name="1">
            <el-checkbox-group v-model="checkUser">
              <el-row>
                <el-col :span="6" v-for="u in users">
                  <el-checkbox class="checkbox" :label="u.username" @change="userChange(u.username)"></el-checkbox>
                </el-col>
              </el-row>
            </el-checkbox-group>
          </el-collapse-item>
          <el-collapse-item title="流程详情" name="2">
            <el-table :data="processTable">
              <el-table-column label="流程" width="150px">
                <template #default="scope">
                  {{ processName[scope.row.name] }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="150px">
                <template #default="scope">
                  <el-select size="small" v-if="scope.row.state" v-model="scope.row.state">
                    <el-option v-for="(i, k) in state" :key="k" :value="k" :label="i"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="文件">
                <template #default="scope">
                  <div v-for="file in scope.row.files" :key="file">
                    <el-link type="primary" class="file-link" @click="download(scope.row.name, file)">{{ file }}</el-link>
                    <el-popconfirm title="确定要删除文件吗？" @confirm="removeFile(scope.row.name, file)">
                      <template #reference>
                        <el-button text>
                          <el-icon>
                            <Delete></Delete>
                          </el-icon>
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-popconfirm v-if="scope.row.state" title="是否要手动更改状态？" @confirm="changeProcess(scope.row)">
                    <template #reference>
                      <el-button size="small" class="process-button">保存</el-button>
                    </template>
                  </el-popconfirm>
                  <el-popconfirm v-if="scope.row.state" title="是否要启动流程？" @confirm="createProcess(scope.row.name)">
                    <template #reference>
                      <el-button size="small" class="process-button" v-if="scope.row.name === 'complete'" :disabled="true">生成规则</el-button>
                      <el-button size="small" class="process-button" v-else :disabled="isUdeway(scope.row.state)">启动流程</el-button>
                    </template>
                  </el-popconfirm>
                  <el-button size="small" class="process-button" @click="clickUpload(scope.row.name)">手动上传文件</el-button>
                  <el-button size="small" class="process-button" v-if="scope.row.name === 'complete'" @click="clickUploadData('tag')">上传规则</el-button>
                  <el-button size="small" class="process-button" v-if="scope.row.name === 'complete'" @click="copyTagDataVisble = true">复用规则</el-button>
                  <el-button size="small" class="process-button" v-if="scope.row.name === 'complete'" @click="changeTagVisble = true">更新规则</el-button>
                  <el-button size="small" class="process-button" v-if="scope.row.name === 'similar'" @click="clickUploadData('similar')">上传相似度结果</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
          <el-collapse-item title="已标注的标签" name="3">
            <div style="margin-top: 30px;">
              <el-button size="small" @click="getAllTagDict">获取系统中的所有tag配置</el-button>
              <el-row :gutter="20">
                <el-col :span="12" v-show="dbConfig">
                  <el-input
                    size="small"
                    v-model="dbConfig"
                    type="textarea"
                    rows="16"
                    placeholder='[{"type":"scene","type_zh":"scene_zh","type_en":"scene_en","child":[{"type":"tag","type_zh":"tag_zh","type_en":"tag_en"}]}]'
                  ></el-input>
                </el-col>
                <el-col :span="12" v-show="dbConfig">
                  <el-scrollbar height="300px">
                    <el-tree :data="dbTreeData" :props="treeProps" :default-expand-all="true">
                      <template #default="{data}">
                        <span v-if="data.type_en && data.type_zh">
                          {{ data.type + ' (' + data.type_zh + '|' + data.type_en + ')' }}
                        </span>
                        <span v-else-if="data.type_en || data.type_zh">
                          {{ data.type + '(' + (data.type_en ?? data.type_zh) + ')' }}
                        </span>
                        <span v-else>
                          {{ data.type }}
                        </span>
                      </template>
                    </el-tree>
                  </el-scrollbar>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-dialog v-model="newVersionVisble" title="创建了新的版本" width="30%" top="100px">
      <el-space direction="vertical" alignment="left">
        <span>正在对项目创建新的版本</span>
        <span>当前的项目为：{{ taskForm.taskName }}</span>
        <span>当前的版本信息为：{{ lastVersion }}</span>
        <span>新的版本为：{{ taskForm.version }}</span>
        <span>
          是否复用最后版本的标签结果:
          <el-radio-group v-model="useLastVersion">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </span>
      </el-space>
      <template #footer>
        <el-button size="small" @click="cancelChangeVersion">取消创建</el-button>
        <el-button size="small" @click="addVersion">创建新版本</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="uploadFileVisble" title="文件上传" width="60%" top="100px">
      <el-form label-width="120px">
        <el-form-item label="上传目标路径">
          <el-select size="small" v-model="uploadFolder">
            <el-option v-for="(i, r) in processName" :key="r" :label="i" :value="r"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            ref="uploadRef"
            accept="text/plain,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            action=""
            multiple
            :auto-upload="false"
            :file-list="fileList"
            :before-upload="handleAvatarBefore"
            :on-success="handleAvatarSuccess"
            :http-request="uploadFileAction"
          >
            <template #trigger>
              <el-button size="small" class="upload-button" type="primary">选择上传文件</el-button>
            </template>
            <template #tip>
              <div class="el-upload__tip">
                上传相同文件名的文件会覆盖之前的文件，请注意.
              </div>
            </template>
            <el-button size="small" class="upload-button" type="success" @click="submitUpload">
              上传文件
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="uploadDataVisble" title="手动上传规则或相似度结果到数据库中" width="60%" top="100px">
      <el-upload
        ref="uploadDataRef"
        action=""
        multiple
        accept="text/plain"
        :auto-upload="false"
        :file-list="dataFileList"
        :before-upload="handleAvatarBefore"
        :on-success="handleAvatarSuccess"
        :http-request="uploadDataFileAction"
      >
        <template #trigger>
          <el-button size="small" class="upload-button" type="primary">选择上传文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            <el-space direction="vertical" alignment="left">
              <span>上传文件前请确认文件格式是否正确！</span>
              <template v-if="uploadMode === 'tag'">
                <span>正在上传场景挖掘规则</span>
                <span>文件内容必须为以下形式(snippet scnen tag)，用Tab键隔开，例如：</span>
                <span>一行为一个规则</span>
                <span>促进孩子生长发育 by_decision 产品功能</span>
                <span>shrink by_decision 缩水</span>
              </template>
              <template v-if="uploadMode === 'similar'">
                <span>正在上传相似度结果</span>
                <span>文件内容必须为以下形式(snippet scnen tag value)，用Tab键隔开，例如：</span>
                <span>一行为一个规则</span>
                <span>促进孩子生长发育 by_decision 产品功能 0.654321</span>
                <span>shrink by_decision 缩水 0.98374</span>
              </template>
            </el-space>
          </div>
        </template>
        <el-button size="small" class="upload-button" type="success" @click="submitUploadData">
          上传文件
        </el-button>
      </el-upload>
    </el-dialog>
    <el-dialog v-model="copyTagDataVisble" title="从其他任务复用规则" width="60%">
      <el-form label-width="120px">
        <el-form-item label="项目名">
          <el-select v-model="copyTagQuery.copy_id" filterable placeholder="请选择要复用的规则" @change="getCopyTidTags">
            <el-option v-for="item in taskList" :key="item._id" :label="item.name" :value="item._id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重命名场景">
          <el-input v-model="copyTagQuery.replace_scene" :disabled="inputDisable" placeholder="只有在复用一个标签时可用"></el-input>
        </el-form-item>
        <el-form-item label="重命名标签">
          <el-input v-model="copyTagQuery.replace_tag" :disabled="inputDisable" placeholder="只有在复用一个标签时可用"></el-input>
        </el-form-item>
        <el-form-item label="标签" v-if="copyTagQuery.copy_id">
          <el-checkbox v-model="checkTagAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <template v-if="copyTaskConfig">
            <template v-for="scene in copyTaskConfig.config">
              <div style="width: 100%;">
                <el-tag v-if="copyTagQuery.tags.find((e:string)=>e.split('#')[0]===scene.type)" size="small" type="info" @click="chooseScene(scene.type)">
                  {{ scene.type }}
                </el-tag>
                <el-tag v-else size="small" @click="cancelScene(scene.type)">{{ scene.type }}</el-tag>
                <el-checkbox-group v-model="copyTagQuery.tags" @change="handleCheckedChange">
                  <el-checkbox v-for="tag in scene.child" :label="`${scene.type}#${tag.type}`" :key="`${scene.type}#${tag.type}`">{{ tag.type }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
          </template>
        </el-form-item>
        <el-form-item>
          <el-popconfirm title="是否复用以上规则" @confirm="copyTag">
            <template #reference>
              <el-button>复用规则</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-model="changeTagVisble" title="规则处理" width="60%" @close="cleanChangeTag">
      <el-form label-width="120px">
        <el-form-item label="场景">
          <el-select v-model="changeTag.scene" allow-create filterable default-first-option>
            <el-option v-for="scene in JSON.parse(taskForm.config)" :label="scene.type" :value="scene.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-space>
            <el-select v-model="changeTag.tag" allow-create filterable default-first-option>
              <el-option v-for="tag in JSON.parse(taskForm.config).find((e:any) => e.type === changeTag.scene)?.child" :value="tag.type" :label="tag.type"></el-option>
            </el-select>
            <el-button v-if="changeTag.scene && changeTag.tag" @click="changeTagSearch">查询</el-button>
            <el-alert v-if="changeTag.count" class="count-alert" type="success" :description="`规则数量为：${changeTag.count}`" :closable="false"></el-alert>
            <el-alert v-if="changeTag.count === 0" class="count-alert" type="info" :description="`规则数量为：${changeTag.count}`" :closable="false"></el-alert>
          </el-space>
        </el-form-item>
        <el-form-item label="重命名场景" v-if="changeTag.count">
          <el-input v-model="changeTag.replace_scene" placeholder="请输入重命名场景，删除标签可不输入"></el-input>
        </el-form-item>
        <el-form-item label="重命名标签" v-if="changeTag.count" placeholder="请输入重命名标签，删除标签可不输入">
          <el-input v-model="changeTag.replace_tag" placeholder="请输入重命名场景，删除标签可不输入"></el-input>
        </el-form-item>
        <el-form-item v-if="changeTag.count">
          <el-popconfirm title="是否删除以上规则" @confirm="removeTagClick">
            <template #reference>
              <el-button>删除规则</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm title="是否更新以上规则名称" @confirm="changeTagClick">
            <template #reference>
              <el-button>更改名称</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { logInfo } from '@/utils'
import { onMounted, reactive, ref, watch } from 'vue'
import SceneMiningServer from './api/sceneMining'
import { ElMessage } from 'element-plus'
import type { UploadInstance, FormInstance } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import downloadFile from '@/utils/downloadFile'
import manageServe from '../Manage/api/manage'
interface Task {
  taskName: string
  status: string
  relations: Array<string>
  version: string | undefined
  onlineVersion: string
  versions: Array<string>
  config: string
  process: any
  onlineInfo: any
}
const taskForm: Task = reactive({
  taskName: '',
  status: '',
  relations: [],
  version: undefined,
  onlineVersion: '',
  versions: [],
  config: '',
  process: {},
  onlineInfo: {}
})
const taskRules = reactive({
  taskName: [{ required: true, message: '请输入项目', trigger: 'blur' }],
  version: [{ required: true, message: '请输入项目版本', trigger: 'blur' }]
})
/**
 * 初始化，从url中获取tid,并获取任务信息
 */
const route = useRoute()
const router = useRouter()
const tid = ref('')
const init = async () => {
  tid.value = route.params.tid.toString()
  if (tid.value === '0') {
    const now = new Date()
    const newVersion = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}01`
    taskForm.version = newVersion
    taskForm.versions.push(newVersion)
    return
  }
  // 获取人员名单和配置的标注人员
  getUsers()
  // 获取所有的项目
  const tasksRes = await SceneMiningServer.getStates({})
  taskList.value = tasksRes.data.reverse()
  // 获取项目信息
  const res = await SceneMiningServer.getStates({ tid: tid.value })
  taskForm.taskName = res.data.name
  taskForm.status = res.data.status
  taskForm.version = res.data.version
  taskForm.versions = res.data.versions.reverse()
  taskForm.relations = res.data.relations
  taskForm.process = res.data.process
  taskForm.onlineInfo = res.data.onlineInfo ?? {}
  taskForm.onlineVersion = res.data.online_version ?? ''
  processToArray()
  taskForm.config = JSON.stringify(res.data.config,null, 2)
  lastVersion.value = res.data.version
}
/**
 * 将process转化为array结构,用于table
 */
const processTable = ref([] as any)
const processToArray = () => {
  processTable.value.splice(0, processTable.value.length + 1)
  for (const key in taskForm.process) {
    processTable.value.push({ name: key, state: taskForm.process[key].state, files: taskForm.process[key].files })
  }
}
// 流程状态
const state = {
  '0': '流程未启动',
  '1': '已完成该流程',
  '-1': '流程出错或异常',
  '2': '流程已创建',
  '3': '流程进行中'
}
const processName = {
  data: '原始数据',
  clean: '清洗环节',
  similar: '相似度计算环节',
  complete: '最终文件'
} as any
/**
 * 进行中的流程不能启动流程
 */
const isUdeway = (state: string) => (['2', '3'].includes(state) ? true : false)
/**
 * 启动创建流程
 */
const createProcess = async (mode: string) => {
  const data = { tid: tid.value, mode: mode }
  const res = await SceneMiningServer.process(data)
  if (res.status === 200) {
    ElMessage.success('流程创建成功，请等耐完成')
    init()
  }
}
/**
 * 手动修改流程状态
 */
const changeProcess = async (row: any) => {
  const data = { tid: tid.value, mode: row.name, state: row.state }
  const res = await SceneMiningServer.changeProcess(data)
  ElMessage.success('修改状态成功')
}
/**
 * 创建或保存任务
 */
const taskFormRef = ref()
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data = { tid: tid.value, name: taskForm.taskName, version: taskForm.version, relations: taskForm.relations, config: taskForm.config ? JSON.parse(taskForm.config) : [] }
      const res = await SceneMiningServer.save(data)
      tid.value = res.data._id
      const route = router.resolve({ name: 'sceneTask', params: { tid: tid.value.toString() } })
      window.location.href = route.href
      ElMessage.success('保存或创建任务成功！')
    }
  })
}

// 项目最后的版本信息
const lastVersion = ref('')
const newVersionVisble = ref(false)
const useLastVersion = ref(true)
/**
 * 如果创建新版本，通过对话框确认
 */
const versionSeleteChange = async (value: string) => {
  // 判断当前选中的version是否在versions中，不在则是创建新的版本，需要二次确认
  if (lastVersion.value && taskForm.versions.indexOf(value) === -1) {
    newVersionVisble.value = true
  }
}

/**
 * 取消更新版本
 */
const cancelChangeVersion = () => {
  newVersionVisble.value = false
  taskForm.version = lastVersion.value
}

/**
 * 新增项目版本
 */
const addVersion = async () => {
  const data = { tid: tid.value, version: taskForm.version, useLastVersion: useLastVersion.value }
  const res = await SceneMiningServer.addVersion(data)
  if (res.status === 200) {
    ElMessage.success('新增项目版本成功,请等待1-2分钟')
    taskForm.versions.push(taskForm.version)
  }
  newVersionVisble.value = false
}
/**
 * 指标树
 */
interface Tree {
  type: string
  type_zh?: string
  type_en?: string
  enable?: boolean
  child?: Tree[]
}
const treeData = ref<Tree[]>([])
const treeProps = {
  label: 'type',
  children: 'child'
}
/**
 * 指标配置->指标树结构
 */
const configToTree = (data: any, tree: any) => {
  try {
    const task_config = JSON.parse(data)
    tree.splice(0, tree.length + 1, ...task_config)
  } catch (err) {
    ElMessage.error('错误的指标结构')
  }
}
// 监听指标树变化
watch(
  () => taskForm.config,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      configToTree(taskForm.config, treeData.value)
    }
  }
)
// 所有的项目
const taskList = ref()
/**
 * 文件上传
 */
const uploadFolder = ref('')
const uploadFileVisble = ref(false)
const uploadRef = ref<UploadInstance>()
const fileList = ref()
// 点击文件上传
const clickUpload = (folder: string) => {
  uploadFolder.value = folder
  uploadFileVisble.value = true
}
const submitUpload = () => {
  uploadRef.value!.submit()
}
/**
 * 推送文件
 */
const uploadFileAction = async (files: any) => {
  const uploadForm = new FormData()
  uploadForm.append('files', files.file)
  uploadForm.append('tid', tid.value)
  uploadForm.append('folder', uploadFolder.value)
  SceneMiningServer.upload(uploadForm)
}
const handleAvatarSuccess = (response: any, uploadFile: any) => {
  ElMessage.success(`${uploadFile.name} 上传文件成功`)
}
const handleAvatarBefore = (file: any) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
  const whiteList = ['txt', 'xlsx', 'xls', 'csv']
  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage.error(`上传的文件只能是${whiteList.join(',')}`)
    return false
  }
}
/**
 * 关闭文件上传对话框时，清空已经上传文件
 */
watch(uploadFileVisble, (newValue, oldValue) => {
  if (!newValue && newValue !== oldValue) {
    uploadRef.value!.clearFiles()
  }
})
/**
 * 删除文件
 */
const removeFile = async (folder: string, file: string) => {
  const res = await SceneMiningServer.removeFile(tid.value, folder, file)
  if (res.status === 200) {
    ElMessage.success('文件删除成功')
    init()
  }
}
/**
 * 文件下载
 */
const download = (folder: string, file: string) => {
  const url = `/api/scene/task/download/${tid.value}/${folder}/${file}`
  downloadFile(url, file, 'get', undefined)
}
/**
 * 上传规则或相似度结果
 */

const dataFileList = ref()
const uploadDataRef = ref<UploadInstance>()
const uploadDataVisble = ref(false)
const uploadMode = ref('')
const clickUploadData = (mode: string) => {
  uploadMode.value = mode
  uploadDataVisble.value = true
}
const submitUploadData = () => {
  uploadDataRef.value!.submit()
}
const uploadDataFileAction = async (files: any) => {
  const uploadForm = new FormData()
  uploadForm.append('files', files.file)
  uploadForm.append('tid', tid.value)
  if (uploadMode.value === 'tag') {
    const res = SceneMiningServer.uploadTag(uploadForm)
  } else if (uploadMode.value === 'similar') {
    const res = SceneMiningServer.uploadSimilar(uploadForm)
  } else {
    ElMessage.error('错误的上传类型')
  }
}
/**
 * 关闭文件上传对话框时，清空已经上传文件
 */
watch(uploadDataVisble, (newValue, oldValue) => {
  if (!newValue && newValue !== oldValue) {
    uploadDataRef.value!.clearFiles()
  }
})
const dbConfig = ref()
const dbTreeData = ref([])
const getAllTagDict = async () => {
  const res = await SceneMiningServer.checkTag(tid.value)
  dbConfig.value = JSON.stringify(res.data.config, null, 2)
  configToTree(dbConfig.value, dbTreeData.value)
}
/**
 * 复用规则
 */
const copyTagDataVisble = ref(false)
interface copyTagQueryType {
  copy_id: string
  tags: Array<string>
  replace_scene: string
  replace_tag: string
}
const copyTagQuery: copyTagQueryType = reactive({
  copy_id: '',
  tags: [],
  replace_tag: '',
  replace_scene: ''
})

const copyTag = async () => {
  const data = {} as any
  data.copy_tid = copyTagQuery.copy_id
  if (copyTagQuery.replace_scene !== '') {
    data.replace_scene = copyTagQuery.replace_scene
    data.replace_tag = copyTagQuery.replace_tag
  }
  data.tags = copyTagQuery.tags.map((e: string) => {
    return {
      scene: e.split('#')[0],
      tag: e.split('#')[1]
    }
  })
  logInfo(data)
  const res = await SceneMiningServer.copyTag(tid.value, data)
  if (res.status === 200) {
    ElMessage.success('复用成功，请等待数据拷贝完成')
  }
}
/**
 * 更新复用标签选择
 */
const checkTagAll = ref(false)
const isIndeterminate = ref(false)
const handleCheckAllChange = (val: boolean) => {
  copyTagQuery.tags = val ? copyTaskConfig.value.list.map((e: any) => `${e.scene}#${e.tag}`) : []
  isIndeterminate.value = false
}
const inputDisable = ref(true)
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length
  checkTagAll.value = checkedCount === copyTaskConfig.value.list.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < copyTaskConfig.value.list.length
  logInfo(copyTagQuery.tags)
  if (checkedCount !== 1) {
    inputDisable.value = true
    copyTagQuery.replace_scene = ''
    copyTagQuery.replace_tag = ''
  } else {
    inputDisable.value = false
    copyTagQuery.replace_scene = value[0].split('#')[0]
    copyTagQuery.replace_tag = value[0].split('#')[1]
  }
}
const copyTaskConfig = ref()
const getCopyTidTags = async (value: string) => {
  const res = await SceneMiningServer.checkTag(value)
  copyTaskConfig.value = res.data
  copyTagQuery.tags.splice(0, copyTagQuery.tags.length + 1)
}
const chooseScene = (scene: string) => {
  const newTag = copyTaskConfig.value.list.filter((e: any) => e.scene === scene && copyTagQuery.tags.indexOf(`${e.scene}#${e.tag}`) === -1).map((e: any) => `${e.scene}#${e.tag}`)
  newTag.forEach((element: string) => {
    copyTagQuery.tags.push(element)
  })
  handleCheckedChange(copyTagQuery.tags)
}
const cancelScene = (scene: string) => {
  const newTag = copyTagQuery.tags.filter((e: string) => e.split('#')[0] !== scene)
  copyTagQuery.tags = newTag
  handleCheckedChange(copyTagQuery.tags)
}
/**
 * 设置线上版本为当前标注版本
 */
const setOnlineVersion = async () => {
  const res = await SceneMiningServer.setOnlineVersion(tid.value)
  if (res.status === 200) {
    ElMessage.success('设置线上版本成功')
    init()
  }
}
/**上线/下线申请 */
const online = async (operationType: string, environmentType: string) => {
  const data = { tid: tid.value, projectName: taskForm.taskName, versionNo: taskForm.version, operationType: operationType, environmentType: environmentType }
  const res = await SceneMiningServer.online(data)
  if (res.status === 200) {
    ElMessage.success('发起上线/下线审核成功,请通知相关人员审核!')
  }
}
/**
 * 规则处理，删除或修改名称
 */
const changeTag = reactive({
  scene: undefined,
  tag: undefined,
  count: undefined,
  replace_scene: undefined,
  replace_tag: undefined
})
const changeTagVisble = ref(false)
/**
 * 查询对应的数据量
 */
const changeTagSearch = async () => {
  const res = await SceneMiningServer.tagCount(tid.value, { scene: changeTag.scene, tag: changeTag.tag })
  changeTag.count = res.data.count
  if (changeTag.count !== 0) {
    changeTag.replace_scene = changeTag.scene
    changeTag.replace_tag = changeTag.tag
  }
}
/**
 * 删除tag
 */
const removeTagClick = async () => {
  const res = await SceneMiningServer.removeTag(tid.value, { scene: changeTag.scene, tag: changeTag.tag })
  if (res.status === 200) {
    ElMessage.success('规则删除成功')
  }
}
/**
 * 更新tag名称
 */
const changeTagClick = async () => {
  // 判断是否输入重命名场景和标签
  if (changeTag.replace_scene && changeTag.replace_tag) {
    const res = await SceneMiningServer.changeTag(tid.value, changeTag)
    if (res.status === 200) {
      ElMessage.success('规则重命名成功')
    }
  } else {
    ElMessage.warning('修改名称请输入新的场景和标签名称')
  }
}
/**
 * 关闭对话框清除数据
 */
const cleanChangeTag = () => {
  changeTag.scene = undefined
  changeTag.tag = undefined
  changeTag.count = undefined
  changeTag.replace_scene = undefined
  changeTag.replace_tag = undefined
}
/**获取用户信息 */
const users = ref<any[]>([]) //所有的用户
const checkUser = ref<string[]>([]) //选中的用户
const getUsers = async () => {
  // 加载所有的有效用户以及当前任务的人员
  const res = await manageServe.getUser({ filter: { roles: ['scene_manager', 'scene_annotator'], disabled: false } })
  users.value = res.data
  if (tid.value && tid.value !== '0') {
    const member = await SceneMiningServer.getMembers({ tid: tid.value })
    checkUser.value = member.data
  }
}
const userChange = async (user: string) => {
  //用户变更
  if (checkUser.value.indexOf(user) == -1) {
    const cancel_menber = await SceneMiningServer.deleteMember({ tid: tid.value, name: user })
    logInfo('取消了', user)
  } else {
    const cancel_menber = await SceneMiningServer.addMember({ tid: tid.value, name: user })
    logInfo('新增了', user)
  }
}
/**collapse */
const activeNames = ref(['1', '2', '3'])
onMounted(() => {
  init()
})
</script>
<style scoped>
.file-link {
  padding-right: 10px;
}
.upload-button {
  margin: 0 10px 0 10px;
}
.process-button {
  margin: 0 5px 0 5px;
}

.count-alert {
  margin: 0;
  padding: 0;
}
.popover-p {
  font-size: 10px;
}
.popover-p-red {
  color: red;
  font-size: 8px;
}
.popover-button {
  text-align: right;
  margin-top: 10px;
}
</style>
