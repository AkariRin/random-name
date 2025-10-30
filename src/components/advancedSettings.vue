<template>
  <div>
    <v-tooltip text="高级设置" location="bottom">
      <template #activator="{ props }">
        <v-btn icon="mdi-cog" v-bind="props" @click="dialog = true"></v-btn>
      </template>
    </v-tooltip>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>高级设置</v-card-title>
        <v-card-text>
          <v-tabs v-model="tab">
            <v-tab v-for="(tabName, index) in tabs" :key="tabName" :value="index">
              {{ tabName }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="0"></v-window-item>
            <v-window-item :value="1">
              <v-container>
                <v-form v-model="importValid">
                  <v-row>
                    <v-textarea
                      v-model="importContent"
                      label="导入数据"
                      :rules="rules"
                      filled
                      clearable
                    ></v-textarea>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!importValid">导入</v-btn>
                  </v-row>
                </v-form>
              </v-container>
            </v-window-item>
            <v-window-item :value="2">
              <v-container>
                <v-row>
                  <v-textarea
                    label="导出数据"
                    :model-value="encodedDataExport"
                    :hint="copiedText"
                    persistent-hint
                    filled
                    readonly
                  ></v-textarea>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn @click="copy" color="blue" variant="flat">
                    <v-icon start>mdi-clipboard-text</v-icon>复制到剪贴板
                  </v-btn>
                </v-row>
              </v-container>
            </v-window-item>
            <v-window-item :value="3"></v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/appStore'
import { Base64 } from 'js-base64'

const appStore = useAppStore()

const dialog = ref(false)
const tab = ref(0)
const tabs = ['缓存设置', '导入数据', '导出数据', '关于']
const copiedText = ref('')
const importContent = ref('')
const importValid = ref(false)

const rules = [
  (value) => !!value || '不能为空',
  (value) => Base64.isValid(value) || '无法使用Base64解码',
]

const encodedDataExport = computed(() => {
  const data = {
    nameLists: appStore.nameLists,
    mode: appStore.mode,
    batchCount: appStore.batchCount,
    selected: appStore.selected,
    allowRepeat: appStore.allowRepeat,
    unique: appStore.unique,
    syncCode: appStore.syncCode,
    themePreference: appStore.themePreference,
  }
  return Base64.encode(JSON.stringify(data))
})

const copy = async () => {
  copiedText.value = ''
  try {
    await navigator.clipboard.writeText(encodedDataExport.value)
    copiedText.value = '已复制到剪贴板'
    setTimeout(() => {
      copiedText.value = ''
    }, 3000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped></style>

