<template>
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
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  list: Array,
})

const dialog = ref(false)

const count = computed(() => props.list?.length || 0)
const chips = computed(() => props.list || [])
</script>

<style scoped></style>

