/**
 * @author wangshuzhao
 * @date 2019-03-22
 * @description 格式化服务器返回数据，使得可以在poplar-annotation中使用
 * @description 默认labelCategories为 空字符串（id:0),正面(id:1),负面(id:2)
 * 空字符串作用是用户选中text时能使text高亮
 * @param data 标注数据
 * @param list 可选的label
 * @returns formartDate{}
 */
const format = (data, list) => {
  var formatData = {
    content: '',
    labelCategories: [
      {
        id: 0,
        text: '',
        color: '#cccccc',
        borderColor: '#cccccc'
      },
      {
        id: 1,
        text: '正面',
        color: '#1BDC8F',
        borderColor: '#92efcf'
      },
      {
        id: 2,
        text: '[人]正面',
        color: '#1BDC8F',
        borderColor: '#92efcf'
      },
      {
        id: 3,
        text: '[P]正面',
        color: '#1BDC8F',
        borderColor: '#92efcf'
      },
      {
        id: 4,
        text: '负面',
        color: '#FF9292',
        borderColor: '#f7a485'
      },
      {
        id: 5,
        text: '[人]负面',
        color: '#FF9292',
        borderColor: '#f7a485'
      },
      {
        id: 6,
        text: '[P]负面',
        color: '#FF9292',
        borderColor: '#f7a485'
      },
      {
        id: 7,
        text: '咨询/求助',
        color: '#41b6e6',
        borderColor: '#41b6e6'
      },
      {
        id: 8,
        text: '[人]咨询/求助',
        color: '#41b6e6',
        borderColor: '#41b6e6'
      },
      {
        id: 9,
        text: '[P]咨询/求助',
        color: '#41b6e6',
        borderColor: '#41b6e6'
      },
      {
        id: 10,
        text: 'positive',
        color: '#1BDC8F',
        borderColor: '#92efcf'
      },
      {
        id: 11,
        text: '[人]positive',
        color: '#1BDC8F',
        borderColor: '#92efcf'
      },
      {
        id: 12,
        text: '[P]positive',
        color: '#1BDC8F',
        borderColor: '#92efcf'
      },
      {
        id: 13,
        text: 'negative',
        color: '#FF9292',
        borderColor: '#f7a485'
      },
      {
        id: 14,
        text: '[人]negative',
        color: '#FF9292',
        borderColor: '#f7a485'
      },
      {
        id: 15,
        text: '[P]negative',
        color: '#FF9292',
        borderColor: '#f7a485'
      },
      {
        id: 16,
        text: 'consult',
        color: '#41b6e6',
        borderColor: '#41b6e6'
      },
      {
        id: 17,
        text: '[人]consult',
        color: '#41b6e6',
        borderColor: '#41b6e6'
      },
      {
        id: 18,
        text: '[P]consult',
        color: '#41b6e6',
        borderColor: '#41b6e6'
      }
    ],
    labels: [],
    connectionCategories: [],
    connections: []
  }

  // content 内容赋值
  formatData.content = data.content

  /**
   * @description 遍历产出labelCategories
   */
  let labelCategories = function (el, index, type) {
    if (index === -1) {
      el.categoryId = formatData.labelCategories.length
      formatData.labelCategories.push({
        id: formatData.labelCategories.length,
        text: el[type],
        color: '#cccccc',
        borderColor: '#cccccc'
      })
    } else {
      el.categoryId = formatData.labelCategories[index].id
      formatData.labelCategories[index].color = el.color && formatData.labelCategories[index].color === '#cccccc' ? el.color : formatData.labelCategories[index].color
      formatData.labelCategories[index].borderColor = el.color && formatData.labelCategories[index].borderColor === '#cccccc' ? el.color : formatData.labelCategories[index].borderColor
    }
  }

  // 做此遍历，以防止data数据中有某label，但在list中却没有此label
  data.entities.forEach(function (e, i) {
    labelCategories(e, formatData.labelCategories.has('text', e.tag), 'tag')
  })

  //遍历list，添加可选的label
  list
    .reduce((a, b) => a.concat(b.child), [])
    .map(function (e, i) {
      labelCategories(e, formatData.labelCategories.has('text', e.type), 'type')
    })

  /**
   * @description labels
   */
  formatData.labels = data.entities.map(function (e, i) {
    var labels = {}
    labels.startIndex = e.begin
    labels.endIndex = e.end + 1
    labels.id = e.id
    labels.categoryId = e.categoryId
    return labels
  })
  // 排序，先正负面，再渲染其他
  // .sort((a, b) => a.categoryId - b.categoryId);

  /**
   * @description connectionCategories
   * 目前connectionCategories 只有默认 为 表达
   */
  formatData.connectionCategories = [
    {
      id: 0,
      text: '表达'
    }
  ]

  /**
   * @description connections
   */
  formatData.connections = data.relations
    .filter((e) => formatData.labels.has('id', parseInt(e.aspect)) > -1)
    .map(function (e, i) {
      let relations = {}
      relations.id = i
      relations.categoryId = 0
      relations.fromId = e.aspect
      relations.toId = e.sentiment
      return relations
    })

  return formatData
}

/**
 * @description 判断数组中对对象有无某值，有返回index ，无返回 -1
 * key: 要比较的数组中对象的键名
 * value: 对比的值
 */
Array.prototype.has = function (key, value) {
  for (var i = 0; i < this.length; i++) {
    if (value === this[i][key]) {
      return i
    }
  }
  return -1
}

const { Annotator, Action } = window.Poplar
const log = console.log.bind(console)

/**
 * @author wangshuzhao
 * @date 2019-03-25
 * @class annotator
 * @description 封装Annotator类，以方便外部实例化调用
 */
window.Anno = class {
  constructor(data, labelCategories, maxLineWidth, el) {
    const formatData = format(data, labelCategories)
    el.style.maxWidth = '100%'
    el.style.overflow = 'auto'

    this.Annotator = new Annotator(formatData, el, {
      maxLineWidth,
      allowMultipleLabel: true
    })
    this.renderEvents = [] //select,labelClick,labelRightClick,twoLabelsClick,connectRightClick.
    this.currentSelection = null
    this.init()
  }

  //初始化annotator，事件监听初始化。

  init() {
    const anno = this.Annotator
    anno.on('textSelected', (start, end) => {
      // 填充英文单词完整
      if (!window.event.ctrlKey) {
        // 只有标注的片段里开头第一个为英文才填充
        const enStartIndex = this.store.content.slice(0, start + 1).match(/[a-zA-Z]+$/)
        if (enStartIndex && enStartIndex[0].length < 4) {
          start = start - enStartIndex[0].length + 1
        }
        // 只有标注的片段里最后一个为英文才填充
        const enEndIndex = this.store.content.slice(end - 1).match(/^[a-zA-Z]+/)
        if (enEndIndex && enEndIndex[0].length < 4) {
          end = end + enEndIndex[0].length - 1
        }
        const text = this.getText(start, end)
        // 如果只标注了一个字符，拒绝标注
        if (text.length === 1) return
        // 去除片段前后标点
        const punctuationStartIndex = text.match(/^[。，！？\.,\!\?\s]+/)
        if (punctuationStartIndex && punctuationStartIndex[0].length < 4) {
          start += punctuationStartIndex[0].length
        }
        const punctuationEndIndex = text.match(/[。，！？\.,\!\?\s]+$/)
        if (punctuationEndIndex && punctuationEndIndex[0].length < 4) {
          end -= punctuationEndIndex[0].length
        }
      }
      this.currentSelection = null
      if (this.getLastChild() && this.getLastChild().categoryId === 0) {
        anno.applyAction(Action.Label.Delete(this.getLastChild().id))
      }
      anno.applyAction(Action.Label.Create(0, start, end))
      this.renderEvents.select && this.renderEvents.select.forEach((e) => e(start, end))
    })

    anno.on('labelClicked', (id) => {
      this.renderEvents.labelClick && this.renderEvents.labelClick.forEach((e) => e(id))
    })

    anno.on('labelDbclicked', (id) => {
      this.currentSelection = id
      this.renderEvents.labelDbclicked && this.renderEvents.labelDbclicked.forEach((e) => e(id))
    })

    anno.on('labelRightClicked', (id, x, y) => {
      this.delLabel(id)
      this.renderEvents.labelRightClick && this.renderEvents.labelRightClick.forEach((e) => e(id, x, y))
    })

    anno.on('twoLabelsClicked', (first, second) => {
      let from,
        to,
        firstCategoryId = this.getLabelById(first).categoryId,
        secondCategoryId = this.getLabelById(second).categoryId
      // label自身链接不允许
      if (first === second) return
      // label还没赋值text，则不能连线
      if (firstCategoryId === 0 || secondCategoryId === 0) return

      let max = Math.max(firstCategoryId, secondCategoryId)
      let min = Math.min(firstCategoryId, secondCategoryId)

      if (max === firstCategoryId) {
        from = first
        to = second
      } else {
        from = second
        to = first
      }

      // 如果此连接已存在，不能连线
      if (this.store.connections.some((e) => e.fromId === from && e.toId === to)) {
        return
      }
      // 判断此链接是否是 正负面label 连接到其他label ，是则连线，不是则不能链接
      if (max > 18 && min <= 18) {
        this.addConnection(0, from, to)
      }
      this.renderEvents.twoLabelsClick && this.renderEvents.twoLabelsClick.forEach((e) => e(first, second))
    })
    // 移除连接
    anno.on('connectionRightClicked', (id, x, y) => {
      anno.applyAction(Action.Connection.Delete(id))
      this.renderEvents.connectionRightClick && this.renderEvents.connectionRightClick.forEach((e) => e(id, x, y))
    })
  }

  warning(message) {
    log(message)
  }

  //获取当前store信息
  get store() {
    return this.Annotator.store.json
  }

  /**
   *@description 添加label
   *@param categoryId
   *@param startIndex 选中text的起始位置
   *@param endIndex 选中text的末位置
   */
  addLabel(text, startIndex, endIndex) {
    console.log('addLabel', text, startIndex, endIndex)
    let categoryId = this.store.labelCategories.filter((e) => e.text === text)[0]
    if (!categoryId) {
      alert('此值在labelCategories里不存在')
      return
    }
    this.Annotator.applyAction(Action.Label.Create(categoryId.id, startIndex, endIndex))
    this.currentSelection = null
  }

  /**
   *@description 删除label
   *@param id label 的 id
   */
  delLabel(id) {
    let connections = this.getRelations()
    connections.forEach((e) => {
      if (e.fromId === id || e.toId === id) {
        this.Annotator.applyAction(Action.Connection.Delete(e.id))
      }
    })
    if (this.currentSelection == id) this.currentSelection = null
    this.Annotator.applyAction(Action.Label.Delete(id))
  }

  /**
   *@description 更新label
   *@param id label 的 id
   *@param text 用户选中的label的文字(本该用id匹配，但原始数据没提供id，故用文字匹配)
   */
  updateLabel(id, categoryId, start, end) {
    // TODO: 当变更label时，label间的连线可能会变为不合法
    this.Annotator.applyAction(Action.Label.Update(id, categoryId, start, end))
  }

  /**
   *@description 添加连接
   *@param id connectionCategories 的 id
   *@param from label 的 id
   *@param to label 的 id
   */
  addConnection(id, from, to) {
    this.Annotator.applyAction(Action.Connection.Create(id, from, to))
  }

  /**
   *@description 获取最后一个添加的label
   *@returns label{}
   */
  getLastChild() {
    return this.currentSelection === null ? this.store.labels[this.store.labels.length - 1] : this.getLabelById(this.currentSelection)
  }

  /**
   *@description 获取对应id的label
   *@param id
   *@returns label{}
   */
  getLabelById(id) {
    return this.store.labels.filter((e) => e.id === id)[0]
  }

  getRelations() {
    return this.store.connections
  }

  getLabelCategoryById(id) {
    return this.store.labelCategories.filter((e) => e.id === id)[0]
  }

  getLabelCategoryByText(text) {
    return this.store.labelCategories.filter((e) => e.text === text)[0]
  }
  /**
   *@description 绑定监听事件,可以多次绑定同一事件，按顺序执行
   *@param name 方法名(select,labelClick,labelRightClick,twoLabelsClick,connectRightClick)
   *@param fn 回调函数
   */
  on(name, fn) {
    if (this.renderEvents[name]) this.renderEvents[name].push(fn)
    else this.renderEvents[name] = [fn]
  }
  remove() {
    if (this.Annotator) {
      this.Annotator.remove()
    }
  }

  getText(start, end) {
    return this.store.content.slice(start, end)
  }
  /**
   * 将label转为entity形式
   */
  getEntity(e) {
    let label = {}
    label.begin = e.startIndex
    label.end = e.endIndex - 1
    label.id = e.id
    label.tag = this.getLabelCategoryById(e.categoryId).text
    label.text = this.store.content.slice(e.startIndex, e.endIndex)
    return label
  }
  //清空未标记lable的数据
  clearEmptyLabel() {
    this.store.labels.filter((e) => e.categoryId === 0).map((e) => this.delLabel(e.id))
  }

  getEntityById(id) {
    return this.getEntity(this.getLabelById(id))
  }

  getValue() {
    let value = {}
    let { labels, connections, content } = this.store

    value.entities = labels.map((e) => this.getEntity(e))
    value.relations = connections.map((e) => {
      let connection = {}
      connection.aspect = e.fromId
      connection.sentiment = e.toId
      connection.type = '表达'
      return connection
    })
    return value
  }
}
