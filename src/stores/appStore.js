import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const mode = ref('0') // '0' - single, '1' - scroll, '2' - batch
  const batchCount = ref(0)
  const selected = ref('ListA')
  const allowRepeat = ref(false)
  const unique = ref(true)
  const syncCode = ref('')
  const themePreference = ref('light') // 'light', 'dark', 'followOS'
  const nameLists = ref({})

  const listGetNamelist = computed(() => {
    const result = {}
    Object.entries(nameLists.value).forEach(([key, value]) => {
      result[key] = value.map((name) => ({ name }))
    })
    return result
  })

  const updateSettingsString = (key, value) => {
    if (key === 'syncCode') {
      syncCode.value = value
    }
  }

  const updateSettingsBoolean = (key, value) => {
    const booleanSettings = {
      allowRepeat: () => (allowRepeat.value = value),
      unique: () => (unique.value = value),
    }
    booleanSettings[key]?.()
  }

  const updateSettingsNumber = (key, value) => {
    const numberSettings = {
      batchCount: () => (batchCount.value = value),
    }
    numberSettings[key]?.()
  }

  const updateSettingsMode = (newMode) => {
    mode.value = newMode
  }

  const updateSettingsTheme = (newTheme) => {
    themePreference.value = newTheme
  }

  const updateListViewNamelists = (payload) => {
    // 如果 payload 为空对象，清空所有名单
    if (Object.keys(payload).length === 0) {
      nameLists.value = {}
    } else {
      // 先清空不存在于 payload 中的名单
      Object.keys(nameLists.value).forEach((key) => {
        if (!(key in payload)) {
          delete nameLists.value[key]
        }
      })
      // 更新或添加 payload 中的名单
      Object.entries(payload).forEach(([key, value]) => {
        nameLists.value[key] = value.map((item) => item.name)
      })
    }
  }

  const setSelected = (newSelected) => {
    selected.value = newSelected
  }

  return {
    mode,
    batchCount,
    selected,
    allowRepeat,
    unique,
    syncCode,
    themePreference,
    nameLists,

    listGetNamelist,

    updateSettingsString,
    updateSettingsBoolean,
    updateSettingsNumber,
    updateSettingsMode,
    updateSettingsTheme,
    updateListViewNamelists,
    setSelected,
  }
}, {
  persist: true,
})
