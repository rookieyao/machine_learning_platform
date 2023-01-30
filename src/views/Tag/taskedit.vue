<style scoped>
.check-label {
  flex: 0 0 auto;
  text-align: right;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  font-weight: 700;
}
.checkbox {
  padding-top: 3px;
}
.el-divider--horizontal {
  margin: 1px;
  font-size: 1px;
  background-color: #606266;
}
.collapse-title {
  font-size: 14px;
  color: black;
  font-weight: bold;
}
#taskedit {
  padding-top: 30px;
}
.trinity-upload {
  width: 100%;
  padding-top: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
<template>
  <div id="taskedit">
    <el-row>
      <!-- 左边配置项 -->
      <el-col :span="11">
        <el-form ref="taskFormRef" :model="taskForm" :rules="taskRules" label-width="120px">
          <el-form-item label="标注任务名" prop="taskName">
            <el-input v-model="taskForm.taskName" :disabled="!role"></el-input>
          </el-form-item>
          <el-form-item label="标注类型" prop="taskType">
            <el-select v-model="taskForm.taskType" :disabled="!role">
              <el-option value="0" label="细粒度情感"></el-option>
              <el-option value="1" label="3级情感(通用感情)"></el-option>
            </el-select>
            <el-button v-if="taskForm.taskType === '0'" text type="primary" @click="groupTagVisible = !groupTagVisible">指标分类</el-button>
            <el-popconfirm title="是否根据配置中的annotation_type更新所有标注数据，如果没有配置上的标签annotation_type默认为空" width="200px" @confirm="updateAnnotationType">
              <template #reference>
                <el-button v-if="taskForm.taskType === '0'" text type="primary" :disabled="taskForm.annotationTypeStatus === '1'">{{
                  taskForm.annotationTypeStatus === '1' ? '更新指标分类(正在更新)' : '更新指标分类'
                }}</el-button>
              </template>
            </el-popconfirm>
          </el-form-item>
          <el-form-item label="配置文件" prop="taskConfig">
            <el-row>
              <el-col :span="12">
                <el-input v-model="taskForm.taskConfig" type="textarea" placeholder="这里一定要填写指标配置数据" :disabled="!role" rows="16"></el-input>
              </el-col>
              <el-col :span="11" :offset="1">
                <p style="color: red; line-height: 20px;">PS:一级指标之间不能重复，二级指标之间不能重复，非必要条件下二级指标中不使用"-"和空格。</p>
                <el-scrollbar height="300px">
                  <el-tree :data="treeData" :props="treeProps" :default-expand-all="true">
                    <template #default="{node,data}">
                      <span v-if="data.type_en && data.type_zh">
                        {{ data.type + ' (' + data.type_zh + '|' + data.type_en + ')' }}
                      </span>
                      <span v-else-if="data.type_en || data.type_zh">
                        {{ data.type + '(' + (data.type_en ?? data.type_zh) + ')' }}
                      </span>
                      <span v-else>
                        {{ data.type }}
                      </span>
                      <span v-if="data.annotation_type"> - {{ data.annotation_type }}</span>
                    </template>
                  </el-tree>
                </el-scrollbar>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="标签" prop="taskTag">
            <el-select v-model="taskForm.taskTags" multiple allow-create filterable default-first-option :disabled="!role">
              <el-option v-for="t in tags" :key="t" :label="t" :value="t"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="相似推荐接口" prop="qsearchProjectId">
            <el-input v-model="taskForm.qsearchProjectId" :disabled="!role" style="width: 40%;"></el-input>
            <el-tooltip effect="light" placement="top">
              <template #content>
                <p>直接创建/插入会自动生成推荐接口,其他项目使用相同推荐项目只需要复制接口名称并保存配置即可</p>
              </template>
              <el-button :disabled="(searchProject && searchProject.status === '0') || !role || tid === '0'" @click="insertSim(false)" style="margin-left: 10px;">创建/插入相似推荐</el-button>
            </el-tooltip>
            <el-button :disabled="(searchProject && searchProject.status === '0') || !role || tid === '0'" @click="insertSim(true)">重置相似推荐</el-button>
            <div class="trinity-upload">
              <el-upload action="" accept=".txt" :limit="1" :http-request="uploadTrinitySearch" :on-exceed="handleExceed" :before-upload="beforeUpload">
                <el-tooltip effect="light" placement="top">
                  <template #content>
                    <p>上传文件只能是txt,一行为一个片段加一个指标,用TAB键隔开,例如</p>
                    <p>物流和服务都很好 物流</p>
                    <p>物流和服务都很好 服务</p>
                    <p>服务很好 服务</p>
                  </template>
                  <el-button :disabled="(searchProject && searchProject.status === '0') || !role || tid === '0'">通过文件上传预标注片段</el-button>
                </el-tooltip>
              </el-upload>
            </div>
            <span v-if="searchProject && searchProject.message">{{ searchProject.message }}</span>
            <div v-if="searchProject && searchProject.status === '0'">
              <span style="color: red;">数据正在插入中，请勿重复插入({{ searchProject.current }}/{{ searchProject.total }})</span>
            </div>
          </el-form-item>
          <el-form-item label="关联任务" prop="qsearchProjectId">
            <el-input v-model="taskForm.relatedTid" placeholder="关联任务，用于检查质量小助手，用逗号,区分任务" :disabled="!role"></el-input>
          </el-form-item>
          <el-form-item label="帮助说明" prop="taskGuide">
            <el-input v-model="taskForm.taskGuide" type="textarea" rows="6" :disabled="!role"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="save()">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 右边配置项 -->
      <el-col :span="11" :offset="1">
        <el-collapse v-model="activeCollapse" @change="rightCollapseChange">
          <el-collapse-item v-if="role" title="指标变更" name="tagChange">
            <div>
              <el-select v-model="changeTag" clearable filterable allow-create default-first-option @change="getTagCount">
                <template v-for="firstTag in treeData">
                  <el-option v-for="secondTag in firstTag.child" :value="secondTag.type" :label="secondTag.type"></el-option>
                </template>
              </el-select>
              <span v-if="changeTag">【{{ changeTag }}】指标共有 {{ changeTagCount }} 条数据。</span>
            </div>
            <div v-if="changeTagCount !== 0" style="padding-top: 10px;">
              <el-input v-model="newTag" placeholder="更新的新指标，删除指标留空即可" style="width: 300px;"></el-input>
              <el-popconfirm :title="`是否将${changeTagCount}条【${changeTag}】修改为【${newTag}】？`" confirm-button-text="修改" @confirm="tagChange">
                <template #reference>
                  <el-button type="primary" style="margin-left: 10px;">修改</el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm :title="`是否将【${changeTag}】指标结果删除？`" confirm-button-text="删除" @confirm="tagDelete">
                <template #reference>
                  <el-button type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="role || reviewer_role" title="选择标注人员" name="checkUser">
            <el-checkbox-group v-model="checkUser">
              <el-row>
                <el-col :span="6" v-for="u in users" :key="u.name">
                  <el-checkbox class="checkbox" :label="u.name" @change="userChange(u.name)"></el-checkbox>
                </el-col>
              </el-row>
            </el-checkbox-group>
          </el-collapse-item>
          <el-collapse-item v-if="role" title="标注数据导入" name="upload">
            <div id="uploadfile">
              <span class="check-label">标注数据导入</span>
              <div class="section">
                <el-upload
                  class="upload-demo"
                  drag
                  action=""
                  accept=".txt"
                  :file-list="filelist"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :on-success="handelSuccess"
                  :before-upload="beforeUpload"
                  :http-request="uploadFile"
                >
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip">只能上传 txt 文件，且不超过 10mb</div>
                  </template>
                </el-upload>
                <el-button @click="pullData()" style="margin-top: 10px;">上传并推送</el-button>
              </div>
              <el-collapse v-model="activeNames" style="margin-top: 20px;">
                <el-collapse-item title="上传文件的数据(只展示10条)" name="1">
                  <template #title>
                    <span class="collapse-title">上传文件的数据(只展示10条)</span>
                  </template>
                  <div v-for="content in uploadData" :key="content">
                    <span>{{ content }}</span>
                    <el-divider></el-divider>
                  </div>
                </el-collapse-item>
                <el-collapse-item title="系统中已导入的数据(只展示10条)" name="2">
                  <template #title>
                    <span class="collapse-title">系统中已导入的数据(只展示10条)</span>
                  </template>
                  <div v-for="content in taskData" :key="content">
                    <span>{{ content }}</span>
                    <el-divider></el-divider>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="role" title="数据导出(只展示最近5次任务)" name="export">
            <div>
              <el-button @click="exportData('11')">导出原始数据(txt)</el-button>
              <el-button @click="exportData('12')">导出标注数据(csv)</el-button>
              <el-button type="primary" text @click="getJob">刷新</el-button>
            </div>
            <el-table :data="jobList" table-layout="auto">
              <el-table-column prop="name" label="任务"></el-table-column>
              <el-table-column prop="key" label="任务类型">
                <template #default="scope">
                  <span v-if="scope.row.key === '11'">导出原始数据</span>
                  <span v-if="scope.row.key === '12'">导出标注结果</span>
                </template>
              </el-table-column>
              <el-table-column prop="msg" label="状态"></el-table-column>
              <el-table-column prop="ctime" label="创建时间"></el-table-column>
              <el-table-column prop="utime" label="最后更新时间"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button v-if="scope.row.resultfile" text type="primary" @click="download(scope.row)">下载</el-button>
                  <el-button v-if="scope.row.status !== '1'" text type="primary" @click="restartJob(scope.row.id)">重置</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
    <el-dialog v-model="groupTagVisible" @open="openGroupTagDialog" @close="closeGroupTagDialog">
      <div>
        <div>
          <el-tag v-for="t in groupTagData.annotationTypeList" :type="groupTagData.selectAnnotationType === t ? '' : 'info'" @click="changeSelectAnnotationType(t)">{{ t }}</el-tag>
          <el-input v-if="groupTagData.isAddAnnotationType" v-model="groupTagData.addAnnotationType" size="small" @change="annOneAnnotationType" style="width: 100px; margin-left: 10px;">
            <template #append>
              <el-button size="small" :icon="Close" @click="groupTagData.isAddAnnotationType = !groupTagData.isAddAnnotationType" />
            </template>
          </el-input>
          <el-tag v-else type="success" @click="groupTagData.isAddAnnotationType = !groupTagData.isAddAnnotationType">
            <el-icon><Plus></Plus></el-icon>
          </el-tag>
        </div>
        <div>
          <el-checkbox v-model="checkGroupAll.all" @change="(val:any) => checkGroupAllChange(val, null)">全选</el-checkbox>
          <el-row v-for="firstTag in treeData">
            <el-col :span="5" style="line-height: 100%;">
              <el-checkbox v-model="checkGroupAll[firstTag.type]" @change="(val:any) => checkGroupAllChange(val, firstTag)">{{ firstTag.type }}(全选)</el-checkbox>
              <el-divider direction="vertical" style="height: 90%; float: right;" />
            </el-col>
            <el-col :span="18">
              <el-checkbox-group v-model="groupTagData.checkTag">
                <el-checkbox v-for="secondTag in firstTag.child" :label="`{'first':${firstTag.type},'second':${secondTag.type}}`">{{ secondTag.type }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch, nextTick } from 'vue'
import { logInfo } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import er2Service from './api/er2'
import taskService from './api/task'
import indexService from './api/index'
import { ElMessage } from 'element-plus'
import downloadFile from '@/utils/downloadFile'
import { Close } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'taskedit',
  setup() {
    const route = useRoute()
    const tid = ref('')
    interface Task {
      taskName: string
      taskType: string
      taskConfig: string
      taskTags: Array<string>
      qsearchProjectId: string
      relatedTid: string
      taskGuide: string
      top: string
      annotationTypeStatus: string
    }

    const taskForm: Task = reactive({
      taskName: '',
      taskType: '0',
      taskConfig: '',
      taskTags: [],
      qsearchProjectId: '',
      relatedTid: '',
      taskGuide: '',
      top: '',
      annotationTypeStatus: '0'
    })
    const taskRules = reactive({
      taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
      taskType: [{ required: true, message: '请选择任务类型', trigger: 'blur' }],
      taskConfig: [{ required: true, message: '请输入任务配置', trigger: 'blur' }]
    })
    const taskFormRef = ref()
    const tags = ref([])
    const router = useRouter()
    const save = async () => {
      taskFormRef.value.validate(
        async (valid: any): Promise<boolean> => {
          if (valid) {
            const data = {
              task_name: taskForm.taskName,
              task_type: taskForm.taskType,
              task_config: taskForm.taskConfig,
              task_guide: taskForm.taskGuide,
              task_tags: taskForm.taskTags,
              qsearch_project_id: taskForm.qsearchProjectId,
              related_tid: taskForm.relatedTid,
              top: taskForm.top
            }
            const res = await taskService.save(tid.value, data)
            if (res.status == 200) {
              ElMessage.success('保存成功')
              tid.value = res.data
              const route = router.resolve({ name: 'taskedit', params: { tid: tid.value.toString() } })
              window.location.href = route.href
              return true
            } else {
              ElMessage.warning(res.msg)
            }
          }
          return false
        }
      )
    }

    interface User {
      name: string
      role: string
    }
    const users = ref<User[]>([]) //所有的用户
    const checkUser = ref<string[]>([]) //选中的用户
    const getUsers = async () => {
      // 加载所有的有效用户以及当前任务的人员
      const res = await indexService.getUsernames({})
      users.value = res.data
      if (tid.value && tid.value !== '0') {
        const member = await taskService.get_members(tid.value)
        checkUser.value = member.data.map((m: any) => m.name)
      }
    }
    const userChange = async (user: string) => {
      //用户变更
      if (checkUser.value.indexOf(user) == -1) {
        const cancel_menber = await taskService.delete_member(tid.value, { name: user })
        logInfo('取消了', user)
      } else {
        const cancel_menber = await taskService.add_member(tid.value, { name: user })
        logInfo('新增了', user)
      }
    }
    // 折叠面板切换
    const activeNames = ref(['1', '2'])
    const taskData = ref<string[]>([]) // 标注任务展示数据前十
    const uploadData = ref<string[]>([]) //上传任务展示数据前十
    const getTaskData = async () => {
      // 加载任务中的标注数据，只展示10条
      const res = await taskService.stask_data(tid.value)
      taskData.value = res.data.map((e: any) => e.content)
    }
    const searchProject = ref()
    const init = async () => {
      // 初始化任务，读取已有配置
      getUsers()
      tid.value = route.params.tid.toString()
      if (tid.value === '0') {
        return
      }
      const res = await er2Service.getOneTask(tid.value)
      taskForm.taskName = res.data.name
      taskForm.taskType = res.data.type
      taskForm.taskConfig = res.data.config
      taskForm.taskGuide = res.data.guide
      taskForm.taskTags = res.data.tags
      taskForm.qsearchProjectId = res.data.project_id
      taskForm.relatedTid = res.data.related_tid
      taskForm.top = res.data.top
      taskForm.annotationTypeStatus = res.data.annotation_type_status
      if (res.data.project_id) {
        getSearchProject()
      }
      const tags_res = await taskService.taskTag()
      tags.value = tags_res.data
      // 初始化用户，加载目前所有的有效用户

      getTaskData()
    }
    /**获取相似推荐任务信息 */
    const getSearchProject = async () => {
      const project_res = await taskService.getSearchProject({ project_name: taskForm.qsearchProjectId })
      searchProject.value = project_res.data
    }
    //文件上传
    const txt_file = ref()
    const uploadFile = async (file: any) => {
      // 上传数据并展示前十条，此时未将数据推送数据库只是为了展示
      txt_file.value = file
      const uploadForm = new FormData()
      uploadForm.append('file', file.file)
      const res = await indexService.uploadFileShow(uploadForm)
      uploadData.value = res.data
    }
    const beforeUpload = (file: any) => {
      const isTXT = file.type === 'text/plain'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isTXT) {
        ElMessage.error('只能上传txt格式文件')
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不得超过10M!')
      }
      return isTXT && isLt10M
    }
    const handelSuccess = (response: any, file: any, fileList: any) => {
      filelist.value = fileList
    }
    const handleExceed = () => {
      ElMessage.error('只能上传一个文件!')
    }
    const filelist = ref<any[]>([])
    const pullData = async () => {
      if (filelist.value.length === 0) {
        ElMessage.info('没有上传任何文件')
        return
      }
      const uploadForm = new FormData()
      uploadForm.append('file', txt_file.value.file)
      const res = await taskService.pull_data(tid.value, uploadForm)
      if (res.status == 200) {
        ElMessage.success('数据推送成功，共有 ' + res.data.count + ' 条数据!')
        // 上传任务成功后清楚标注任务和上传文件的数据预览
        filelist.value = []
        uploadData.value = []
      } else {
        ElMessage.error('数据推送失败，请重新推送或检查数据是否正确')
      }
    }
    /**相似推荐文件上传 */
    const uploadTrinitySearch = async (file: any) => {
      // 上传数据并展示前十条，此时未将数据推送数据库只是为了展示
      if (!taskForm.qsearchProjectId) {
        taskForm.qsearchProjectId = 'tagging_' + tid.value
        save()
      }
      const uploadForm = new FormData()
      uploadForm.append('file', file.file)
      uploadForm.append('project_name', taskForm.qsearchProjectId)
      const res = await er2Service.trinitInsertByTxt(uploadForm)
      if (res.status === 200) {
        ElMessage.success('相似推荐文件上传添加成功')
      }
    }
    // 指标树预览
    // 配置文件转指标树
    interface Tree {
      type: string
      type_zh?: string
      type_en?: string
      annotation_type?: string
      enable?: boolean
      child?: Tree[]
    }
    const treeData = ref<Tree[]>([])
    const treeProps = {
      label: 'type',
      children: 'child'
    }
    const configToTree = () => {
      try {
        const task_config = JSON.parse(taskForm.taskConfig)
        treeData.value.splice(0, treeData.value.length + 1, ...task_config)
        logInfo(treeData.value)
      } catch (err) {
        ElMessage.error('错误的指标结构')
      }
    }
    // 监听指标树变化
    watch(
      () => taskForm.taskConfig,
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          configToTree()
        }
      }
    )
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
    /**创建相似推荐任务并插入数据 */
    const insertSim = async (reset: boolean) => {
      // 判断tid是否存在
      if (tid.value === '0') return
      // 如果没有手动输入项目名称，则设置为默认名称，并更新标注任务配置
      if (!taskForm.qsearchProjectId) {
        taskForm.qsearchProjectId = 'tagging_' + tid.value
        save()
      }
      const data = {
        project_name: taskForm.qsearchProjectId,
        reset: reset,
        ensure_flush: false,
        tid: tid.value
      }
      const res = await er2Service.trinityInsertByTid(data)
      if (res.status === 200) {
        ElMessage.success('创建/插入相似推荐成功')
        getSearchProject()
      }
    }
    /**指标更改或删除 */
    const changeTag = ref('')
    const newTag = ref('')
    const changeTagCount = ref(0)
    /**计算需要更改指标的标注数据量 */
    const getTagCount = async (value: string) => {
      const res = await er2Service.countTag(tid.value, { tag: value })
      changeTagCount.value = res.data
    }
    /**修改指标 */
    const tagChange = async () => {
      const res = await er2Service.change(tid.value, { new_tag: newTag.value, old_tag: changeTag.value })
      if (res.status === 200) {
        ElMessage.success('指标修改成功')
        getTagCount(changeTag.value)
        newTag.value = ''
      }
    }
    /**指标删除 */
    const tagDelete = async () => {
      const res = await er2Service.deleteTag(tid.value, { tag: changeTag.value })
      if (res.status === 200) {
        ElMessage.success('指标删除成功')
        getTagCount(changeTag.value)
      }
    }
    /**右侧折叠面板 */
    const activeCollapse = ref<string[]>(['checkUser'])
    const rightCollapseChange = (activeNames: Array<string> | any) => {
      // 展开数据导出时没如果jobList没有数据，请求数据
      if (activeNames.includes('export') && !jobList.value) {
        getJob()
      }
    }
    /**获取任务的相关job任务 */
    const jobList = ref()
    const getJob = async () => {
      const res = await indexService.getJob(tid.value)
      jobList.value = res.data
    }
    /**导出数据 */
    const exportData = async (key: string) => {
      // '11'导出原始数据，'12'导出标注数据
      const data = {
        tid: tid.value,
        name: taskForm.taskName,
        type: key,
        filetype: key === '11' ? 'txt' : 'xlsx'
      }
      const res = await indexService.exportJob(data)
      if (res.status === 200) {
        ElMessage.success('数据导出中，请稍等')
        await nextTick()
        getJob()
      }
    }
    /**重置任务 */
    const restartJob = async (jid: string) => {
      const data = {
        jid: jid
      }
      const res = await indexService.restartJob(data)
      if (res.status === 200) {
        ElMessage.success('任务重置成功，请稍等')
        await nextTick()
        getJob()
      }
    }
    /**
     * 下载文件
     */
    const download = (row: any) => {
      const filename = row.resultfile
      downloadFile('/api/tools/datajob/download/' + filename, filename, 'get', undefined)
    }
    /**获取所有的annotationType和多选框组配置 */
    const getAnnotationType = () => {
      treeData.value.forEach((firstTag) => {
        if (firstTag.child) {
          firstTag.child.forEach((second) => {
            if (second.annotation_type && !groupTagData.annotationTypeList.includes(second.annotation_type)) {
              groupTagData.annotationTypeList.push(second.annotation_type)
            }
          })
        }
      })
    }
    /**指标分组 */
    const groupTagVisible = ref(false)
    const groupTagData = reactive({
      checkTag: <string[]>[],
      annotationTypeList: <string[]>['aspect', 'sentiment', 'intent', 'focus'],
      selectAnnotationType: 'aspect',
      addAnnotationType: '',
      isAddAnnotationType: false,
      checkTagCount: 0
    })
    /**选中标签 */
    const changeAnnotationTypeGroup = (val: boolean, tag: string) => {
      logInfo(val, groupTagData.selectAnnotationType, tag)
    }
    /**更改选中的annotation_type */
    const changeSelectAnnotationType = (value: string) => {
      // 想将当前页结果保存到config中
      changeTaskConfig()
      // 更新selectAnnotationType
      groupTagData.selectAnnotationType = value
      // 清空选中的标签
      groupTagData.checkTag = []
      openGroupTagDialog()
    }
    /**更新config数据 */
    const changeTaskConfig = () => {
      var config = JSON.parse(taskForm.taskConfig)
      for (let firstIndex = 0; firstIndex < config.length; firstIndex++) {
        const firstTag = config[firstIndex]
        for (let secondIndex = 0; secondIndex < firstTag.child.length; secondIndex++) {
          const secondTag = firstTag.child[secondIndex]
          if (groupTagData.checkTag.includes(`{'first':${firstTag.type},'second':${secondTag.type}}`)) {
            config[firstIndex].child[secondIndex].annotation_type = groupTagData.selectAnnotationType
          } else if (config[firstIndex].child[secondIndex].annotation_type && config[firstIndex].child[secondIndex].annotation_type === groupTagData.selectAnnotationType) {
            config[firstIndex].child[secondIndex].annotation_type = ''
          }
        }
      }
      taskForm.taskConfig = JSON.stringify(config, null, 2)
    }
    /**打开指标分类对话框 */
    const openGroupTagDialog = () => {
      getAnnotationType()
      // 通过当前选中的指标更新多选框
      groupTagData.checkTagCount = 0
      JSON.parse(taskForm.taskConfig).forEach((firstTag: any) => {
        checkGroupAll.value[firstTag.type] = false
        groupTagData.checkTagCount += firstTag.child.length
        var count = 0
        firstTag.child.forEach((secondTag: any) => {
          if (secondTag.annotation_type === groupTagData.selectAnnotationType) {
            groupTagData.checkTag.push(`{'first':${firstTag.type},'second':${secondTag.type}}`)
            count += 1
          }
        })
        if (firstTag.child.length === count) {
          checkGroupAll.value[firstTag.type] = true
        }
      })
      logInfo(groupTagData.checkTagCount)
      if (groupTagData.checkTag.length === groupTagData.checkTagCount) {
        checkGroupAll.value.all = true
      } else {
        checkGroupAll.value.all = false
      }
    }
    /**关闭指标分类 */
    const closeGroupTagDialog = () => {
      // 保存当前结果
      changeTaskConfig()
      save()
    }
    /**全选 */
    const checkGroupAll = ref({ all: false } as any)
    const checkGroupAllChange = (val: boolean, firstTag: any) => {
      var selectTagList = <string[]>[]
      if (firstTag) {
        selectTagList = firstTag.child.map((secondTag: any) => `{'first':${firstTag.type},'second':${secondTag.type}}`)
      } else {
        JSON.parse(taskForm.taskConfig).forEach((firstTag: any) => {
          firstTag.child.forEach((secondTag: any) => {
            selectTagList.push(`{'first':${firstTag.type},'second':${secondTag.type}}`)
          })
        })
      }
      if (val) {
        selectTagList.forEach((e: any) => {
          if (!groupTagData.checkTag.includes(e)) {
            groupTagData.checkTag.push(e)
          }
        })
        if (!firstTag) {
          for (const key of Object.keys(checkGroupAll.value)) {
            checkGroupAll.value[key] = true
          }
        }
      } else {
        groupTagData.checkTag = groupTagData.checkTag.filter((e: any) => !selectTagList.includes(e))
        if (!firstTag) {
          for (const key of Object.keys(checkGroupAll.value)) {
            checkGroupAll.value[key] = false
          }
        }
      }
      if (groupTagData.checkTag.length === groupTagData.checkTagCount) {
        checkGroupAll.value.all = true
      } else {
        checkGroupAll.value.all = false
      }
    }
    /**添加一个annotation_type */
    const annOneAnnotationType = (value: any) => {
      groupTagData.annotationTypeList.push(value)
      groupTagData.isAddAnnotationType = false
    }
    /**更新库中所有的annotation_type信息 */
    const updateAnnotationType = async () => {
      const res = await taskService.updateAnnotationType({ tid: tid.value })
      if (res.status === 200) {
        ElMessage.success('系统正在更新数据，请稍等')
      }
      taskForm.annotationTypeStatus = '1'
    }
    onMounted(() => {
      init()
      checkRole()
    })
    return {
      taskForm,
      taskRules,
      taskFormRef,
      tags,
      checkUser,
      users,
      activeNames,
      taskData,
      uploadData,
      filelist,
      save,
      userChange,
      handleExceed,
      beforeUpload,
      handelSuccess,
      uploadFile,
      pullData,
      treeData,
      treeProps,
      role,
      reviewer_role,
      insertSim,
      searchProject,
      changeTag,
      changeTagCount,
      getTagCount,
      newTag,
      tagChange,
      tagDelete,
      uploadTrinitySearch,
      activeCollapse,
      rightCollapseChange,
      jobList,
      getJob,
      exportData,
      restartJob,
      download,
      tid,
      groupTagVisible,
      groupTagData,
      changeSelectAnnotationType,
      changeAnnotationTypeGroup,
      openGroupTagDialog,
      checkGroupAllChange,
      checkGroupAll,
      Close,
      annOneAnnotationType,
      closeGroupTagDialog,
      updateAnnotationType
    }
  }
})
</script>
