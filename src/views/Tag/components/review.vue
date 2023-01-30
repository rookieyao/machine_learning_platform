<style scoped>
.review-tag {
  margin-right: 20px;
  cursor: pointer;
}
.review-data {
  width: 90%;
  text-align: center;
  /* margin: auto; */
  margin-top: 30px;
}
.table-wrapper :deep() .el-table--fit {
  margin: 20px;
}
.table-wrapper :deep() .el-table__row--striped .el-table__cell {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
.table-wrapper :deep() .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

.table-wrapper :deep() .el-table tr {
  background-color: transparent;
}
.table-wrapper :deep() .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
  padding: 0;
}
.table-wrapper :deep() .el-table--enable-row-transition .el-table__header th,
.el-table .cell {
  background-color: transparent;
}
</style>
<template>
  <div id="review-tag-group" class="review-tag-group" v-if="role">
    <el-tag v-if="needReview === '1'" class="review-tag" type="warning" @click="cancelReview">{{ langConfig.alice.review.isModify[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('标记合格')">{{ langConfig.alice.review.标记合格[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('多选文字')">{{ langConfig.alice.review.多选文字[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('少选文字')">{{ langConfig.alice.review.少选文字[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('漏标分类')">{{ langConfig.alice.review.漏标分类[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('多标分类')">{{ langConfig.alice.review.多标分类[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('分类错误')">{{ langConfig.alice.review.分类错误[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('漏标情感')">{{ langConfig.alice.review.漏标情感[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('多标情感')">{{ langConfig.alice.review.多标情感[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('情感错误')">{{ langConfig.alice.review.情感错误[lang] }}</el-tag>
    <el-tag class="review-tag" @click="addReview('连线错误')">{{ langConfig.alice.review.连线错误[lang] }}</el-tag>
  </div>
  <div v-else id="review-tag-group" class="review-tag-group">
    <el-tag v-if="needReview === '1'" class="review-tag" type="warning" @click="cancelReview">{{ langConfig.alice.review.isModify[lang] }}</el-tag>
  </div>
  <div class="table-wrapper">
    <el-table class="review-data" stripe v-if="review.length !== 0" :data="review" :max-height="getReviewHeight()">
      <el-table-column prop="target.id" :label="langConfig.alice.review.tagId[lang]"></el-table-column>
      <el-table-column prop="target.text" :label="langConfig.alice.review.text[lang]"></el-table-column>
      <el-table-column prop="target.tag" :label="langConfig.alice.review.tag[lang]"></el-table-column>
      <el-table-column prop="msg" :label="langConfig.alice.review.reviewOpinion[lang]">
        <template #default="scope">
          {{ langConfig.alice.review[scope.row.msg][lang] }}
        </template>
      </el-table-column>
      <el-table-column prop="reviewer" :label="langConfig.alice.review.reviewer[lang]"></el-table-column>
      <el-table-column :label="langConfig.alice.review.reviewDate[lang]">
        <template #default="scope">
          {{ fmtDate(scope.row.rdate) }}
        </template>
      </el-table-column>
      <el-table-column :label="langConfig.alice.task.operation[lang]" v-if="role">
        <template #default="scope">
          <el-button size="small" text @click="removeReview(scope.$index, scope.row.rid)">{{ langConfig.alice.review.delete[lang] }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { logInfo, fmtDate } from '@/utils'
import { computed, defineComponent, getCurrentInstance, onBeforeUnmount } from 'vue'
import { langConfig } from '@/utils/constant/config'
import { useStore } from '@/store/index'

export default defineComponent({
  name: 'review', //审阅功能模块
  props: ['review', 'role', 'needReview'],
  emits: ['cancel-need-review'],
  setup(props, { emit }) {
    const store = useStore()
    const lang = computed(() => store.getters['settingsModule/getLangState'])
    const { proxy } = getCurrentInstance() as any
    const addReview = (msg: string) => {
      proxy.$bus.$emit('add-review', msg)
    }
    const removeReview = (index: number, rid: string) => {
      proxy.$bus.$emit('remove-review', { index: index, rid: rid })
    }
    /**
     * 删除需修订状态
     */
    const cancelReview = () => {
      emit('cancel-need-review')
    }
    onBeforeUnmount(() => {
      proxy.$bus.$off('add-review')
      proxy.$bus.$off('remove-review')
    })
    const getReviewHeight = () => {
      const reviewElement = document.getElementById('review-layout')!
      if (reviewElement) {
        const reviewGroupElement = document.getElementById('review-tag-group')!
        return reviewElement?.offsetParent!.clientHeight - reviewElement?.offsetTop - reviewGroupElement?.clientHeight - 40
      }
    }
    return {
      addReview,
      fmtDate,
      removeReview,
      langConfig,
      lang,
      getReviewHeight,
      cancelReview
    }
  }
})
</script>
