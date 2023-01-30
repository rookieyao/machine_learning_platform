<template>
  <div class="compoent-main">
    <el-form ref="demoRef" :model="searchData" :rules="rules" label-width="130px">
      <el-form-item label="服务类型" prop="modelType">
        <el-radio-group v-model="searchData.modelType" @change="getModelList">
          <el-radio label="as">产品洞察/AS</el-radio>
          <el-radio label="cs">服务洞察/CS</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务名称/端口号">
        <el-cascader v-if="searchType" v-model="searchData.modelUri" :options="modelList" @change="modelUriChange" style="width: 400px;">
          <template #default="{node,data}">
            <span>{{ data.label }}</span>
            <span v-if="node.isLeaf && data.serviceAvailable === '0'">(不可用)</span>
          </template>
        </el-cascader>
        <el-input v-else v-model="searchData.modelUri" placeholder="请输入端口号" style="width: 400px;"></el-input>
        <el-button :icon="Switch" text @click="searchType = !searchType"></el-button>
      </el-form-item>
      <el-form-item label="接口类型" prop="interfaceName">
        <el-select v-model="searchData.interfaceName" filterable>
          <el-option v-if="searchData.modelType === 'as'" value="/e?eval"></el-option>
          <el-option v-if="searchData.modelType === 'as'" value="/extractOneAspect"></el-option>
          <el-option v-if="searchData.modelType === 'as'" value="/extractOneSentiment"></el-option>
          <el-option v-if="searchData.modelType === 'cs'" value="/extractOneFocus"></el-option>
          <el-option v-if="searchData.modelType === 'cs'" value="/extractOneIntent"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="本品品牌" prop="brand">
        <el-input v-model="searchData.brand" placeholder="如果不需要竞品指标过滤，留空即可" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item label="测试文本" prop="text">
        <el-input
          v-model="searchData.text"
          type="textarea"
          :rows="6"
          :placeholder="searchData.modelType === 'as' ? '请输入测试文本' : '请输入测试文本，服务洞察测试文本格式为customer/waiter:格式数据'"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <!-- <el-button @click="resetForm(demoRef)">重置</el-button> -->
        <el-button @click="getOneNer(demoRef)">提交</el-button>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="4" class="as-tags">
        <template v-if="tags.length !== 0">
          <el-row v-for="tag in tags" style="padding-top: 10px;">
            <el-tag type="info">{{ tag[0] }}</el-tag>
            <el-tag :type="tagType[tag[1]]">{{ tag[1] }}</el-tag>
            <el-tag v-if="tag[2]">{{ tag[2].r_rule }}</el-tag>
          </el-row>
        </template>
      </el-col>
      <el-col :span="20">
        <Annotation v-if="annoData.content" :listen-point="listenPoint" :inital-anno="annoData" inital-mode="查看模式"></Annotation>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { reactive, ref, nextTick, onMounted } from 'vue'
import { Switch } from '@element-plus/icons-vue'
import Annotation from '@/views/Tag/components/anno.vue'
import demoService from './api/demo'
const demoRef = ref()
const searchType = ref(true)
const searchData = reactive({
  modelType: 'as',
  interfaceName: '/e?eval',
  modelUri: '',
  text: '',
  brand: ''
})
const rules = reactive<FormRules>({
  text: [{ required: true, message: '请输入测试文本', trigger: 'blur' }],
  modelType: [{ required: true, message: '请选择模型类型', trigger: 'blur' }],
  modelUri: [{ required: true, message: '请选择服务', trigger: 'blur' }]
})
/**重置表单 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const getOneNer = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 如果请求的是客服模型，需要判断文本中是否包含customer字段，如果没有则在最前面添加上
      if (searchData.modelType === 'cs' && !searchData.text.includes('customer:')) {
        searchData.text = 'customer:' + searchData.text
      }
      await nextTick()
      const t_data = { entities: [], relations: [], content: searchData.text } as any
      let index = 0
      let res = undefined as any
      if (!searchType.value) {
        const data = {
          modelServiceUrl: searchData.modelUri,
          interfaceName: searchData.interfaceName,
          requestParams: {
            text: searchData.text,
            brand: searchData.brand
          }
        }
        res = await demoService.nerOne(data)
      } else {
        const modelUri = projectServiceList.value.find((e: any) => e.serviceName === searchData.modelUri[0] && e.serviceVersion === searchData.modelUri[1]).serviceUrl
        const data = {
          modelServiceUrl: modelUri,
          interfaceName: searchData.interfaceName,
          requestParams: {
            text: searchData.text,
            brand: searchData.brand
          }
        }
        res = await demoService.requestToModelService(data)
      }
      if (res) {
        // 判断结果是什么结构的
        if (Array.isArray(res.data[0])) {
          // 处理aspect_sentiment结构数据
          res.data[1].forEach((entitie: any) => {
            entitie.aspects.concat(entitie.sentiments).forEach((tag: any) => {
              t_data.entities.push({
                id: index,
                begin: tag.start ?? tag.c_start + entitie.padding,
                end: tag.end - 1 ?? tag.c_end + tag.padding - 1,
                tag: tag.type,
                text: tag.word
              })
              index += 1
            })
          })
          tags.value = res.data[0]
        } else {
          res.data.forEach((tag: any) => {
            t_data.entities.push({
              id: index,
              begin: tag.start,
              end: tag.end - 1,
              tag: tag.type,
              text: tag.word
            })
            index += 1
          })
        }
        annoData.content = t_data.content
        annoData.entities = t_data.entities
        annoData.relations = t_data.relations
        listenPoint.value = !listenPoint.value
      }
    }
  })
}
/**指标信息 */
const listenPoint = ref(false)
const annoData = reactive({ content: '', entities: [], relations: [] })
const tags = ref<any>([])
/**获取指标tag标签type */
const tagType = {
  正面: 'success',
  负面: 'error',
  '咨询/求助': 'primary'
} as any
/**获取机器学习平台服务列表 */
const projectServiceList = ref<any[]>([])
const getProjectService = async () => {
  const res = await demoService.listServiceVersionInfo()
  projectServiceList.value = res.data
  getModelList()
}
/**将模型结果结构化 */
const modelList = ref<any[]>([])
const getModelList = () => {
  modelList.value = []
  projectServiceList.value
    .filter((e: any) => e.serviceType === (searchData.modelType === 'as' ? '1' : '2'))
    .forEach((ele: any) => {
      const index = modelList.value.findIndex((element: any) => element.value === ele.serviceName)
      if (index < 0) {
        modelList.value.push({ value: ele.serviceName, label: ele.serviceName, children: [{ value: ele.serviceVersion, label: ele.serviceVersion, serviceAvailable: ele.serviceAvailable }] })
      } else {
        modelList.value[index].children.push({ value: ele.serviceVersion, label: ele.serviceVersion, serviceAvailable: ele.serviceAvailable })
      }
    })
}
/**切换模型 */
const modelUriChange = (value: any) => {
  const serviceAvailable = projectServiceList.value.find((e: any) => e.serviceVersion === value[1])!.serviceAvailable
  if (serviceAvailable === '0') {
    ElMessage.warning('请稍等，模型正在启动中')
  }
}
onMounted(() => {
  getProjectService()
})
</script>

<style scoped>
.as-tags {
  width: 400px;
}
</style>
