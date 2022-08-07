<template>
  <v-container fluid>
    <v-row>
      <v-col cols="1" offset="2">
        <v-btn @click="$router.push('/')">
          <v-icon left>mdi-arrow-left</v-icon>
          返回
        </v-btn>
      </v-col>
    </v-row>
    <v-row></v-row>
    <v-row>
      <v-col cols="8" offset="2">
        <v-expansion-panels>
          <v-expansion-panel
            v-for="nl in namelists"
            :key="nl"
          ></v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ListView",
  data: () => ({}),
  beforeMount() {},
};
</script>

<style scoped></style>
