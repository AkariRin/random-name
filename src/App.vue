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
      <AdvancedSettings></AdvancedSettings>
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
      <v-snackbar v-model="snackbarCached" transition="slide-y-reverse-transition">
        缓存完毕，可以离线使用了
      </v-snackbar>
      <v-snackbar v-model="snackbarUpdFound" transition="slide-y-reverse-transition">
        发现更新，下载中
      </v-snackbar>
      <v-snackbar v-model="snackbarUpdated" transition="slide-y-reverse-transition" timeout="-1">
        更新已完成，请刷新页面以使用新版本
        <template #actions>
          <v-btn color="pink" variant="text" @click="swRefresh">刷新</v-btn>
        </template>
      </v-snackbar>

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

      <router-view />
    </v-main>

    <v-footer>
      <v-col cols="12" class="text-center"><strong>random-name</strong></v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from './stores/appStore'
import AdvancedSettings from './components/AdvancedSettings.vue'

const appStore = useAppStore()

const dialogDark = ref(false)
const snackbarCached = ref(false)
const snackbarUpdFound = ref(false)
const snackbarUpdated = ref(false)

const themePreference = computed({
  get() {
    return appStore.themePreference
  },
  set(newValue) {
    appStore.updateSettingsTheme(newValue)
  },
})

const swRefresh = () => {
  // Placeholder for service worker refresh logic
  window.location.reload()
}
</script>

<style scoped></style>

