<template>
  <v-app>
    <v-app-bar app color="primary" prominent>
      <v-app-bar-title>随机点名器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip text="主题偏好" location="bottom">
        <template #activator="{ props }">
          <v-btn icon="mdi-weather-night" v-bind="props" @click="dialogDark = true"></v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="高级设置" location="bottom">
        <template #activator="{ props }">
          <v-btn icon="mdi-cog" v-bind="props" @click="dialogSettings = true"></v-btn>
        </template>
      </v-tooltip>
      <v-tooltip text="GitHub" location="bottom">
        <template #activator="{ props }">
          <v-btn
            icon="mdi-github"
            v-bind="props"
            href="https://github.com/AkariRin/random-name"
            target="_blank"
          ></v-btn>
        </template>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <v-dialog v-model="dialogDark" max-width="300">
        <v-card>
          <v-card-title>主题偏好</v-card-title>
          <v-card-text>
            <v-radio-group v-model="themePreference" column mandatory>
              <v-radio label="浅色模式" value="light"></v-radio>
              <v-radio label="深色模式" value="dark"></v-radio>
              <v-radio label="跟随系统设置" value="followOS"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogDark = false">
              <v-icon start>mdi-close</v-icon>关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogSettings" max-width="800px">
        <v-card>
          <v-card-title>高级设置</v-card-title>
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab v-for="(tabName, index) in tabs" :key="tabName" :value="index">
                {{ tabName }}
              </v-tab>
            </v-tabs>
            <v-window v-model="tab">
              <v-window-item :value="0">
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
              <v-window-item :value="1">
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
              <v-window-item :value="2"></v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-dialog>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApp } from './stores/appStore'
import { Base64 } from 'js-base64'

const app = useApp()

const dialogDark = ref(false)
const dialogSettings = ref(false)
const tab = ref(0)
const tabs = ['导入数据', '导出数据', '关于']
const copiedText = ref('')
const importContent = ref('')
const importValid = ref(false)

const rules = [
  (value) => !!value || '不能为空',
  (value) => Base64.isValid(value) || '无法使用Base64解码',
]

const themePreference = computed({
  get() {
    return app.themePreference
  },
  set(newValue) {
    app.updateSettingsTheme(newValue)
  },
})

const encodedDataExport = computed(() => {
  const data = {
    nameLists: app.nameLists,
    mode: app.mode,
    batchCount: app.batchCount,
    selected: app.selected,
    allowRepeat: app.allowRepeat,
    unique: app.unique,
    syncCode: app.syncCode,
    themePreference: app.themePreference,
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
    console.error('复制失败:', err)
  }
}
</script>
