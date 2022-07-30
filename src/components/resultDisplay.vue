<template>
  <div>{{ list }}{{ result }} {{ isBatch }} {{ isRunning }}</div>
</template>

<script>
export default {
  name: "resultDisplay",
  props: ["list", "result", "isBatch", "isRunning"],
};
</script>

<style scoped></style>
