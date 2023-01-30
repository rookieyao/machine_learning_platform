<style scoped>
/* .text-center {
  text-align: center;
} */
#ann {
  max-height: 400px;
  margin-top: 30px;
}
svg > text tspan {
  font-size: 28px;
}
</style>
<template>
  <div class="ann-card">
    <div>
      <div id="ann" class="text-center"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { logInfo } from '@/utils'
import { langConfig } from '@/utils/constant/config'
import { ElMessage } from 'element-plus'
// 引入外部js文件
function Script(src: string, callback: any) {
  const js = document.createElement('script')
  js.setAttribute('type', 'text/javascript')
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(js)
  if (navigator.appName.toLowerCase().indexOf('netscape') == -1) {
    js.onreadystatechange = function () {
      if (js.readyState == 'complete') {
        if (typeof callback === 'function') {
          callback()
        }
      }
    }
  } else {
    js.onload = function () {
      if (typeof callback === 'function') {
        callback()
      }
    }
  }
  js.src = src
}

export default defineComponent({
  name: 'annotation',
  emits: ['update-ann-data', 'add-review-result', 'remove-review-result', 'choose-snippet', 'set-element-id'],
  props: {
    initalAnno: {
      type: Object,
      default() {
        return { content: '', entities: [], relations: [] }
      }
    }, //  content,entities,relations
    initalTid: { type: String, default: null },
    initalDid: { type: String, default: null },
    initalMode: { type: String },
    initalTags: { type: Array, default: null },
    checkEntities: { type: Boolean, default: false },
    role: { type: Boolean, default: false },
    lang: { type: String },
    tagsDict: { type: Object },
    listenPoint: { type: Boolean, default: null }
  },
  data() {
    return {
      tagUser: '', // 该条数据的修改用户
      update: '', // 标注时间，如果是第一次标注的数据则为现在
      lastSelectTag: '', //当前选中的标签
      lastItem: null as any, // 最后一次访问的标注项
      lastSelectId: null, //当前工作的焦点label id
      autoReview: false, // 自动审阅
      annotator: null as any, //当前的anno标签，用于判断是否存在
      searchTag: ''
    }
  },
  watch: {
    // 监听did变化，并更新
    initalDid(newValue, oldValue) {
      if (this.annotator) {
        this.annotator.remove()
        this.lastSelectId = null
        this.lastItem = null
      }

      if (newValue && newValue != oldValue) {
        this.initAnnotator()
      }
    },
    listenPoint(newValue, oldValue) {
      if (this.annotator) {
        this.annotator.remove()
      }

      if (newValue != oldValue) {
        this.initAnnotator()
      }
    }
  },
  computed: {},
  methods: {
    // 判断当前的模式
    isAutoReview() {
      return this.autoReview && this.initalMode === '批量审阅'
    },
    // 是否可以对Anno进行操作
    isRevisability() {
      if (this.initalMode === '查看模式') {
        return false
      } else {
        return true
      }
    },
    updateLastItem(id: number, begin: number, end: number, tag: string, text: string) {
      this.lastItem = {
        id: id,
        begin: begin,
        end: end,
        tag: tag ?? '',
        text: text
      }
    },
    // 初始化anno控件
    initAnnotator() {
      const self = this
      if (this.initalAnno) {
        if (window.Anno) {
          // 如果已经存在annotation标签，则移除标签
          if (self.annotator) {
            self.annotator.remove()
          }
          const ann = document.querySelector('#ann')
          var tags = []
          // 判断是否有传入tasg指标树，没有则使用anno的entities
          if (self.initalTags) {
            // tags = self.initalTags
            tags = JSON.parse(JSON.stringify(self.initalTags))
            for (let i = 0; i < tags.length; i++) {
              for (let j = 0; j < tags[i].child.length; j++) {
                tags[i].child[j].id = tags[i].child[j].type
                tags[i].child[j].type = this.tagsDict[tags[i].child[j].type][this.lang]
                if (tags[i].child[j].type === self.searchTag || tags[i].child[j].type === langConfig.train.evaluate.tagFrom[this.lang] + tags[i].child[j].type) {
                  tags[i].child[j].color = '#FD7013'
                } else if (tags[i].child[j].color !== undefined) {
                  tags[i].child[j].color = undefined
                }
              }
            }
          } else {
            logInfo('无指标树或指标未加载到标注模块中')
            tags = [
              {
                child: this.initalAnno.entities.map((e: { type: any; tag: any; color: any }) => {
                  let color = undefined
                  let type = e.type ?? e.tag
                  if (type === self.searchTag || type === langConfig.train.evaluate.tagFrom[this.lang] + self.searchTag) {
                    color = '#FD7013'
                  } else if (e.color !== undefined) {
                    color = undefined
                  }
                  return {
                    type: type,
                    color: color
                  }
                })
              }
            ]
          }
          const zhRegex = /[\u4e00-\u9fa5]/g
          let maxWordsOneLine = 60
          if (zhRegex.test(this.initalAnno.content)) {
            maxWordsOneLine = parseInt(ann.clientWidth / 28) - 6
          } else {
            maxWordsOneLine = parseInt(ann.clientWidth / 16) - 6
          }
          if (maxWordsOneLine < 0) {
            maxWordsOneLine = 60
          }
          //   TODO Anno 新增个判断语种字段
          self.annotator = new window.Anno(
            this.initalAnno, // 标注数据
            tags, // 可选label数据
            maxWordsOneLine, // 每行展示的字数
            ann
          )

          // 输出用户选择的文本起始位置和末位置
          self.annotator.on('select', (start: number, end: number) => {
            // 选中某段文本后，获取推荐
            this.$emit('set-element-id', null)
            // eventHub.$emit('qsearch-snippets', this.annotator.getText(start, end))
            if (self.lastSelectId != null) {
              // 修改当前选中的id
              const a = self.annotator.getLabelById(self.lastSelectId)
              if (a) {
                self.annotator.updateLabel(self.lastSelectId, a.categoryId, start, end)
                self.annotator.clearEmptyLabel()
                const old_entity = self.annotator.getEntity(a)
                // 更新选中文本
                const text = self.annotator.getText(start, end)
                this.$emit('choose-snippet', text)
                self.updateLastItem(old_entity.id, start, end - 1, old_entity.tag, text)
                // 审阅模式下需要记录新旧值
                if (self.isAutoReview()) {
                  if (old_entity.text.length < self.lastItem.text.length) {
                    self.reviewAdd('少选文字')
                  } else {
                    self.reviewAdd('多选文字')
                  }
                }
              } else {
                self.lastSelectId = null
                // 更新选中文本
                const text = self.annotator.getText(start, end)
                this.$emit('choose-snippet', text)
                self.updateLastItem(-1, start, end - 1, '', text)
              }
            } else {
              // 此时已生成新的id
              logInfo('select')
              const a = self.annotator.getLastChild()
              self.lastSelectId = a.id
              const old_entity = self.annotator.getEntity(a)
              logInfo('old_entity', old_entity)
              // 更新选中文本
              const text = self.annotator.getText(start, end)
              this.$emit('choose-snippet', text)
              self.updateLastItem(-1, start, end - 1, old_entity.tag, text)
            }
            self.notify(true)
          })
          // 双击选中标签
          this.annotator.on('labelDbclicked', (id: any) => {
            this.$emit('set-element-id', window.event.target.id)
            logInfo('labelDbclicked', id)
            self.lastSelectId = id
            let child = self.annotator.getEntityById(id)
            // 更新选中文本
            const text = child.text
            this.$emit('choose-snippet', text)
            self.updateLastItem(child.id, child.begin, child.end, child.tag, child.text)
          })

          // remove 操作,移除标注片段
          // 输出用户点击的label的ID, 被点击时鼠标的 X,Y 值
          this.annotator.on('labelRightClick', (id: any, x: any, y: any) => {
            logInfo('labelRightClicked', id, x, y)
            self.lastSelectId = null
            self.notify(true)
            // label删除在自动审核模式下
          })

          // 连线操作
          // 输出用户选取的两个label的ID
          this.annotator.on('twoLabelsClick', (first: any, second: any) => {
            logInfo('twoLabelsClick', first, second)
            self.notify(true)
          })

          // 输出用户点击的Connection的ID, 被点击时鼠标的 X,Y 值
          this.annotator.on('connectionRightClick', (id: any, x: any, y: any) => {
            logInfo('connectionRightClick', id, x, y)
            self.notify(true)
          })
        }
      }
    },
    // 新增一条审阅意见
    reviewAdd(msg: string) {
      const self = this
      logInfo('reviewAdd', msg, self.role, self.initalMode)
      if (self.role === false || self.initalMode !== '批量审阅') {
        return
      }
      let obj1 = {}
      if (msg !== '标记合格') {
        if (self.lastItem == null) {
          logInfo('lastItem', self.lastItem)
          return
        } else {
          self.deepClone(self.lastItem, obj1)
        }
      }
      // 设置一个标注后是否清空最后选中片段
      // self.lastItem = null
      let reviewData = { msg: msg, target: obj1 }
      logInfo('add-review-result')
      this.$emit('add-review-result', reviewData)
      logInfo('add-review-result done')
    },
    // 删除一条审阅意见
    reviewRemove(value: any) {
      this.$emit('remove-review-result', value)
    },
    // 数据发生了变化，通知父组件更新数据
    notify(isChanged: boolean) {
      const v = this.annotator.getValue()
      v.entities = v.entities.filter((e: any) => e.tag !== '')
      logInfo('notify', v)
      if (this.checkEntities) {
        this.check(v.entities)
      }
      v.did = this.initalDid
      this.$emit('update-ann-data', v, isChanged)
    },
    // 加载标注annotation相关js
    loadjs() {
      const self = this
      if (!window.Anno) {
        // new Script('http://192.168.0.100/static/js/annotation.js', () => {
        //   new Script('http://192.168.0.100/static/js/annotation-formatter.js', self.initAnnotator)
        // })
        new Script('/annotation.js', () => {
          new Script('/annotation-formatter.js', self.initAnnotator)
        })
      } else {
        self.initAnnotator()
      }
    },
    arrOfOneDimension(arr) {
      for (let key of arr) {
        if (Array.isArray(key)) {
          this.arrOfOneDimension(key)
        } else {
          newArr
        }
      }
    },
    // 检查重复标注
    check(entities: string | any[]) {
      // 情感分析这个类别下的，不允许冲突
      // 其他指标下的，不允许冲突

      const _sentiments = this.initalTags
        .filter((e: any) => e.type.indexOf('情感') > -1 || ['话题分析', 'sentiment', 'intent'].includes(e.type))
        .reduce((a: string | any[], b: { child: any }) => a.concat(b.child), [])
        .map((e: { type: any; type_en: any; type_zh: any }) => [e.type, e.type_en, e.type_zh])
      const _aspects = this.initalTags
        .filter((e: any) => e.type.indexOf('情感') == -1 && e.type != '话题分析' && e.type != '待解决' && e.type != 'sentiment' && e.type != 'intent')
        .reduce((a: string | any[], b: { child: any }) => a.concat(b.child), [])
        .map((e: { type: any; type_en: any; type_zh: any }) => [e.type, e.type_en, e.type_zh])
      const sentiments = _sentiments.flat()
      const aspects = _aspects.flat()
      logInfo('sentiments', sentiments)
      const sentiments_indexes = new Set()
      const aspects_indexes = new Set()
      for (let index = 0; index < entities.length; index++) {
        const element = entities[index]
        const aaa = [...Array(element.end - element.begin + 1).keys()].map((i) => i + element.begin)
        if (sentiments.includes(element.tag)) {
          const intersect = new Set(aaa.filter((x) => sentiments_indexes.has(x)))
          if (intersect.size > 0) {
            alert(`"${element.tag} - ${element.text} ${langConfig.alice.er.duplicateMsg[this.lang]}"`)
          }
          aaa.forEach(sentiments_indexes.add, sentiments_indexes)
        } else if (aspects.includes(element.tag)) {
          const intersect = new Set(aaa.filter((x) => aspects_indexes.has(x)))
          if (intersect.size > 0) {
            alert(`"${element.tag} - ${element.text} ${langConfig.alice.er.duplicateMsg[this.lang]}"`)
          }
          aaa.forEach(aspects_indexes.add, aspects_indexes)
        }
      }
    },
    // 添加label
    // updateLabelText(start: number, end: number, label: string) {
    //   logInfo('updateLabelText', label, start, end)
    //   this.annotator.addLabel(label, start, end)
    //   this.notify(true)
    // },
    // 更新当前的指标
    updateLabel(label: string) {
      logInfo('updateLabel', label)
      let self = this
      if (self.isRevisability()) {
        // 快捷键为正面
        if (label === '正面') {
          // 判断【正面】或【positive】是否在指标树中
          if (!self.tagsDict['正面'] && !self.tagsDict['positive']) {
            ElMessage.warning(langConfig.alice.er.tagNotExists[this.lang])
            return
          } else {
            label = self.tagsDict['正面'] ? self.tagsDict['正面'][self.lang] : self.tagsDict['positive'][self.lang]
          }
        }
        // 快捷键为负面
        if (label === '负面') {
          // 判断【负面】或【negative】是否在指标树中
          if (!self.tagsDict['负面'] && !self.tagsDict['negative']) {
            ElMessage.warning(langConfig.alice.er.tagNotExists[this.lang])
            return
          } else {
            label = self.tagsDict['负面'] ? self.tagsDict['负面'][self.lang] : self.tagsDict['negative'][self.lang]
          }
        }
        // 快捷键为咨询/求助
        if (label === '咨询/求助') {
          // 判断【咨询/求助】或【consult】是否在指标树中
          if (!self.tagsDict['咨询/求助'] && !self.tagsDict['consult']) {
            ElMessage.warning(langConfig.alice.er.tagNotExists[this.lang])
            return
          } else {
            label = self.tagsDict['咨询/求助'] ? self.tagsDict['咨询/求助'][self.lang] : self.tagsDict['consult'][self.lang]
          }
        }
        label = self.tagsDict[label] ? self.tagsDict[label][self.lang] : label
        self.lastSelectTag = label
        let child = null
        // 如果在没有历史id的状态下，且上一次选择的Item存在，则自动添加新的
        if (self.lastSelectId == null) {
          if (self.lastItem != null && self.lastItem.begin > -1 && self.lastItem.end > -1) {
            self.annotator.clearEmptyLabel()
            self.annotator.addLabel(label, self.lastItem.begin, self.lastItem.end + 1)
            child = self.annotator.getLastChild()
            logInfo('updateLabel > 2', child)
            self.updateLastItem(child.id, child.startIndex, child.endIndex - 1, label, self.lastItem.text)
            if (self.isAutoReview()) {
              child = self.annotator.getLastChild()
              // 漏标情感，漏标分类
              if (['正面', '负面', 'positive', 'negative'].includes(label)) {
                self.reviewAdd('漏标情感')
              } else {
                self.reviewAdd('漏标分类')
              }
            }
            self.notify(true)
          }
          return
        }
        child = self.annotator.getLabelById(self.lastSelectId)
        const c = self.annotator.getLabelCategoryByText(label)
        self.annotator.updateLabel(child.id, c.id, child.startIndex, child.endIndex)
        self.updateLastItem(child.id, child.startIndex, child.endIndex - 1, label, self.annotator.getText(child.startIndex, child.endIndex))
        self.notify(true)
        self.lastSelectId = null
      }
    },

    /**
     * 深度克隆
     * @param   origin 被拷贝的原对象
     * @param   target 拷贝出来的对象
     * @return         拷贝出来的对象
     */
    deepClone(origin: any, target: any) {
      target = target || {}
      const toStr = Object.prototype.toString
      for (let prop in origin) {
        if (origin.hasOwnProperty(prop)) {
          //不能把原型链上的一起拷贝了
          //判断是元素类型还是引用类型
          if (typeof origin[prop] == 'object' && typeof origin[prop] !== 'null') {
            target[prop] = toStr.call(prop) == '[object Array]' ? [] : {}
            arguments.callee(origin[prop], target[prop]) //递归调用
          } else {
            target[prop] = origin[prop] //原始类型直接复制
          }
        }
      }

      return target
    },
    // 更新查询的指标
    updateSearchTag(tag: string) {
      if (this.tagsDict && this.tagsDict[tag]) {
        this.searchTag = this.tagsDict[tag][this.lang]
      } else {
        this.searchTag = tag
      }
    }
  },
  mounted() {
    this.loadjs()
    this.$bus.$on('select-tag-anno', this.updateLabel)
    this.$bus.$on('positive', () => this.updateLabel('正面'))
    this.$bus.$on('negative', () => this.updateLabel('负面'))
    this.$bus.$on('consult', () => this.updateLabel('咨询/求助'))
    this.$bus.$on('add-review', this.reviewAdd)
    this.$bus.$on('remove-review', this.reviewRemove)
    this.$bus.$on('search-tag', this.updateSearchTag)
  },
  beforeUnmount() {
    this.$bus.$off('select-tag-anno')
    this.$bus.$off('positive')
    this.$bus.$off('negative')
    this.$bus.$off('consult')
    this.$bus.$off('add-review')
    this.$bus.$off('remove-review')
    this.$bus.$off('add-review-result')
    this.$bus.$off('remove-review-result')
    this.$bus.$off('search-tag')
  }
})
</script>
