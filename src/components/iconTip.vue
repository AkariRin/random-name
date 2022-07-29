<template>
  <v-tooltip :[location]="true">
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-bind="attrs" v-on="on" small>mdi-help-circle</v-icon>
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
