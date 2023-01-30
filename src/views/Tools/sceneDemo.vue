<template>
  <div class="compoent-main">
    <el-form label-width="120px" :model="data" ref="demoRef" :rules="rules">
      <el-form-item label="场景挖掘项目" prop="project">
        <el-select v-model="data.project" filterable>
          <el-option v-for="p in modelList" :value="p" :label="p"></el-option>
        </el-select>
        <el-button type="info" style="margin-left: 10px;" @click="cleanCache">重新加载规则</el-button>
        <div style="width: 100%;">
          <span>PS:如果模型是第一次请求，模型需要加载十几秒；请求前请确定场景挖掘任务是否已上线。</span>
          <span style="color: red;">如果规则更新但结果未更新，请先重新加载规则</span>
        </div>
      </el-form-item>
      <el-form-item label="测试文本" prop="content">
        <el-input v-model="data.content" type="textarea" :rows="6"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getSceneData(demoRef)">提交</el-button>
        <el-button type="info" @click="sceneTagVisible = !sceneTagVisible">中英指标配置</el-button>
      </el-form-item>
    </el-form>
    <el-divider>结果</el-divider>
    <div id="scene-content" v-if="resultText">{{ resultText }}</div>
    <div v-if="tags" style="padding-top: 30px;">
      <el-col>
        <template v-for="k in Object.keys(tags.simple_tags)">
          <template v-if="Array.isArray(tags.simple_tags[k]) && tags.simple_tags[k].length > 0">
            <div class="tag-group">
              <span>{{ sceneTagType[k] ?? k }}：</span>
              <el-tag v-for="tag in tags.simple_tags[k]" @click="mouseMoveTag(k, tag)" :type="getTagtype(k, tag)">{{ tag }}</el-tag>
            </div>
          </template>
          <template v-else>
            <template v-for="ub_k in Object.keys(tags.simple_tags[k])">
              <template v-if="tags.simple_tags[k][ub_k].length > 0">
                <div class="tag-group">
                  <span>{{ `${sceneTagType[k] ?? k}-${sceneTagType[ub_k] ?? ub_k}` }}：</span>
                  <el-tag v-for="tag in tags.simple_tags[k][ub_k]" @click="mouseMoveTag(`${k}.${ub_k}`, tag)" :type="getTagtype(`${k}.${ub_k}`, tag)">{{ tag }}</el-tag>
                </div>
              </template>
            </template>
          </template>
        </template>
      </el-col>
    </div>
    <el-dialog v-model="sceneTagVisible" title="中英指标配置">
      <h4>新增指标配置</h4>
      <el-form :inline="true" label-width="80px" style="padding-top: 10px;" ref="sceneTagTypeAddRef" :model="sceneTagTypeData" :rules="sceneTagTypeRules">
        <el-form-item label="英文名称" prop="en">
          <el-input v-model="sceneTagTypeData.en"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="zh">
          <el-input v-model="sceneTagTypeData.zh"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="sceneTagTypeAdd(sceneTagTypeAddRef)">添加</el-button>
        </el-form-item>
      </el-form>
      <h4>当前指标配置</h4>
      <div class="li-tag" v-for="tag in Object.keys(sceneTagType)">
        <el-tag>{{ tag }}</el-tag>
        <el-tag>{{ sceneTagType[tag] }}</el-tag>
        <el-popconfirm title="确认要删除该配置？" @confirm="sceneTagTypeDelete(tag)">
          <template #reference>
            <el-button text>
              <el-icon color="red">
                <Delete></Delete>
              </el-icon>
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { logInfo } from '@/utils'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import SceneMiningServer from '../SceneMining/api/sceneMining'
import demoService from './api/demo'

/**获取所有的场景挖掘项目 */
const modelList = ref([] as any)
const getSceneList = async () => {
  const res = await SceneMiningServer.getStates({})
  modelList.value = res.data.map((e: any) => e.name)
}
/**查询字段 */
const demoRef = ref()
const data = reactive({
  project: 'general_scene',
  content: '买给爸爸的，买给妈妈的，第二次购买了，因为价格优惠买的'
})
const rules = reactive<FormRules>({
  project: [{ required: true, message: '请输入项目名称', trigger: 'change' }],
  content: [{ required: true, message: '请输入测试文本', trigger: 'change' }]
})
/**结果 */
const resultText = ref('')
const tags = ref()
/**查询结果 */
const getSceneData = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      tags.value = undefined
      const res = await demoService.sceneMining({ project: data.project, text: data.content })
      if (res.status === 200) {
        resultText.value = data.content
        tags.value = res.data
        mouseMoveTag('', '')
      }
    }
  })
}
/**点击tag中高亮 */
const selectScene = ref('')
const selectTag = ref('')
const mouseMoveTag = (scene: string, tag: string) => {
  const moveTags = tags.value.detail_tags.filter((e: any) => e.tag === tag && e.group === scene)
  let textList = resultText.value.split('')
  const content = document.getElementById('scene-content')
  if (content) {
    moveTags.forEach((e: any) => {
      const textNumber = Array.from(new Array(e.extract.end).keys()).slice(e.extract.start)
      logInfo(textNumber)
      textNumber.forEach((ele: number) => {
        textList[ele] = `<span style="background-color:yellow">${textList[ele]}</span>`
      })
    })
    content.innerHTML = textList.join('')
  }
  selectScene.value = scene
  selectTag.value = tag
}
/**tag背景色 */
const getTagtype = (scene: string, tag: string) => {
  if (scene === selectScene.value && tag === selectTag.value) {
    return 'warning'
  } else {
    return ''
  }
}
/**获取场景标签中英指标对应关系 */
const sceneTagType = ref({}) as any
const getSceneMiningTags = async () => {
  const res = await demoService.sceneMiningTags()
  res.data.forEach((element: any) => {
    sceneTagType.value[element.en] = element.zh
  })
}
/**指标中英文配置 */
const sceneTagVisible = ref(false)
const sceneTagTypeData = reactive({
  en: '',
  zh: ''
})
const sceneTagTypeRules = reactive<FormRules>({
  en: [{ required: true, message: '请输入英文标签名', trigger: 'change' }],
  zh: [{ required: true, message: '请输入中文标签名', trigger: 'change' }]
})
const sceneTagTypeAddRef = ref()
/**指标中英文配置新增 */
const sceneTagTypeAdd = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await demoService.sceneMiningAdd({ en: sceneTagTypeData.en, zh: sceneTagTypeData.zh })
      if (res.status === 200) {
        ElMessage.success('新增成功')
        getSceneMiningTags()
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
/**指标中英文配置删除 */
const sceneTagTypeDelete = async (en: string) => {
  const res = await demoService.sceneMiningDelele({ en: en })
  if (res.status === 200) {
    ElMessage.success('删除成功')
    getSceneMiningTags()
  }
}
/**清除项目缓存 */
const cleanCache = async () => {
  const res = await demoService.sceneMiningCleanCache({ project: data.project })
  if (res.status === 200) {
    ElMessage.success('重新加载规则成功,可以继续测试该项目')
  }
}
/**初始化 */
const init = () => {
  getSceneList(), getSceneMiningTags()
}
onMounted(() => {
  init()
})
</script>

<style>
.tag-card {
  margin-right: 30px;
}
.el-card__body {
  padding: 10px;
}
.el-card__header {
  padding: 10px;
  border-bottom: 0;
}
.li-tag {
  margin-top: 5px;
}
.tag-group {
  margin-bottom: 10px;
  cursor: default;
}
</style>
