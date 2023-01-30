<template>
  <div class="ymal-container">
    <div id="yaml-editor" ref="codemirror"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
import { computed } from '@vue/reactivity'
import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { gutter, keymap, lineNumbers, ViewUpdate } from '@codemirror/view'
import { linter, lintGutter, lintKeymap } from '@codemirror/lint'
import { defaultKeymap, historyKeymap, history } from '@codemirror/commands'
import jsyaml from 'js-yaml'
import logInfo from '@/utils/logInfo'
import { tags as t } from '@lezer/highlight'
const props = defineProps(['value', 'height', 'codemirrorId', 'disabled'])
const emit = defineEmits(['changed'])
let editorView = ref<EditorView>()
const codemirror = ref(null)
const doc = computed(() => props.value)
const codemirrorID = computed(() => props.codemirrorId)
const disabled = computed(() => props.disabled)
// yaml错误提示
const errorMessage = ref()
// codemirror 错误提示
const diagnostics = ref([] as any)
let startState
const createEditor = (editorContainer: any, doc: string) => {
  // 如果存在则销毁
  if (typeof editorView.value !== 'undefined') {
    editorView.value.destroy()
  }
  // 颜色配置，参考gitlab
  const myLightHighlightStyle = HighlightStyle.define([
    { tag: [t.atom, t.bool, t.special(t.variableName), t.null, t.number], color: '#008080' },
    { tag: [t.processingInstruction, t.string, t.inserted, t.literal], color: '#d14' },
    { tag: [t.comment], color: '#998' },
    { tag: [t.bracket, t.angleBracket, t.paren, t.brace, t.meta], color: '#1f1f1f' }
  ])
  let theme = new Compartment()
  startState = EditorState.create({
    doc: doc,
    extensions: [
      basicSetup,
      theme.of([syntaxHighlighting(myLightHighlightStyle)]),
      history(),
      lineNumbers(),
      keymap.of([...defaultKeymap, ...lintKeymap, ...historyKeymap]),
      StreamLanguage.define(yaml),
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          emit('changed', getValue())
          try {
            jsyaml.load(getValue())
            errorMessage.value = null
            diagnostics.value = []
          } catch (e) {
            errorMessage.value = e
            logInfo(e)
            const form = errorMessage.value.mark.position > errorMessage.value.mark.buffer.length ? errorMessage.value.mark.buffer.length - 1 : errorMessage.value.mark.position - 1
            diagnostics.value = [
              {
                severity: 'error',
                message: errorMessage.value.message,
                from: form,
                to: form
              }
            ]
          }
        }
      }),
      linter(() => diagnostics.value),
      lintGutter(),
      gutter({ class: 'cm-mygutter' }),
      // EditorView.contentAttributes.of({ contenteditable: disabled })
      EditorState.readOnly.of(disabled.value)
    ]
  })
  editorView.value = new EditorView({
    state: startState,
    parent: editorContainer
  })
}
const getValue = (): string | null => {
  return (editorView.value as EditorView).state.doc.toString()
}

const init = () => {
  errorMessage.value = null
  diagnostics.value = []
  const editorContainer = document.querySelector('#yaml-editor')
  createEditor(editorContainer, doc.value)
}
watch(codemirrorID, () => {
  init()
})
defineExpose({
  init
})
onMounted(() => {
  init()
})
</script>

<style>
.cm-editor {
  height: v-bind('$props.height');
}
</style>
