<template>
  <v-tooltip>
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
    </template>
    <span>{{ text }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "iconTip",
  props: ["location", "text"],
};
</script>

<style scoped></style>
