<template>
  <v-container>
    <!-- Delete confirmation dialog -->
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

    <!-- Batch add names dialog -->
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

    <!-- Name lists management -->
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-btn @click="addNewList" color="success" class="mb-4">
          <v-icon start>mdi-plus</v-icon>新增名单
        </v-btn>
        <v-expansion-panels>
          <v-expansion-panel v-for="(values, listName) in namelists" :key="listName">
            <template #title>
              <span>{{ listName }}</span>
            </template>
            <template #text>
              <v-data-table
                :headers="headers"
                :items="values"
                sort-by="name"
                class="elevation-1"
                locale="zhHans"
              >
                <template #top>
                  <v-toolbar flat>
                    <v-toolbar-title>编辑名单：{{ listName }}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn @click="batchAddNameOpen(listName)" color="purple" size="small">
                      <v-icon start>mdi-plus</v-icon>添加姓名
                    </v-btn>
                    <v-btn @click="deleteConfirm('list', listName)" color="primary" size="small">
                      <v-icon start>mdi-delete</v-icon>删除名单
                    </v-btn>
                  </v-toolbar>
                </template>
                <template #no-data>
                  <div class="text-center pa-4">名单为空</div>
                </template>
                <template #[`item.actions`]="{ item, index }">
                  <v-btn icon="mdi-pencil" size="x-small"></v-btn>
                  <v-btn
                    @click="deleteConfirm('name', listName, item, index)"
                    icon="mdi-delete"
                    size="x-small"
                  ></v-btn>
                </template>
              </v-data-table>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/appStore'

const appStore = useAppStore()

const namelists = ref(JSON.parse(JSON.stringify(appStore.listGetNamelist)))
const headers = [
  { key: 'name', title: '姓名' },
  { key: 'actions', title: '操作', sortable: false },
]

const deleteDialog = ref(false)
const deleteType = ref('list') // 'name' | 'list'
const batchAddNameDialog = ref(false)
const batchAddNameContent = ref('')
const useNewline = ref(true)
const targetList = ref('')
const targetIndex = ref(-1)

const deleteDialogText = computed(() => {
  if (deleteType.value === 'list') {
    return `你确定要删除名单 ${targetList.value} 吗？`
  } else {
    const item = namelists.value[targetList.value]?.[targetIndex.value]
    return `你确定要删除名单 ${targetList.value} 中的 ${item?.name} 吗？`
  }
})

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

const deleteExec = (action) => {
  if (action === 'delete') {
    if (deleteType.value === 'name') {
      namelists.value[targetList.value].splice(targetIndex.value, 1)
    } else if (deleteType.value === 'list') {
      delete namelists.value[targetList.value]
    }
  }

  // Reset state
  deleteType.value = 'list'
  targetIndex.value = -1
  deleteDialog.value = false
}

const addNewList = () => {
  const listName = `List${Object.keys(namelists.value).length + 1}`
  namelists.value[listName] = []
}

// Watch for changes and sync to store
watch(
  () => namelists.value,
  (newValue) => {
    appStore.updateListViewNamelists(newValue)
  },
  { deep: true }
)
</script>

<style scoped></style>

