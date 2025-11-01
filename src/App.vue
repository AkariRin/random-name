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
            <v-dialog v-model="dialog" max-width="1000" scrollable>
              <template #activator="{ props }">
                <v-btn v-bind="props" block>查看当前名单</v-btn>
              </template>
              <v-card tile>
                <v-card-title>当前名单</v-card-title>
                <v-card-subtitle>人数：{{ count }}人</v-card-subtitle>
                <v-card-text>
                  <v-chip v-for="chip in chips" :key="chip" class="ma-1">
                    {{ chip }}
                  </v-chip>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="dialog = false" color="primary">
                    <v-icon start>mdi-close</v-icon>关闭
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-col cols="6" md="1">
            <v-btn @click="manageDialog = true" block>
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
            <div>
              <div class="text-h1 text-center" v-if="mode !== '2' && !isRunning" v-text="result"></div>
              <div class="text-h1 text-center" v-if="mode !== '2' && isRunning" v-text="displayText"></div>
              <div v-if="mode === '2'">
                <div class="text-h4 mb-4">批量抽取结果：</div>
                <v-chip v-for="item in batchResults" :key="item" class="ma-2">
                  {{ item }}
                </v-chip>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-dialog v-model="manageDialog" max-width="1200px" scrollable>
          <v-card tile>
            <v-card-title>管理名单</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div class="mb-4">
                <v-btn @click="createListDialog = true" color="success" class="mr-2">
                  <v-icon start>mdi-plus</v-icon>创建名单
                </v-btn>
                <v-btn @click="importListFileOpen" color="info" class="mr-2">
                  <v-icon start>mdi-upload</v-icon>导入名单
                </v-btn>
                <v-btn @click="deleteConfirm('allLists')" color="error">
                  <v-icon start>mdi-delete</v-icon>删除所有名单
                </v-btn>
                <input
                  ref="fileInput"
                  type="file"
                  accept="*"
                  style="display: none"
                  @change="handleFileImport"
                />
              </div>
              <v-expansion-panels>
                <v-expansion-panel v-for="(values, listName) in namelists" :key="listName">
                  <template #title>
                    <span>{{ listName }}</span>
                    <v-spacer></v-spacer>
                    <span class="text-caption mr-4">人数: {{ values.length }}</span>
                  </template>
                  <template #text>
                    <div class="pa-4">
                      <v-btn @click="batchAddNameOpen(listName)" color="purple" size="small" class="mb-4">
                        <v-icon start>mdi-plus</v-icon>添加姓名
                      </v-btn>
                      <v-btn @click="deleteConfirm('list', listName)" color="error" size="small" class="mb-4 ml-2">
                        <v-icon start>mdi-delete</v-icon>删除名单
                      </v-btn>
                      <v-divider class="my-4"></v-divider>
                      <div v-if="values.length === 0" class="text-center text-grey">
                        名单为空
                      </div>
                      <v-list v-else>
                        <v-list-item v-for="(item, index) in values" :key="index">
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                          <template #append>
                            <v-btn
                              @click="deleteConfirm('name', listName, item, index)"
                              icon="mdi-delete"
                              size="x-small"
                              color="error"
                            ></v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                  </template>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="manageDialog = false" color="primary">
                <v-icon start>mdi-close</v-icon>关闭
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="deleteDialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h5 text-center">
              {{ deleteDialogText }}
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="deleteExec('cancel')">取消</v-btn>
              <v-btn @click="deleteExec('delete')">确定</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="batchAddNameDialog" max-width="600px">
          <v-card>
            <v-card-title>批量添加姓名</v-card-title>
            <v-card-subtitle>添加到：{{ targetList }}</v-card-subtitle>
            <v-card-text>
              <v-textarea v-model="batchAddNameContent" filled clearable></v-textarea>
              <v-checkbox v-model="useNewline" label="每行一个姓名"></v-checkbox>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="batchAddNameDialog = false" color="primary">
                <v-icon start>mdi-close</v-icon>关闭
              </v-btn>
              <v-btn color="blue" @click="batchAddNameExec">
                <v-icon start>mdi-plus</v-icon>添加
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="createListDialog" max-width="600px">
          <v-card>
            <v-card-title>创建名单</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="newListName"
                label="名单名称"
                placeholder="请输入名单名称"
                filled
                clearable
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="createListDialog = false" color="primary">
                <v-icon start>mdi-close</v-icon>取消
              </v-btn>
              <v-btn color="success" @click="createListExec" :disabled="!newListName.trim()">
                <v-icon start>mdi-plus</v-icon>创建
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="importListDialog" max-width="600px">
          <v-card>
            <v-card-title>导入名单</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="importListName"
                label="名单名称"
                placeholder="请输入要导入到的名单名称"
                filled
                clearable
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="importListDialog = false" color="primary">
                <v-icon start>mdi-close</v-icon>取消
              </v-btn>
              <v-btn color="info" @click="importListExec" :disabled="!importListName.trim()">
                <v-icon start>mdi-upload</v-icon>导入
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from './stores/appStore'
import { Base64 } from 'js-base64'

const app = useAppStore()

const dialogDark = ref(false)
const dialogSettings = ref(false)
const tab = ref(0)
const tabs = ['导入数据', '导出数据', '关于']
const copiedText = ref('')
const importContent = ref('')
const importValid = ref(false)
const result = ref('?')
const isRunning = ref(false)
const currentListData = ref([...app.nameLists[app.selected]])
const displayText = ref('?')
const textIndex = ref(0)
const dialog = ref(false)
const manageDialog = ref(false)
const deleteDialog = ref(false)
const deleteType = ref('list') // 'name' | 'list' | 'allLists'
const batchAddNameDialog = ref(false)
const batchAddNameContent = ref('')
const useNewline = ref(true)
const targetList = ref('')
const targetIndex = ref(-1)
const createListDialog = ref(false)
const newListName = ref('')
const fileInput = ref(null)
const importListDialog = ref(false)
const importListName = ref('')

const rules = [
  (value) => !!value || '不能为空',
  (value) => Base64.isValid(value) || '无法使用Base64解码',
]

// 管理名单相关
const namelists = ref(JSON.parse(JSON.stringify(app.listGetNamelist)))

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

const list_selector = computed(() => Object.keys(app.nameLists))

const currentList = computed({
  get() {
    return currentListData.value
  },
  set(newValue) {
    currentListData.value = newValue
  },
})

const batchResults = computed(() => {
  if (mode.value === '2' && Array.isArray(result.value)) {
    return result.value
  }
  return []
})

const count = computed(() => currentList.value?.length || 0)
const chips = computed(() => currentList.value || [])

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

const deleteDialogText = computed(() => {
  if (deleteType.value === 'allLists') {
    return '你确定要删除所有名单吗？此操作不可撤销！'
  } else if (deleteType.value === 'list') {
    return `你确定要删除名单 ${targetList.value} 吗？`
  } else {
    const item = namelists.value[targetList.value]?.[targetIndex.value]
    return `你确定要删除名单 ${targetList.value} 中的 ${item?.name} 吗？`
  }
})

watch(
  () => isRunning.value,
  (newValue) => {
    if (newValue && mode.value !== '2') {
      const interval = setInterval(() => {
        textIndex.value = (textIndex.value + 1) % (currentList.value?.length || 1)
        displayText.value = currentList.value?.[textIndex.value] || '?'
      }, 100)

      const unwatch = watch(
        () => isRunning.value,
        (stillRunning) => {
          if (!stillRunning) {
            clearInterval(interval)
            unwatch()
          }
        }
      )
    }
  }
)

watch(
  () => namelists.value,
  (newValue) => {
    app.updateListViewNamelists(newValue)
  },
  { deep: true }
)

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

// 管理名单相关方法
const batchAddNameOpen = (listName) => {
  targetList.value = listName
  batchAddNameContent.value = ''
  batchAddNameDialog.value = true
}

const batchAddNameExec = () => {
  if (!batchAddNameContent.value.trim()) {
    return
  }

  const names = useNewline.value
    ? batchAddNameContent.value
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s)
    : [batchAddNameContent.value.trim()]

  if (!namelists.value[targetList.value]) {
    namelists.value[targetList.value] = []
  }

  names.forEach((name) => {
    namelists.value[targetList.value].push({ name })
  })

  batchAddNameDialog.value = false
  batchAddNameContent.value = ''
}

const deleteConfirm = (type, listName, item, index) => {
  deleteType.value = type
  targetList.value = listName
  if (type === 'name') {
    targetIndex.value = index
  } else {
    targetIndex.value = -1
  }
  deleteDialog.value = true
}

const createListExec = () => {
  if (!newListName.value.trim()) {
    return
  }

  namelists.value[newListName.value] = []
  newListName.value = ''
  createListDialog.value = false
}

const deleteExec = (action) => {
  if (action === 'delete') {
    if (deleteType.value === 'name') {
      namelists.value[targetList.value].splice(targetIndex.value, 1)
    } else if (deleteType.value === 'list') {
      delete namelists.value[targetList.value]
    } else if (deleteType.value === 'allLists') {
      namelists.value = {}
    }
  }

  deleteType.value = 'list'
  targetIndex.value = -1
  deleteDialog.value = false
}

const importListFileOpen = () => {
  importListName.value = ''
  importListDialog.value = true
}

const importListExec = () => {
  if (!importListName.value.trim()) {
    return
  }

  // 打开文件选择器
  fileInput.value?.click()
}

const handleFileImport = (event) => {
  const file = event.target.files?.[0]
  if (!file) {
    importListDialog.value = false
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result
    if (typeof content !== 'string') {
      importListDialog.value = false
      return
    }

    // 按行分割，并过滤空行和仅有空格的行
    const names = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)

    // 如果名单不存在，创建它
    if (!namelists.value[importListName.value]) {
      namelists.value[importListName.value] = []
    }

    // 将所有名字添加到名单中
    names.forEach((name) => {
      namelists.value[importListName.value].push({ name })
    })

    importListDialog.value = false
    importListName.value = ''
  }

  reader.readAsText(file)
  // 重置文件输入
  event.target.value = ''
}
</script>
