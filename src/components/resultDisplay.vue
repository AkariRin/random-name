<template>
  <div>
    {{ list }}{{ result }} {{ isBatch }} {{ isRunning }}
    <div
      class="text-h1 text-center"
      v-if="!isBatch && !isRunning"
      v-text="result"
    ></div>
    <div
      class="text-h1 text-center"
      v-if="!isBatch && isRunning"
      v-text="text"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "resultDisplay",
  props: ["list", "result", "isBatch", "isRunning"],
  data: () => ({
    text: "",
  }),
});
</script>

<style scoped></style>
