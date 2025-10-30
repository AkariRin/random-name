<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3" offset-md="1">
        <v-select
          v-model="selected"
          :items="list_selector"
          single-line
        ></v-select>
      </v-col>
      <v-col cols="6" md="1">
        <CurrentList :list="currentList"></CurrentList>
      </v-col>
      <v-col cols="6" md="1">
        <v-btn @click="$router.push('/list')" block>
          <v-icon start>mdi-cog</v-icon>管理名单
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" offset-md="1">
        <v-radio-group v-model="mode" @update:model-value="endRunning" row mandatory>
          <v-radio label="单抽" value="0"></v-radio>
          <v-radio label="滚动" value="1"></v-radio>
          <v-radio label="批量" value="2"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" offset-md="1" v-if="mode === '2'">
        <v-text-field
          v-model.number="batchCount"
          type="number"
          label="批量抽取数量"
          min="1"
          :max="currentList.length"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" offset-md="1">
        <v-switch v-model="allowRepeat" label="允许重复"></v-switch>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-btn v-if="mode === '0'" @click="randomSingle" color="blue" block variant="flat">
          开始单抽
        </v-btn>
        <v-btn
          v-if="mode === '1' && isRunning === false"
          @click="startRunning"
          color="blue"
          block
          variant="flat"
        >
          开始滚动
        </v-btn>
        <v-btn
          v-if="mode === '1' && isRunning === true"
          @click="random"
          color="primary"
          block
          variant="flat"
        >
          停止
        </v-btn>
        <v-btn v-if="mode === '2'" @click="randomBatch" color="blue" block variant="flat">
          批量抽取
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <InfoPanel></InfoPanel>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <ResultDisplay
          :result="result"
          :list="currentList"
          :mode="mode"
          :is-running="isRunning"
        ></ResultDisplay>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import _ from 'lodash'
import { useAppStore } from '../stores/appStore'
import CurrentList from '../components/CurrentList.vue'
import InfoPanel from '../components/InfoPanel.vue'
import ResultDisplay from '../components/ResultDisplay.vue'

const appStore = useAppStore()

const result = ref('?')
const isRunning = ref(false)
const currentListData = ref([...appStore.nameLists[appStore.selected]])

const list_selector = computed(() => _.keys(appStore.nameLists))

const currentList = computed({
  get() {
    return currentListData.value
  },
  set(newValue) {
    currentListData.value = newValue
  },
})

const selected = computed({
  get() {
    return appStore.selected
  },
  set(newValue) {
    appStore.setSelected(newValue)
    currentListData.value = [...appStore.nameLists[newValue]]
    result.value = '?'
  },
})

const mode = computed({
  get() {
    return appStore.mode
  },
  set(newValue) {
    appStore.updateSettingsMode(newValue)
  },
})

const allowRepeat = computed({
  get() {
    return appStore.allowRepeat
  },
  set(newValue) {
    appStore.updateSettingsBoolean('allowRepeat', newValue)
  },
})

const batchCount = computed({
  get() {
    return appStore.batchCount
  },
  set(newValue) {
    appStore.updateSettingsNumber('batchCount', newValue)
  },
})

const startRunning = () => {
  isRunning.value = true
}

const endRunning = () => {
  isRunning.value = false
}

const randomSingle = () => {
  if (currentList.value.length === 0) {
    result.value = '名单为空'
    return
  }
  result.value = _.sample(currentList.value)
  if (!allowRepeat.value) {
    _.pull(currentList.value, result.value)
  }
}

const random = () => {
  if (currentList.value.length === 0) {
    result.value = '名单为空'
    isRunning.value = false
    return
  }
  result.value = _.sample(currentList.value)
  if (!allowRepeat.value) {
    _.pull(currentList.value, result.value)
  }
  endRunning()
}

const randomBatch = () => {
  if (currentList.value.length === 0) {
    result.value = []
    return
  }
  const count = Math.min(batchCount.value, currentList.value.length)
  result.value = _.sampleSize(currentList.value, count)
  if (!allowRepeat.value) {
    _.pullAll(currentList.value, result.value)
  }
}
</script>

<style scoped></style>

