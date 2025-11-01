<template>
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
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  list: Array,
  result: [String, Array],
  mode: String,
  isRunning: Boolean,
})

const displayText = ref('?')
const textIndex = ref(0)

const batchResults = computed(() => {
  if (props.mode === '2' && Array.isArray(props.result)) {
    return props.result
  }
  return []
})

watch(
  () => props.isRunning,
  (newValue) => {
    if (newValue && props.mode !== '2') {
      const interval = setInterval(() => {
        textIndex.value = (textIndex.value + 1) % (props.list?.length || 1)
        displayText.value = props.list?.[textIndex.value] || '?'
      }, 100)

      const unwatch = watch(
        () => props.isRunning,
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
</script>
