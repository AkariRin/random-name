import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import _ from 'lodash'

export const useAppStore = defineStore(
  'app',
  () => {
    // State
    const mode = ref('0') // '0' - single, '1' - scroll, '2' - batch
    const batchCount = ref(0)
    const selected = ref('ListA')
    const allowRepeat = ref(false)
    const unique = ref(true)
    const syncCode = ref('')
    const themePreference = ref('light') // 'light', 'dark', 'followOS'
    const nameLists = ref({
      ListA: ['PersonA', 'PersonB', 'PersonC'],
      ListB: ['PersonF', 'PersonD', 'PersonE'],
    })

    // Getters
    const listGetNamelist = computed(() => {
      const result = {}
      _.forIn(nameLists.value, (value, key) => {
        result[key] = _.map(value, (name) => {
          return { name }
        })
      })
      return result
    })

    // Mutations/Actions
    function updateSettingsString(key, value) {
      if (key === 'syncCode') {
        syncCode.value = value
      }
    }

    function updateSettingsBoolean(key, value) {
      if (key === 'allowRepeat') {
        allowRepeat.value = value
      } else if (key === 'unique') {
        unique.value = value
      }
    }

    function updateSettingsNumber(key, value) {
      if (key === 'batchCount') {
        batchCount.value = value
      }
    }

    function updateSettingsMode(newMode) {
      mode.value = newMode
    }

    function updateSettingsTheme(newTheme) {
      themePreference.value = newTheme
    }

    function updateListViewNamelists(payload) {
      _.forIn(payload, (value, key) => {
        nameLists.value[key] = _.map(value, (item) => item.name)
      })
    }

    function setSelected(newSelected) {
      selected.value = newSelected
    }

    return {
      // State
      mode,
      batchCount,
      selected,
      allowRepeat,
      unique,
      syncCode,
      themePreference,
      nameLists,

      // Getters
      listGetNamelist,

      // Actions
      updateSettingsString,
      updateSettingsBoolean,
      updateSettingsNumber,
      updateSettingsMode,
      updateSettingsTheme,
      updateListViewNamelists,
      setSelected,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'vuex',
          storage: localStorage,
        },
      ],
    },
  }
)

