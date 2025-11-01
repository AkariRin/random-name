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
        <v-expansion-panels>
          <v-expansion-panel>
            <template #title>
              <span>说明</span>
            </template>
            <template #text>
              <div>
                <p><strong>单抽模式：</strong>每次随机抽取一个人</p>
                <p><strong>滚动模式：</strong>快速滚动列表，点击停止按钮时显示结果</p>
                <p><strong>批量模式：</strong>一次性随机抽取多个人</p>
                <p><strong>允许重复：</strong>关闭时，被抽取的人会从列表中移除</p>
              </div>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
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
import { useAppStore } from '../stores/appStore'
import CurrentList from '../components/CurrentList.vue'
import ResultDisplay from '../components/ResultDisplay.vue'

const app = useAppStore()

const result = ref('?')
const isRunning = ref(false)
const currentListData = ref([...app.nameLists[app.selected]])

const list_selector = computed(() => Object.keys(app.nameLists))

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
    return app.selected
  },
  set(newValue) {
    app.setSelected(newValue)
    currentListData.value = [...app.nameLists[newValue]]
    result.value = '?'
  },
})

const mode = computed({
  get() {
    return app.mode
  },
  set(newValue) {
    app.updateSettingsMode(newValue)
  },
})

const allowRepeat = computed({
  get() {
    return app.allowRepeat
  },
  set(newValue) {
    app.updateSettingsBoolean('allowRepeat', newValue)
  },
})

const batchCount = computed({
  get() {
    return app.batchCount
  },
  set(newValue) {
    app.updateSettingsNumber('batchCount', newValue)
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
  // 随机抽取一个元素
  const randomIndex = Math.floor(Math.random() * currentList.value.length)
  result.value = currentList.value[randomIndex]
  if (!allowRepeat.value) {
    // 移除选中的元素
    currentList.value.splice(randomIndex, 1)
  }
}

const random = () => {
  if (currentList.value.length === 0) {
    result.value = '名单为空'
    isRunning.value = false
    return
  }
  // 随机抽取一个元素
  const randomIndex = Math.floor(Math.random() * currentList.value.length)
  result.value = currentList.value[randomIndex]
  if (!allowRepeat.value) {
    // 移除选中的元素
    currentList.value.splice(randomIndex, 1)
  }
  endRunning()
}

const randomBatch = () => {
  if (currentList.value.length === 0) {
    result.value = []
    return
  }
  const count = Math.min(batchCount.value, currentList.value.length)
  // 使随机抽取 count 个元素
  const arr = [...currentList.value]
  const selected = []
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * (arr.length - i))
    selected.push(arr[randomIndex])
    // 将选中的元素与末尾元素交换
    ;[arr[randomIndex], arr[arr.length - 1 - i]] = [arr[arr.length - 1 - i], arr[randomIndex]]
  }
  result.value = selected
  if (!allowRepeat.value) {
    // 从原数组中移除选中的元素
    currentList.value = currentList.value.filter(item => !selected.includes(item))
  }
}
</script>

<style scoped></style>

