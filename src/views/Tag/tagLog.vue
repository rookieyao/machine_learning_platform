<template>
  <div id="taglog">
    <div class="log-form">
      <el-form ref="ruleFormRef" :inline="true" :model="didForm" class="form-inline" label-width="120px" :rules="rules">
        <el-form-item label="数据id" prop="did">
          <el-input v-model="didForm.did"></el-input>
        </el-form-item>
        <el-form-item><el-button @click="submit">查询</el-button></el-form-item>
      </el-form>
    </div>
    <div class="anno">
      <annotation v-for="i in annodata['log']" :key="i._id" :annid="i._id" :anno="{ content: annodata.content, entities: i.data.entities, relations: i.data.relations }" :user="i.name"></annotation>
    </div>
  </div>
</template>
<script lang="ts">
import annotation from './components/anno'
import { defineComponent, ref, reactive } from 'vue'
import indexService from './api/index'
export default defineComponent({
  name: 'tagLog',
  components: { annotation },
  setup() {
    const did = ref('')
    const annodata = ref({} as any)
    const rules = { did: [{ required: true, message: '请输入did', trigger: 'blur' }] }
    const didForm = reactive({
      did: ''
    })
    const ruleFormRef = ref()
    const submit = () => {
      ruleFormRef.value.validate((valid: any): boolean => {
        if (valid) {
          query()
          return true
        }
        return false
      })
    }
    const query = async () => {
      const res = await indexService.getTagLog({ did: didForm.did, default_database: 'ann' })
      annodata.value = res['data']
    }
    return {
      didForm,
      query,
      annodata,
      rules,
      ruleFormRef,
      submit
    }
  }
})
</script>
