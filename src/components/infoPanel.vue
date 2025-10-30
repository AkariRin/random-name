<template>
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
</template>

<script setup>
// InfoPanel component - displays information about the app
</script>

<style scoped></style>

