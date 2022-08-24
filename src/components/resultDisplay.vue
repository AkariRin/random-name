<template>
  <div>
    {{ list }}{{ result }} {{ mode }} {{ isRunning }}
    <div
      class="text-h1 text-center"
      v-if="mode !== '2' && !isRunning"
      v-text="result"
    ></div>
    <div
      class="text-h1 text-center"
      v-if="mode !== '2' && isRunning"
      v-text="text"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "resultDisplay",
  props: ["list", "result", "mode", "isRunning"],
  data: () => ({
    text: "",
  }),
});
</script>

<style scoped></style>
