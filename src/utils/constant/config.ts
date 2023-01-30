declare type formulaType = {
  [key: string]: any
}
export const formula: formulaType = {
  'shade-1': 'color(primary shade(10%))',
  'light-1': 'color(primary tint(10%))',
  'light-2': 'color(primary tint(20%))',
  'light-3': 'color(primary tint(30%))',
  'light-4': 'color(primary tint(40%))',
  'light-5': 'color(primary tint(50%))',
  'light-6': 'color(primary tint(60%))',
  'light-7': 'color(primary tint(70%))',
  'light-8': 'color(primary tint(80%))',
  'light-9': 'color(primary tint(90%))'
}

export const langConfig = {
  header: {
    switch: {
      '/zh-CN': '切换主题色',
      '/en-US': 'Change Theme Color'
    },
    download: {
      '/zh-CN': '下载主题',
      '/en-US': 'Download Theme'
    },
    help: {
      '/zh-CN': '帮助',
      '/en-US': 'Help'
    },
    fullScreen: {
      '/zh-CN': '全屏预览',
      '/en-US': 'Full Screen'
    },
    exitFullScreen: {
      '/zh-CN': '退出全屏',
      '/en-US': 'Exit FullScreen'
    },
    user: {
      homePage: {
        '/zh-CN': '首页',
        '/en-US': 'HomePage'
      },
      personalCenter: {
        '/zh-CN': '个人中心',
        '/en-US': 'Personal Center'
      },
      personalSetting: {
        '/zh-CN': '个人设置',
        '/en-US': 'Personal Setting'
      },
      logout: {
        '/zh-CN': '退出登录',
        '/en-US': 'Logout'
      }
    }
  },
  form: {
    theme: {
      '/zh-CN': '主题色',
      '/en-US': 'Theme Color'
    },
    headerArea: {
      '/zh-CN': '顶栏',
      '/en-US': 'Header Area'
    },
    sidebarLogo: {
      '/zh-CN': '侧边栏 logo',
      '/en-US': 'Sidebar Logo'
    },
    headerFixed: {
      '/zh-CN': '固定顶栏',
      '/en-US': 'Header Fixed'
    },
    switch: {
      '/zh-CN': '切换',
      '/en-US': 'Change'
    },
    reset: {
      '/zh-CN': '重置',
      '/en-US': 'Reset'
    },
    layout: {
      '/zh-CN': '自定义位置',
      '/en-US': 'Grid Layout'
    },
    tagButton: {
      '/zh-CN': '指标大小',
      '/en-US': 'Tag Size'
    },
    tagHorizontalLayout: {
      '/zh-CN': '指标树横向布局',
      '/en-US': 'Tag Horizontal Layout'
    },
    oldVersion: {
      '/zh-CN': '旧版本界面',
      '/en-US': 'Old Version UI'
    },
    position: {
      '/zh-CN': '自定义位置',
      '/en-US': 'Change Position'
    },
    themePick: {
      '/zh-CN': '主题风格',
      '/en-US': 'Theme'
    },
    contentArea: {
      '/zh-CN': '内容区域',
      '/en-US': 'Content Area'
    },
    annotator: {
      '/zh-CN': '标注区域',
      '/en-US': 'Annotation Area'
    }
  },
  home: {
    internationTip: {
      '/zh-CN': '切换语言可进行国际化',
      '/en-US': 'Change Lang for Internationalization'
    },
    email: {
      '/zh-CN': '帐号',
      '/en-US': 'Email'
    },
    password: {
      '/zh-CN': '密码',
      '/en-US': 'Password'
    },
    login: {
      '/zh-CN': '登录',
      '/en-US': 'Login'
    }
  },
  breadcrumb: {
    main: {
      '/zh-CN': '首页',
      '/en-US': 'Main'
    },
    project: {
      '/zh-CN': '项目',
      '/en-US': 'Project'
    }
  },
  train: {
    evaluate: {
      report1: {
        '/zh-CN': '评估报告',
        '/en-US': 'Evaluation'
      },
      report2: {
        '/zh-CN': '正负评估报告',
        '/en-US': 'Sentiment Evaluation'
      },
      errorReport: {
        '/zh-CN': '错误的评估报告',
        '/en-US': 'Error Evaluation'
      },
      first: {
        '/zh-CN': '一级指标',
        '/en-US': 'Aspect 1'
      },
      second: {
        '/zh-CN': '二级指标',
        '/en-US': 'Aspect 2'
      },
      sentiment: {
        '/zh-CN': '情感',
        '/en-US': 'Sentiment'
      },
      precision: {
        '/zh-CN': '精度',
        '/en-US': 'Precision'
      },
      recall: {
        '/zh-CN': '召回',
        '/en-US': 'Recall'
      },
      f1: {
        '/zh-CN': 'F1',
        '/en-US': 'F1'
      },
      accuracy: {
        '/zh-CN': '准确率',
        '/en-US': 'Accuracy'
      },
      actual: {
        '/zh-CN': '标注数',
        '/en-US': 'Amount'
      },
      一致: {
        '/zh-CN': '一致',
        '/en-US': 'Correct'
      },
      情感错误: {
        '/zh-CN': '情感错误',
        '/en-US': 'Wrong Sentiment'
      },
      分类未识别: {
        '/zh-CN': '分类未识别',
        '/en-US': 'Missing Aspect'
      },
      分类误判: {
        '/zh-CN': '分类误判',
        '/en-US': 'Wrong Aspect'
      },
      content: {
        '/zh-CN': '评论内容',
        '/en-US': 'Content'
      },
      equal: {
        '/zh-CN': '是否一致',
        '/en-US': 'Correctness'
      },
      a_first: {
        '/zh-CN': '人工-一级分类',
        '/en-US': 'Labeled Aspect 1'
      },
      a_second: {
        '/zh-CN': '人工-二级分类',
        '/en-US': 'Labeled Aspect 2'
      },
      a_sentiment: {
        '/zh-CN': '人工-情感',
        '/en-US': 'Labeled Sentiment'
      },
      m_first: {
        '/zh-CN': 'CEM-一级分类',
        '/en-US': 'Predicted Aspect 1'
      },
      m_second: {
        '/zh-CN': 'CEM-二级分类',
        '/en-US': 'Predicted Aspect 2'
      },
      m_sentiment: {
        '/zh-CN': 'CEM-情感',
        '/en-US': 'Predicted Sentiment'
      },
      showAllTag: {
        '/zh-CN': '显示全部',
        '/en-US': 'Show All Tag'
      },
      viewType: {
        '/zh-CN': '词对模式',
        '/en-US': 'Words Pattern'
      },
      annotation: {
        '/zh-CN': '去标注',
        '/en-US': 'Annotate it'
      },
      tagFrom: {
        '/zh-CN': '[人]',
        '/en-US': '[P]'
      },
      pRestult: {
        '/zh-CN': '人工标注结果',
        '/en-US': 'People Result'
      },
      mRestult: {
        '/zh-CN': '模型识别结果',
        '/en-US': 'Model Result'
      },
      loadMore: {
        '/zh-CN': '加载更多中，请稍等...',
        '/en-US': 'Loading...'
      },
      total: {
        '/zh-CN': '总',
        '/en-US': 'In Total'
      }
    }
  },
  alice: {
    task: {
      task: {
        '/zh-CN': '任务',
        '/en-US': 'Task'
      },
      all: {
        '/zh-CN': '全部',
        '/en-US': 'All'
      },
      tag: {
        '/zh-CN': '标签',
        '/en-US': 'Tag'
      },
      schedule: {
        '/zh-CN': '进度',
        '/en-US': 'Progress'
      },
      export: {
        '/zh-CN': '导出',
        '/en-US': 'Export'
      },
      operation: {
        '/zh-CN': '操作',
        '/en-US': 'Operation'
      },
      analyse: {
        '/zh-CN': '分析',
        '/en-US': 'Analyse'
      },
      annotation: {
        '/zh-CN': '开始标注',
        '/en-US': 'Annotation'
      },
      review: {
        '/zh-CN': '开始审阅',
        '/en-US': 'Check'
      },
      top: {
        '/zh-CN': '置顶',
        '/en-US': 'Pin'
      }
    },
    er: {
      hideTag: {
        '/zh-CN': '隐藏标签',
        '/en-US': 'Hide the Tags'
      },
      showTag: {
        '/zh-CN': '展开标签',
        '/en-US': 'Show the Tags'
      },
      checkRepetition: {
        '/zh-CN': '检查重复标注',
        '/en-US': 'Check for Duplicate Tags'
      },
      NotcheckRepetition: {
        '/zh-CN': '不检查重复标注',
        '/en-US': 'Do Not Check for Duplicate Tags'
      },
      simSearch: {
        '/zh-CN': '指标推荐',
        '/en-US': 'Tag Recommendation'
      },
      NotsimSearch: {
        '/zh-CN': '不使用指标推荐',
        '/en-US': 'Do Not Use Tag Recommendation'
      },
      noReferenceYet: {
        '/zh-CN': '暂无推荐',
        '/en-US': 'No reference yet'
      },
      prev: {
        '/zh-CN': '上一条',
        '/en-US': 'prev'
      },
      next: {
        '/zh-CN': '下一条',
        '/en-US': 'next'
      },
      positive: {
        '/zh-CN': '正面',
        '/en-US': 'positive'
      },
      negative: {
        '/zh-CN': '负面',
        '/en-US': 'negative'
      },
      consult: {
        '/zh-CN': '咨询/求助',
        '/en-US': 'consult'
      },
      save: {
        '/zh-CN': '保存',
        '/en-US': 'save'
      },
      position: {
        '/zh-CN': '自定义位置',
        '/en-US': 'change position'
      },
      quality: {
        '/zh-CN': '质量小助手',
        '/en-US': 'quality'
      },
      text: {
        '/zh-CN': '文本',
        '/en-US': 'text'
      },
      timeFalg: {
        '/zh-CN': '插眼',
        '/en-US': 'mark'
      },
      cancelTimeFalg: {
        '/zh-CN': '取消插眼',
        '/en-US': 'cancel mark'
      },
      timeFalgInfo: {
        '/zh-CN': '标记一下，回头再看',
        '/en-US': 'make a mark and check it later'
      },
      special: {
        '/zh-CN': '奇怪',
        '/en-US': 'special'
      },
      cancelSpecial: {
        '/zh-CN': '取消奇怪',
        '/en-US': 'cancel special'
      },
      specialInfo: {
        '/zh-CN': '不明所以，有问题的数据',
        '/en-US': 'problematic data'
      },
      spam: {
        '/zh-CN': '灌水',
        '/en-US': 'nonsense'
      },
      cancelSpam: {
        '/zh-CN': '取消灌水',
        '/en-US': 'cancel nonsense'
      },
      spamInfo: {
        '/zh-CN': '垃圾评论，没啥价值',
        '/en-US': 'spam comments'
      },
      notPrev: {
        '/zh-CN': '已经到头啦~',
        '/en-US': "It's the first one"
      },
      notNext: {
        '/zh-CN': '已经到底啦~',
        '/en-US': "It's the last one"
      },
      duplicateMsg: {
        '/zh-CN': '与已有标注片段存在重叠，请修正',
        '/en-US': 'Overlap with existing annotated fragments, pls correct it'
      },
      note: {
        '/zh-CN': '当前模式有未提交的更改，切换模式不会自动保存，是否跳转页面',
        '/en-US': 'Note: The annotations are unsaved. Switch to another mode will not be auto saved.'
      },
      notSave: {
        '/zh-CN': '未保存',
        '/en-US': 'Not save'
      },
      doNotSave: {
        '/zh-CN': '跳转',
        '/en-US': 'do not save'
      },
      cancel: {
        '/zh-CN': '取消',
        '/en-US': 'cancel'
      },
      copyIdInfo: {
        '/zh-CN': '复制数据：  ',
        '/en-US': 'copy data:'
      },
      copyError: {
        '/zh-CN': '复制失败',
        '/en-US': 'copy data id error'
      },
      did: {
        '/zh-CN': '数据id',
        '/en-US': 'data id'
      },
      modify: {
        '/zh-CN': '修改于',
        '/en-US': 'modify'
      },
      oldVersion: {
        '/zh-CN': '旧版本界面',
        '/en-US': 'old version ui'
      },
      saveNullData: {
        '/zh-CN': '保存了一条空标注结果的数据',
        '/en-US': 'save a null entities data'
      },
      goToPcs: {
        '/zh-CN': '前往',
        '/en-US': 'Go to pcs'
      },
      pcs: {
        '/zh-CN': '条',
        '/en-US': ''
      },
      tagNotExists: {
        '/zh-CN': '指标不再指标树中',
        '/en-US': 'Tag not exists'
      }
    },
    review: {
      allUser: {
        '/zh-CN': '全部人员',
        '/en-US': 'all user'
      },
      all: {
        '/zh-CN': '全部',
        '/en-US': 'all'
      },
      needToModify: {
        '/zh-CN': '未修订数据',
        '/en-US': 'Corrections Undone'
      },
      isModifyData: {
        '/zh-CN': '已修订数据',
        '/en-US': 'Corrections Done'
      },
      includeComments: {
        '/zh-CN': '包含审阅意见',
        '/en-US': 'include comments'
      },
      noCommentInclude: {
        '/zh-CN': '不包含审阅意见',
        '/en-US': 'no comments included'
      },
      多选文字: {
        '/zh-CN': '多选文字',
        '/en-US': 'too much text'
      },
      少选文字: {
        '/zh-CN': '少选文字',
        '/en-US': 'missing text'
      },
      漏标分类: {
        '/zh-CN': '漏标分类',
        '/en-US': 'missing aspect'
      },
      多标分类: {
        '/zh-CN': '多标分类',
        '/en-US': 'redundant aspect'
      },
      漏标情感: {
        '/zh-CN': '漏标情感',
        '/en-US': 'missing sentiment'
      },
      多标情感: {
        '/zh-CN': '多标情感',
        '/en-US': 'redundant sentiment'
      },
      分类错误: {
        '/zh-CN': '分类错误',
        '/en-US': 'aspect error'
      },
      情感错误: {
        '/zh-CN': '情感错误',
        '/en-US': 'sentiment error'
      },
      连线错误: {
        '/zh-CN': '连线错误',
        '/en-US': 'connection error'
      },
      标记合格: {
        '/zh-CN': '标记合格',
        '/en-US': 'correct'
      },
      timeFalg: {
        '/zh-CN': '插眼',
        '/en-US': 'mark'
      },
      special: {
        '/zh-CN': '奇怪',
        '/en-US': 'special'
      },
      spam: {
        '/zh-CN': '灌水',
        '/en-US': 'nonsense'
      },
      formatError: {
        '/zh-CN': '数据格式错误',
        '/en-US': 'format error'
      },
      start: {
        '/zh-CN': '开始时间',
        '/en-US': 'start date'
      },
      end: {
        '/zh-CN': '结束时间',
        '/en-US': 'end date'
      },
      searchKeyword: {
        '/zh-CN': '查询关键词',
        '/en-US': 'search term'
      },
      noSearchTag: {
        '/zh-CN': '不查询指标',
        '/en-US': 'no search tag'
      },
      cancelTagInfo: {
        '/zh-CN': '查询的指标，点击×可取消指标',
        '/en-US': 'click x to cancel the tag'
      },
      fuzzyQuery: {
        '/zh-CN': '模糊',
        '/en-US': 'fuzzy query'
      },
      fuzzyQueryTitle: {
        '/zh-CN': '关键词 和 标签不会强关联，且关键词是模糊匹配',
        '/en-US': 'keywords and tags are not strongly related, and keywords are fuzzy matching'
      },
      halfExactQuery: {
        '/zh-CN': '半精确',
        '/en-US': 'semi-precise query'
      },
      halfExactQueryTitle: {
        '/zh-CN': '关键词 和 标签不会强关联，且关键词是标签片段内匹配',
        '/en-US': 'keywords and tags are not strongly related, and keywords are matched within tag fragments'
      },
      exactQuery: {
        '/zh-CN': '精确',
        '/en-US': 'exact query'
      },
      exactQueryTitle: {
        '/zh-CN': '关键词 和 标签强关联，且关键词是完全匹配',
        '/en-US': 'keywords and tags are strongly related, and keywords are exactly matched'
      },
      reverseQuery: {
        '/zh-CN': '反查',
        '/en-US': 'reverse query'
      },
      reverseQueryTitle: {
        '/zh-CN': '含词 但不含标签',
        '/en-US': 'includes keywords, but no tags'
      },
      keyword: {
        '/zh-CN': '关键词',
        '/en-US': 'keyword'
      },
      tag: {
        '/zh-CN': '指标',
        '/en-US': 'tag'
      },
      data: {
        '/zh-CN': '标注数据',
        '/en-US': 'data'
      },
      tagId: {
        '/zh-CN': '标签ID',
        '/en-US': 'tag Id'
      },
      text: {
        '/zh-CN': '文本',
        '/en-US': 'text'
      },
      reviewOpinion: {
        '/zh-CN': '审阅意见',
        '/en-US': 'review opinion'
      },
      reviewer: {
        '/zh-CN': '审阅人员',
        '/en-US': 'reviewer'
      },
      reviewDate: {
        '/zh-CN': '审阅时间',
        '/en-US': 'review date'
      },
      delete: {
        '/zh-CN': '删除',
        '/en-US': 'delete'
      },
      reviewMessageBoxTitle: {
        '/zh-CN': '有待修改的审阅数据',
        '/en-US': 'Corrections Needed to be Done'
      },
      reviewMessageBoxInfo1: {
        '/zh-CN': '未修订总数：',
        '/en-US': 'Total: '
      },
      reviewMessageBoxInfo2: {
        '/zh-CN': '昨日新增审阅数据：',
        '/en-US': 'Updated Yesterday: '
      },
      reviewMessageBoxConfire: {
        '/zh-CN': '去修订',
        '/en-US': 'confirm'
      },
      isModify: {
        '/zh-CN': '已修正',
        '/en-US': 'ED'
      },
      searchRelations: {
        '/zh-CN': '关系标注',
        '/en-US': 'link'
      }
    },
    index: {
      tagError: {
        '/zh-CN': '指标未能正常加载，请刷新页面或确认是否配置指标',
        '/en-US': 'Fail to load the tags. Pls refresh the page or check whether there are tags configured.'
      }
    },
    tagTree: {
      addNewTag: {
        '/zh-CN': '添加新标签',
        '/en-US': 'Add tag'
      },
      addScene: {
        '/zh-CN': '一级标签/场景',
        '/en-US': 'Tag 1'
      },
      addTag: {
        '/zh-CN': '二级标签/标签',
        '/en-US': 'Tag 2'
      },
      addTagPlaceholder: {
        '/zh-CN': '请输入标签名',
        '/en-US': 'Type the tag name'
      },
      cancel: {
        '/zh-CN': '取消',
        '/en-US': 'Cancel'
      },
      confirm: {
        '/zh-CN': '确认',
        '/en-US': 'Confirm'
      }
    }
  },
  scene: {
    task: {
      name: {
        '/zh-CN': '任务名',
        '/en-US': 'name'
      },
      status: {
        '/zh-CN': '当前状态',
        '/en-US': 'status'
      },
      info: {
        '/zh-CN': '标注信息',
        '/en-US': 'info'
      },
      version: {
        '/zh-CN': '当前版本',
        '/en-US': 'version'
      },
      relations: {
        '/zh-CN': '关联任务',
        '/en-US': 'relations'
      },
      createdAt: {
        '/zh-CN': '创建时间',
        '/en-US': 'create'
      },
      updatedAt: {
        '/zh-CN': '最后更新时间',
        '/en-US': 'update'
      },
      operation: {
        '/zh-CN': '操作',
        '/en-US': 'operation'
      },
      searchPlaceholder: {
        '/zh-CN': '请输入查询任务',
        '/en-US': 'please input search name'
      },
      annotation: {
        '/zh-CN': '去标注',
        '/en-US': 'Annotation'
      }
    },
    er: {
      similarityScene: {
        '/zh-CN': '相似度-场景',
        '/en-US': 'Similarity-Tag 1'
      },
      similarityTag: {
        '/zh-CN': '相似度-场景',
        '/en-US': 'Similarity-Tag 2'
      },
      similarityRange: {
        '/zh-CN': '相似度-相似度',
        '/en-US': 'Similarity Range'
      },
      selectedScene: {
        '/zh-CN': '标注-场景',
        '/en-US': 'Selected-Tag 1'
      },
      selectedTag: {
        '/zh-CN': '标注-标签',
        '/en-US': 'Selected-Tag 2'
      },
      keywords: {
        '/zh-CN': '关键词组',
        '/en-US': 'Keywords'
      },
      beginsWith: {
        '/zh-CN': '开头为，只能在一个关键词组中',
        '/en-US': 'Begins with'
      },
      notInclude: {
        '/zh-CN': '不包含某些词',
        '/en-US': 'Not include'
      },
      or: {
        '/zh-CN': '空格表达或的关系,A B表示匹配到A或匹配到B',
        '/en-US': 'Or'
      },
      inputKeywords: {
        '/zh-CN': '请输入关键词组',
        '/en-US': 'Input keywords'
      },
      endsWith: {
        '/zh-CN': '结尾为，只能在一个关键词组中',
        '/en-US': 'Ends with'
      },
      query: {
        '/zh-CN': '查询',
        '/en-US': 'Query'
      },
      reverseQuery: {
        '/zh-CN': '反查询',
        '/en-US': 'Reverse Query'
      },
      emptyAllKeywords: {
        '/zh-CN': '清空关键词组',
        '/en-US': 'Empty all keywords'
      },
      queryTip: {
        '/zh-CN': '使用空格表示或，回车确认一组词组，词组之间为且的关系',
        '/en-US': 'Press [Enter] to confirm the key words. If more key words are imputed, it means all of them should appear in the same piece.'
      },
      typingNewPieces: {
        '/zh-CN': '新增片段',
        '/en-US': 'Typing new pieces'
      },
      typeHere: {
        '/zh-CN': '请输入新增片段',
        '/en-US': 'Type here'
      },
      typeTag: {
        '/zh-CN': '场景标签',
        '/en-US': 'Select tags'
      },
      typeTagPlaceholder: {
        '/zh-CN': '请选择场景标签',
        '/en-US': 'Pls select'
      },
      add: {
        '/zh-CN': '新增',
        '/en-US': 'Add'
      },
      addSnippetSuccess: {
        '/zh-CN': '新增片段成功',
        '/en-US': 'Added successfully'
      },
      queryCount: {
        '/zh-CN': function (count: any) {
          return `查询结果总共有 ${count} 条`
        },
        '/en-US': function (count: any) {
          return `${count} pieces results in total.`
        }
      },
      selectTag: {
        '/zh-CN': '当前选中的标签为',
        '/en-US': 'The selected tag is'
      },
      selectAll: {
        '/zh-CN': '选中全部',
        '/en-US': 'Select all'
      },
      addTagSuccessTip: {
        '/zh-CN': '添加标签成功,请通知其他标注人员刷新页面！',
        '/en-US': 'New tag is added successfully, please inform other users to refresh the page.'
      },
      isLastPage: {
        '/zh-CN': '这已经是最后一页了!',
        '/en-US': 'This is the last page.'
      },
      isFirstPage: {
        '/zh-CN': '这已经是第一页了!',
        '/en-US': 'This is the first page.'
      },
      notSelectTag: {
        '/zh-CN': '请选择标签',
        '/en-US': 'Pls select the tag'
      },
      addSnippetErrorTip: {
        '/zh-CN': '请输入新增片段或选择场景标签',
        '/en-US': 'Pls type new pieces or select a tag'
      },
      cleanCache: {
        '/zh-CN': '清除查询缓存',
        '/en-US': 'Clear query cache'
      },
      cleanCacheSucdess: {
        '/zh-CN': '清除缓存成功',
        '/en-US': 'Cache clear successfully.'
      },
      rightSelectTag: {
        '/zh-CN': '右键查询标注',
        '/en-US': 'Right click to choose the selected-tag.'
      },
      addNewTag: {
        '/zh-CN': '添加新标签',
        '/en-US': 'Add tag'
      },
      addScene: {
        '/zh-CN': '一级标签/场景',
        '/en-US': 'Tag 1'
      },
      addSceneZh: {
        '/zh-CN': '一级标签/标签-zh',
        '/en-US': 'Tag 1-zh'
      },
      addSceneEn: {
        '/zh-CN': '一级标签/标签-en',
        '/en-US': 'Tag 1-en'
      },
      addTag: {
        '/zh-CN': '二级标签/标签',
        '/en-US': 'Tag 2'
      },
      addTagZh: {
        '/zh-CN': '二级标签/标签-zh',
        '/en-US': 'Tag 2-zh'
      },
      addTagEn: {
        '/zh-CN': '二级标签/标签-en',
        '/en-US': 'Tag 2-en'
      },
      addTagPlaceholder: {
        '/zh-CN': '请输入标签名',
        '/en-US': 'Type the tag name'
      },
      cancel: {
        '/zh-CN': '取消',
        '/en-US': 'Cancel'
      },
      confirm: {
        '/zh-CN': '确认',
        '/en-US': 'Confirm'
      }
    }
  }
} as any

export default { formula, langConfig }
