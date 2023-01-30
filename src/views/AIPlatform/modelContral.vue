<template>
  <div class="compoent-main">
    <el-form label-width="120px" :inline="true" :model="filter" ref="projectServiceSearchRef">
      <el-form-item label="服务名称" prop="serviceName">
        <el-input v-model="filter.serviceName" @change="getListPage(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getListPage(1)">查询</el-button>
        <el-button type="info" @click="projectServiceSearchResetFields(projectServiceSearchRef)">重置查询条件</el-button>
        <el-button type="primary" @click="clickAddService">新增服务</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="projectServiceDataRef"
      v-loading="loading"
      :data="projectServiceData"
      stripe
      table-layout="auto"
      row-key="id"
      lazy
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :load="loadOldVersion"
    >
      <el-table-column label="序号" prop="index" width="60px"></el-table-column>
      <el-table-column label="服务名称" prop="serviceName"></el-table-column>
      <el-table-column label="服务版本" prop="serviceVersion" width="120px"></el-table-column>
      <el-table-column label="项目名称" prop="projectName"></el-table-column>
      <el-table-column label="项目类型" prop="projectType" width="80px">
        <template #default="scope">
          {{ projectType[scope.row.projectType] }}
        </template>
      </el-table-column>
      <el-table-column label="模型" prop="trainModelVersion" width="85px">
        <template #default="scope">
          <el-tag class="data-type-tag" v-for="tag in scope.row.trainModelVersion.split(',')">{{ dataType[tag.split('-')[0]] }}-{{ tag.split('-')[1] }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评估状态" prop="serviceEvaluationState" width="130px">
        <template #header>
          <span>评估状态</span>
          <el-tooltip placement="top" effect="light" :hide-after="0" content="">
            <template #content>
              <span>点击</span>
              <el-icon>
                <Tickets></Tickets>
              </el-icon>
              <span>可以查看评估报告，点击</span>
              <el-icon>
                <CaretRight></CaretRight>
              </el-icon>
              <span>可以启动评估报告计算，在配置未更改的情况下不可重复评估，配置修改后评估报告会清空需要重新评估。</span>
            </template>
            <el-icon>
              <QuestionFilled></QuestionFilled>
            </el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          {{ serviceEvaluationState[scope.row.serviceEvaluationState] }}
          <el-tooltip placement="top" effect="light">
            <template v-if="checkEvaluateExist(scope.row)" #content>
              <p v-if="scope.row.projectServiceEvalInfo.aspectSentimentTestEvalId">
                方面情感(测试集)
                <router-link :to="{ name: 'evaluate', params: { eid: scope.row.projectServiceEvalInfo.aspectSentimentTestEvalId } }" custom v-slot="{ href }">
                  <a class="link" :href="href" target="_blank">查看</a>
                </router-link>
                <a class="link" @click="download(scope.row.projectServiceEvalInfo.aspectSentimentTestEvalFilePath, `${scope.row.projectName}_方面情感(测试集).xlsx`)">下载</a>
              </p>
              <p v-if="scope.row.projectServiceEvalInfo.aspectSentimentFullEvalId">
                方面情感(全集)
                <router-link :to="{ name: 'evaluate', params: { eid: scope.row.projectServiceEvalInfo.aspectSentimentFullEvalId } }" custom v-slot="{ href }">
                  <a class="link" :href="href" target="_blank">查看</a>
                </router-link>
                <a class="link" @click="download(scope.row.projectServiceEvalInfo.aspectSentimentFullEvalFilePath, `${scope.row.projectName}_方面情感(全集).xlsx`)">下载</a>
              </p>
              <p v-if="scope.row.projectServiceEvalInfo.aspectOrFocusTestEvalId">
                {{ scope.row.projectType === 1 ? '方面(测试集)' : '关注点(测试集)' }}
                <router-link :to="{ name: 'evaluate', params: { eid: scope.row.projectServiceEvalInfo.aspectOrFocusTestEvalId } }" custom v-slot="{ href }">
                  <a class="link" :href="href" target="_blank">查看</a>
                </router-link>
                <a
                  class="link"
                  @click="download(scope.row.projectServiceEvalInfo.aspectOrFocusTestEvalFilePath, `${scope.row.projectName}_${scope.row.projectType === 1 ? '方面(测试集)' : '话题(测试集)'}.xlsx`)"
                >
                  下载
                </a>
              </p>
              <p v-if="scope.row.projectServiceEvalInfo.aspectOrFocusFullEvalId">
                {{ scope.row.projectType === 1 ? '方面(全集)' : '关注点(全集)' }}
                <router-link :to="{ name: 'evaluate', params: { eid: scope.row.projectServiceEvalInfo.aspectOrFocusFullEvalId } }" custom v-slot="{ href }">
                  <a class="link" :href="href" target="_blank">查看</a>
                </router-link>
                <a
                  class="link"
                  @click="download(scope.row.projectServiceEvalInfo.aspectOrFocusFullEvalFilePath, `${scope.row.projectName}_${scope.row.projectType === 1 ? '方面(全集)' : '话题(全集)'}.xlsx`)"
                >
                  下载
                </a>
              </p>
              <p v-if="scope.row.projectServiceEvalInfo.sentimentOrIntentTestEvalId">
                {{ scope.row.projectType === 1 ? '情感(测试集)' : '意图(测试集)' }}
                <router-link :to="{ name: 'evaluate', params: { eid: scope.row.projectServiceEvalInfo.sentimentOrIntentTestEvalId } }" custom v-slot="{ href }">
                  <a class="link" :href="href" target="_blank">查看</a>
                </router-link>
                <a
                  class="link"
                  @click="
                    download(scope.row.projectServiceEvalInfo.sentimentOrIntentTestEvalFilePath, `${scope.row.projectName}_${scope.row.projectType === 1 ? '情感(测试集)' : '关注点(测试集)'}.xlsx`)
                  "
                >
                  下载
                </a>
              </p>
              <p v-if="scope.row.projectServiceEvalInfo.sentimentOrIntentFullEvalId">
                {{ scope.row.projectType === 1 ? '情感(全集)' : '意图(全集)' }}
                <router-link :to="{ name: 'evaluate', params: { eid: scope.row.projectServiceEvalInfo.sentimentOrIntentFullEvalId } }" custom v-slot="{ href }">
                  <a class="link" :href="href" target="_blank">查看</a>
                </router-link>
                <a
                  class="link"
                  @click="download(scope.row.projectServiceEvalInfo.sentimentOrIntentFullEvalFilePath, `${scope.row.projectName}_${scope.row.projectType === 1 ? '情感(全集)' : '关注点(全集)'}.xlsx`)"
                >
                  下载
                </a>
              </p>
            </template>
            <template v-else #content>
              <span>暂无评估报告</span>
            </template>
            <el-button class="table-button-icon" :icon="Tickets" text size="small"></el-button>
          </el-tooltip>
          <el-popover trigger="click" width="300px" placement="top" @after-leave="checkEvaluateList = []">
            <p>生成评估报告</p>
            <el-checkbox-group v-model="checkEvaluateList">
              <el-checkbox
                v-if="scope.row.projectType === 1"
                label="AS_1"
                :indeterminate="Boolean(scope.row.projectServiceEvalInfo.aspectSentimentTestEvalId)"
                :disabled="scope.row.projectServiceEvalInfo.aspectSentimentTestEvalStatus === '1' || Boolean(scope.row.projectServiceEvalInfo.aspectSentimentTestEvalId)"
              >
                方面情感(测试集)
              </el-checkbox>
              <el-checkbox
                v-if="scope.row.projectType === 1"
                label="AS_2"
                :indeterminate="Boolean(scope.row.projectServiceEvalInfo.aspectSentimentFullEvalId)"
                :disabled="scope.row.projectServiceEvalInfo.aspectSentimentFullEvalStatus === '1' || Boolean(scope.row.projectServiceEvalInfo.aspectSentimentFullEvalId)"
              >
                方面情感(全集)
              </el-checkbox>
              <el-checkbox
                label="aspect_1"
                :indeterminate="Boolean(scope.row.projectServiceEvalInfo.aspectOrFocusTestEvalId)"
                :disabled="scope.row.projectServiceEvalInfo.aspectOrFocusTestEvalStatus === '1' || Boolean(scope.row.projectServiceEvalInfo.aspectOrFocusTestEvalId)"
              >
                {{ scope.row.projectType === 1 ? '方面' : '关注点' }}(测试集)
              </el-checkbox>
              <el-checkbox
                label="aspect_2"
                :indeterminate="Boolean(scope.row.projectServiceEvalInfo.aspectOrFocusFullEvalId)"
                :disabled="scope.row.projectServiceEvalInfo.aspectOrFocusFullEvalStatus === '1' || Boolean(scope.row.projectServiceEvalInfo.aspectOrFocusFullEvalId)"
              >
                {{ scope.row.projectType === 1 ? '方面' : '关注点' }}(全集)
              </el-checkbox>
              <el-checkbox
                label="sentiment_1"
                :indeterminate="Boolean(scope.row.projectServiceEvalInfo.sentimentOrIntentTestEvalId)"
                :disabled="scope.row.projectServiceEvalInfo.sentimentOrIntentTestEvalStatus === '1' || Boolean(scope.row.projectServiceEvalInfo.sentimentOrIntentTestEvalId)"
              >
                {{ scope.row.projectType === 1 ? '情感' : '意图' }}(测试集)
              </el-checkbox>
              <el-checkbox
                label="sentiment_2"
                :indeterminate="Boolean(scope.row.projectServiceEvalInfo.sentimentOrIntentFullEvalId)"
                :disabled="scope.row.projectServiceEvalInfo.sentimentOrIntentFullEvalStatus === '1' || Boolean(scope.row.projectServiceEvalInfo.sentimentOrIntentFullEvalId)"
              >
                {{ scope.row.projectType === 1 ? '情感' : '意图' }}(全集)
              </el-checkbox>
            </el-checkbox-group>
            <div class="popover-button">
              <el-button type="primary" size="small" @click="startEvaluate(scope.row.id, scope.row.projectName)">确定</el-button>
            </div>
            <template #reference>
              <el-button class="table-button-icon" :icon="CaretRight" text size="small"></el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="服务状态" prop="serviceState" width="80px">
        <template #default="scope">
          {{ serviceState[scope.row.serviceState] }}
        </template>
      </el-table-column>
      <el-table-column label="服务是否可用" prop="serviceAvailable" width="110px">
        <template #default="scope">
          <!-- <el-tag v-if="scope.row.serviceAvailable === 1" type="success">可用</el-tag>
          <el-tag v-else type="danger">不可用</el-tag> -->
          <el-switch
            :value="scope.row.serviceAvailable"
            :active-value="1"
            :inactive-value="0"
            :disabled="scope.row.serviceEvaluationState === 1"
            @change="(val) => switchChange(val, scope.row)"
            style="--el-switch-on-color: #13ce66;"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="上线环境" width="120px">
        <template #header>
          <span>上线环境</span>
          <el-tooltip placement="top" effect="light" :hide-after="0" content="">
            <template #content>
              <span>点击对应环境可以服务进行指定环境进行上下线操作，同个服务不同版本在不同环境上线时会替换旧的服务，</span>
              <span style="background-color: #13ce66;">绿色</span>
              <span>表示服务已经成功上线</span>
            </template>
            <el-icon>
              <QuestionFilled></QuestionFilled>
            </el-icon>
          </el-tooltip>
        </template>
        <template #default="scope">
          <el-popover trigger="click" width="250px" placement="top" @show="serviceOnlineCheck(scope.row.projectServiceId)">
            <div v-if="scope.row.cloudNamespace">
              <p class="popover-p">是否要将生产环境服务【{{ scope.row.serviceName }}】下线?</p>
              <div class="popover-button">
                <el-button type="primary" size="small" :disabled="!checkOfflineDisabled(scope.row)" @click="serviceChange('offline', scope.row.id, '2')">下线</el-button>
              </div>
            </div>
            <div v-else>
              <p class="popover-p">是否将服务【{{ scope.row.serviceName }}】上线到生产环境?</p>
              <p class="popover-p-red">*同个环境不同版本服务会替换.</p>
              <p class="popover-p">已上线环境及版本:</p>
              <p class="popover-p" v-if="checkService && checkService.prodServiceExist">生产:{{ checkService.prodServiceVersion }}</p>

              <div class="popover-button">
                <el-button type="primary" size="small" :disabled="!checkOnlineDisabled(scope.row)" @click="serviceChange('online', scope.row.id, '2')">上线</el-button>
              </div>
            </div>
            <template #reference>
              <el-tag class="data-type-tag pointer-tag" :type="scope.row.cloudNamespace ? 'success' : 'info'">生产</el-tag>
            </template>
          </el-popover>
          <el-popover trigger="click" width="250px" placement="top" @show="serviceOnlineCheck(scope.row.projectServiceId)">
            <div v-if="scope.row.fatNamespace">
              <p class="popover-p">是否要将FAT环境服务【{{ scope.row.serviceName }}】下线?</p>
              <div class="popover-button">
                <el-button type="primary" size="small" :disabled="!checkOfflineDisabled(scope.row)" @click="serviceChange('offline', scope.row.id, '1')">下线</el-button>
              </div>
            </div>
            <div v-else>
              <p class="popover-p">是否将服务【{{ scope.row.serviceName }}】上线到FAT环境?</p>
              <p class="popover-p-red">*同个环境不同版本服务会替换.</p>
              <p class="popover-p">已上线环境及版本:</p>
              <p class="popover-p" v-if="checkService && checkService.fatSercuceExist">FAT:{{ checkService.fatServiceVersion }}</p>
              <div class="popover-button">
                <el-button type="primary" size="small" :disabled="!checkOnlineDisabled(scope.row)" @click="serviceChange('online', scope.row.id, '1')">上线</el-button>
              </div>
            </div>
            <template #reference>
              <el-tag class="data-type-tag pointer-tag" :type="scope.row.fatNamespace ? 'success' : 'info'">FAT</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="creator" width="70px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="备注" prop="remark">
        <template #default="scope">
          <el-tooltip placement="top" effect="light" :content="scope.row.remark" :hide-after="0">
            <span>{{ scope.row.remark.slice(0, 20) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm v-if="[-1, 2, 3, 7].includes(scope.row.serviceState)" title="确认要删除？" confirm-button-text="确认" cancel-button-text="取消" @confirm="serviceDelete(scope.row.id)">
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button text type="primary" @click="clickCheck(scope.row.id)">查看</el-button>
          <el-tooltip
            placement="top"
            effect="light"
            :disabled="Boolean(!scope.row.serviceAvailable) && scope.row.serviceState !== 6"
            content="服务启动状态不允许编辑"
            :hide-after="0"
            :enterable="false"
          >
            <span style="width: min-content;">
              <el-button text type="primary" :disabled="Boolean(scope.row.serviceAvailable) || scope.row.serviceState === 6" @click="clickUpdate(scope.row.id)">编辑</el-button>
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="table-pagination"
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="getListPage(1)"
      @current-change="getListPage(currentPage)"
    ></el-pagination>
    <el-dialog v-model="addServiceVisble" title="新增服务" @close="addServiceClose(addServiceFormRef)">
      <el-form label-width="120px" ref="addServiceFormRef" :model="addServiceData" :rules="addServiceRules">
        <el-tabs>
          <el-tab-pane label="模型信息">
            <el-form-item label="服务名称" prop="serviceName">
              <el-input
                v-model="addServiceData.serviceName"
                :disabled="checkServiceDisable"
                placeholder="请输入服务名称,服务名称只能由小写英文字母,数字,'-'','_'组成,首字母只能为英文,建议以品牌_项目的形式,例如oppo_phone"
              ></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="projectName">
              <el-select v-model="addServiceData.projectName" :disabled="updateServiceDisable" filterable @change="projectNameChange">
                <el-option v-for="name in projectNameList" :value="name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目类型" prop="projectType">
              <el-select v-model="addServiceData.projectType" :disabled="updateServiceDisable" @change="projectTypeChange">
                <el-option v-if="projectList.find((e:any) => e.projectType === 1)" :value="1" label="产品洞察"></el-option>
                <el-option v-if="projectList.find((e:any) => e.projectType === 2)" :value="2" label="服务洞察"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模型类型" prop="trainModelVersionIdList">
              <el-select v-model="addServiceData.trainModelVersionIdList" :disabled="updateServiceDisable" multiple clearable @change="trainModelVersionIdChange">
                <template v-for="(value, key) in dataType">
                  <el-option-group v-if="projectList.find((e:any)=>e.modelType===key && e.projectType===addServiceData.projectType)" :label="value" :key="key">
                    <el-option v-for="item in projectList.filter((e:any)=>e.modelType===key)" :value="item.trainModelVersionId" :label="`${value}-${item.trainModelVersion}`"></el-option>
                  </el-option-group>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addServiceData.remark" type="textarea" :disabled="checkServiceDisable"></el-input>
            </el-form-item>
            <el-form-item v-if="!checkServiceDisable">
              <el-button @click="addServiceClean(addServiceFormRef)">重置</el-button>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="配置信息">
            <el-form-item label-width="0" prop="serviceConfigInfo">
              <yaml-editor
                class="my-editor"
                ref="yamlEditorRef"
                :value="addServiceData.serviceConfigInfo"
                :disabled="checkServiceDisable"
                height="600px"
                :codemirror-id="codemirrorID"
                @changed="handleChanged"
                @input="handleInput"
              ></yaml-editor>
            </el-form-item>
            <el-form-item v-if="!checkServiceDisable">
              <el-button @click="addServiceClean(addServiceFormRef)">重置</el-button>
              <el-button type="primary" v-if="addServiceData.projectServiceVersionId" @click="updateService(addServiceFormRef)">修改</el-button>
              <el-button type="primary" v-else @click="addService(addServiceFormRef)">新增</el-button>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onActivated, onDeactivated, reactive, ref } from 'vue'
import { aiPlatformApi, projectServiceService, trainModelService } from './api/aiPlatform'
import {
  projectServiceAddServiceReq,
  projectServiceFullEvaluateReq,
  projectServiceListPageReq,
  projectServiceOperateProjectServiceReq,
  projectServiceStartEvaluateReq,
  projectServiceUpdateServiceVersion
} from './api/types'
import { serviceState, projectType, dataType, serviceEvaluationState } from './api/info'
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus'
import { CaretRight, Tickets } from '@element-plus/icons-vue'
import yamlEditor from '@/components/Editor/yamlEditor.vue'
import downloadFile from '@/utils/downloadFile'
import { logInfo } from '@/utils'
const loading = ref(false)
/**分页 */
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
/**filter查询 */
const filter = reactive({
  serviceName: ''
})
/**重置查询参数 */
const projectServiceSearchResetFields = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  getListPage(1)
}
/**获取任务列表 */
const projectServiceData = ref([])
const projectServiceDataRef = ref()
const getListPage = async (page: number) => {
  loading.value = true
  const listPageFilter: projectServiceListPageReq = { pageNum: page, pageSize: pageSize.value, serviceName: null }
  if (filter.serviceName) {
    listPageFilter.serviceName = filter.serviceName
  }
  const res = await projectServiceService.projectServiceListPage(listPageFilter)
  projectServiceData.value = res.data.list.map((e: any, index: number) => {
    e.index = index + 1 + (currentPage.value - 1) * pageSize.value
    e.hasChildren = true
    return e
  })
  total.value = res.data.total
  currentPage.value = res.data.pageNum
  loading.value = false
  await nextTick()
  reloadTable()
}
/**查询历史的版本 */
const loadMap = ref(new Map())
const loadOldVersion = async (row: any, treeNode: unknown, resolve: (date: any[]) => void) => {
  //将获取到的节点数据添加到loadMap变量中
  loadMap.value.set(row.projectServiceId, { row, treeNode, resolve })
  const res = await projectServiceService.getProjectServiceVersionListByProjectServiceId(row.projectServiceId, row.id)
  resolve(res.data)
}
// 重置表格懒加载信息
const reloadTable = () => {
  loadMap.value.forEach((e: any) => {
    const { row, treeNode, resolve } = e
    // 判断展开的行是不是最新的行，避免新增版本后id不同
    const tableRow = projectServiceDataRef.value.data.find((e: any) => e.projectServiceId === row.projectServiceId)
    projectServiceDataRef.value.store.states.lazyTreeNodeMap.value[row.id] = []
    if (row.id === tableRow.id) {
      // 还是相同的id则清空之前的并重新加载
      loadOldVersion(row, treeNode, resolve)
    }
  })
}
/**获取所有的项目名称 */
const projectNameList = ref<string[]>([])
const projectServiceSearchRef = ref()
const getprojectName = async () => {
  const res = await trainModelService.trainModellistUniqueProjectNameApiAll()
  projectNameList.value = res.data.map((e: any) => e.projectName)
}
/**切换项目名称获取所有的项目信息 */
const projectList = ref([] as any)
const projectNameChange = async (name: string) => {
  // 项目类型和模型类型设置为默认
  addServiceData.projectType = ''
  addServiceData.trainModelVersionIdList.splice(0, addServiceData.trainModelVersionIdList.length)
  const res = await trainModelService.trainModelListModelInfoByProjectName({ projectName: name })
  projectList.value = res.data
  if (projectList.value.length === 0) {
    ElMessage.warning('该项目下没有可用模型')
    return
  }
}
/**切换项目类型 */
const codemirrorID = ref(Date.now().toString())
const projectTypeChange = (val: any) => {
  addServiceData.trainModelVersionIdList.splice(0, addServiceData.trainModelVersionIdList.length)
  if (projectList.value[0].language === 2) {
    defaultSentiment.value = "'neutral'"
  }
  changeServiceConfigInfo(val)
}
const changeServiceConfigInfo = (val: any) => {
  // 根据项目类型更改默认配置信息
  if (val === 2) {
    defaultSentiment.value = 'null'
    addServiceData.serviceConfigInfo = `models:\n- aspect\n- intent\ntag:\n  align: []\naspect:\n  merge: {}\n  delete: []\n  rechecks: true\ndebug_rules: false\nnew_rules: null\nrule:\n  lhs: []\n  rhs: []\n  modify: {}\n  special_modify: {}\n  match: {}\ntext_preprocessor:\n  version: 2\n  pipeline: ${defaultPipeline.value}\ndefault_asp: null\ndefault_sen: ${defaultSentiment.value}\nrecheck_tags: []\nvaluable_aspects: null\nauto_add_default_tag: false`
  } else {
    addServiceData.serviceConfigInfo = `models:\n- aspect\n- sentiment\ntag:\n  align: []\naspect:\n  merge: {}\n  delete: []\n  rechecks: true\ndebug_rules: false\nnew_rules: null\nrule:\n  lhs: []\n  rhs: []\n  modify: {}\n  special_modify: {}\n  match: {}\ntext_preprocessor:\n  version: 2\n  pipeline: ${defaultPipeline.value}\ndefault_asp: null\ndefault_sen: ${defaultSentiment.value}\nrecheck_tags: []\nvaluable_aspects: null\nauto_add_default_tag: false`
  }
  codemirrorID.value = Date.now().toString()
}
/**点击新增服务 */
const addServiceVisble = ref(false)
const clickAddService = () => {
  //判断所有的项目名称是否已加载
  if (projectNameList.value.length === 0) {
    getprojectName()
  }
  addServiceVisble.value = !addServiceVisble.value
  codemirrorID.value = Date.now().toString()
}
/**选择模型类型切换 */
const trainModelVersionIdChange = (val: any) => {
  // 模型选择变化时，判断是否为同一个类型,并且最大值为2
  if (val.length > 2) {
    addServiceData.trainModelVersionIdList.pop()
    ElMessage.warning('选择模型类型过多')
    return
  }
  // 判断两个模型类型是否相同
  if (val.length === 2) {
    if (projectList.value.find((e: any) => e.trainModelVersionId === val[1]).modelType === projectList.value.find((e: any) => e.trainModelVersionId === val[0]).modelType) {
      addServiceData.trainModelVersionIdList.pop()
      ElMessage.warning('不能选择重复模型')
      return
    }
  }
  if (val.length > 0) {
    const lastSelectProject = projectList.value.find((e: any) => e.trainModelVersionId === val[val.length - 1])
    defaultPipeline.value = lastSelectProject.pipeline
    changeServiceConfigInfo(lastSelectProject.projectType)
  }
}
/**新增服务 */
const addServiceFormRef = ref<FormInstance>()
const addServiceRules = reactive<FormRules>({
  serviceName: [
    { pattern: /^[a-z][a-z0-9_\-]*$/, message: '项目名称只能由小写英文字母,数字,"-","_"组成,首字母只能为英文,例如oppo_phone', trigger: ['blur', 'change'] },
    { required: true, message: '请输入服务名称' }
  ],
  projectName: [{ required: true, message: '请选择项目名称', trigger: 'change' }],
  projectType: [{ required: true, message: '请选择项目类型', trigger: 'change' }],
  trainModelVersionIdList: [{ required: true, message: '请选择模型', trigger: 'change' }]
})
const defaultSentiment = ref("'中性'")
const defaultPipeline = ref('ecom')
const addServiceData = reactive({
  projectServiceVersionId: '',
  serviceName: '',
  projectName: '',
  projectType: '',
  trainModelVersionIdList: [],
  remark: '',
  serviceConfigInfo: `models:\n- aspect\n- sentiment\ntag:\n  align: []\naspect:\n  merge: {}\n  delete: []\n  rechecks: true\ndebug_rules: false\nnew_rules: null\nrule:\n  lhs: []\n  rhs: []\n  modify: {}\n  special_modify: {}\n  match: {}\ntext_preprocessor:\n  version: 2\n  pipeline: ecom\ndefault_asp: null\ndefault_sen: '中性'\nrecheck_tags: []\nvaluable_aspects: null\nauto_add_default_tag: false`
})
/**点击新增服务 */
const addService = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data: projectServiceAddServiceReq = {
        projectName: addServiceData.projectName,
        serviceName: addServiceData.serviceName,
        trainModelVersionIdList: addServiceData.trainModelVersionIdList,
        remark: addServiceData.remark,
        serviceConfigInfo: addServiceData.serviceConfigInfo
      }
      const res = await projectServiceService.projectServiceAddService(data)
      if (res.status === 200) {
        ElMessage.success('新增服务成功')
        addServiceVisble.value = false
        getListPage(currentPage.value)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**重置新增服务参数 */
const addServiceClean = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  if (yamlEditorRef.value) {
    yamlEditorRef.value.init()
  }
}
/**上线or下线 */
const serviceChange = async (operate: string, id: string, environmentType: string) => {
  // 上线所需环境  1 fat环境  2 prod(生产)环境
  if (operate === 'online') {
    const res = await projectServiceService.projectServiceOnline({ projectServiceVersionId: id, environmentType: environmentType })
    if (res.status === 200) {
      ElMessage.success('申请上线成功，待审核')
      getListPage(currentPage.value)
    }
  }
  if (operate === 'offline') {
    const res = await projectServiceService.projectServiceOffline({ projectServiceVersionId: id, environmentType: environmentType })
    if (res.status === 200) {
      ElMessage.success('申请下线成功，待审核')
      getListPage(currentPage.value)
    }
  }
}
/**服务删除 */
const serviceDelete = async (id: string) => {
  const res = await projectServiceService.projectServiceDeleteById(id)
  if (res.status === 200) {
    ElMessage.success('删除成功')
    getListPage(currentPage.value)
  }
}
/**服务启动关闭 */
const serviceContral = async (row: any, available: number) => {
  const data: projectServiceOperateProjectServiceReq = {
    id: row.id,
    serviceAvailable: available,
    projectName: row.projectName,
    projectType: row.projectType
  }
  const res = await projectServiceService.operateProjectService(data)
  if (res.status === 200) {
    getListPage(currentPage.value)
  }
}
/**codemirror 更新内容 */
const handleChanged = (ev: string) => {
  addServiceData.serviceConfigInfo = ev
}
/**启动全量评估 */
const getFullEvaluate = async (id: string) => {
  const data: projectServiceFullEvaluateReq = { projectServiceVersionId: id }
  const res = await projectServiceService.fullEvaluate(data)
  if (res.status === 200) {
    ElMessage.success('开始计算全量评估')
  }
}
/**启动评估 */
const checkEvaluateList = ref([])
const startEvaluate = async (projectServiceVersionId: string, projectName: string) => {
  const data: projectServiceStartEvaluateReq = {
    projectServiceVersionId: projectServiceVersionId,
    projectName: projectName,
    detectList: checkEvaluateList.value.map((e: string) => {
      const value = e.split('_')
      return { evaluationType: Number(value[1]), modelType: value[0] }
    })
  }
  if (data.detectList.length > 0) {
    const res = await projectServiceService.startEvaluate(data)
    if (res.status === 200) {
      ElMessage.success(`启动评估成功`)
    }
  }
}
/**yaml */
const yamlEditorRef = ref()
const handleInput = (ev: any) => {}
/**文件下载 */
const download = (path: string, fileName: string) => {
  downloadFile(aiPlatformApi.fileDownloadApi, fileName, 'post', { fileName: path })
}
/**判断服务是否可以上线操作 */
const checkOnlineDisabled = (row: any) => {
  // 评估中/审核中不可以上线
  if (row.serviceState === 1 || row.serviceState === 4) return false
  if (row.fatNamespace && row.cloudNamespace) return false
  return true
}
/**判断服务是否可以下线操作 */
const checkOfflineDisabled = (row: any) => {
  // 审核中不能下线
  if (row.serviceState === 4) return false
  if (row.fatNamespace || row.cloudNamespace) return true
  return false
}
/**校验符是否已经有上线版本 */
const checkService = ref()
const serviceOnlineCheck = async (id: string) => {
  const res = await projectServiceService.serviceOnlineCheck({ projectServiceId: id })
  checkService.value = res.data
}
/**编辑配置前先获取当前的服务的配置 */
const updateServiceDisable = ref(false)
const clickUpdate = async (id: string) => {
  // 打开对话框
  clickAddService()
  await nextTick()
  updateServiceDisable.value = true
  // 设置服务值
  const res = await projectServiceService.getServiceVersionInfoById({ id: id })
  if (res.status === 200) {
    addServiceData.projectServiceVersionId = res.data.id
    addServiceData.projectType = res.data.serviceType
    addServiceData.serviceName = res.data.serviceName
    addServiceData.projectName = res.data.projectName
    projectList.value = res.data.modelInfoSelectVoList
    addServiceData.trainModelVersionIdList = res.data.modelInfoSelectVoList.map((e: any) => e.trainModelVersionId)
    addServiceData.remark = res.data.remark
    addServiceData.serviceConfigInfo = res.data.serviceConfigInfo
    codemirrorID.value = Date.now().toString()
  }
}
/**查看无法更改任务信息 */
const checkServiceDisable = ref(false)
const clickCheck = async (id: string) => {
  checkServiceDisable.value = true
  await clickUpdate(id)
}
/**对话框关闭后重置 */
const addServiceClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  addServiceData.projectServiceVersionId = ''
  projectList.value = []
  updateServiceDisable.value = false
  checkServiceDisable.value = false
  codemirrorID.value = Date.now().toString()
}
/**编辑 */
const updateService = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const data: projectServiceUpdateServiceVersion = {
        projectServiceVersionId: addServiceData.projectServiceVersionId,
        serviceName: addServiceData.serviceName,
        remark: addServiceData.remark,
        serviceConfigInfo: addServiceData.serviceConfigInfo
      }
      const res = await projectServiceService.updateServiceVersion(data)
      if (res.status === 200) {
        ElMessage.success('新增配置修改成功')
        addServiceVisble.value = false
        getListPage(currentPage.value)
      }
    }
  })
}
/**开关操作前 */
const switchChange = (val: any, row: any) => {
  ElMessageBox.confirm(`是否要${val ? '启动' : '关闭'}服务${row.serviceName}`)
    .then(() => {
      serviceContral(row, val)
    })
    .catch(() => {})
}
/**判断有无评估报告 */
const checkEvaluateExist = (row: any) => {
  if (
    row.projectServiceEvalInfo.aspectOrFocusFullEvalId ||
    row.projectServiceEvalInfo.aspectOrFocusTestEvalId ||
    row.projectServiceEvalInfo.aspectSentimentFullEvalId ||
    row.projectServiceEvalInfo.aspectSentimentTestEvalId ||
    row.projectServiceEvalInfo.sentimentOrIntentFullEvalId ||
    row.projectServiceEvalInfo.sentimentOrIntentTestEvalId
  )
    return true
}
let timer = undefined as any
onActivated(() => {
  getListPage(1)
  timer = setInterval(function () {
    getListPage(currentPage.value)
  }, 60000)
})
onDeactivated(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.my-editor {
  width: 100%;
}
.popover-button {
  text-align: right;
  margin-top: 10px;
}
.popover-p {
  font-size: 10px;
}
.popover-p-red {
  color: red;
  font-size: 8px;
}
.data-type-tag {
  margin-right: 3px;
  padding: 1px 2px;
}
.table-button-icon {
  padding: 0 5px;
}
.pointer-tag {
  cursor: pointer;
}
</style>
