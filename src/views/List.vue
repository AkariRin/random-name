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
    <v-row>
      <v-col cols="1" offset="2">
        <v-switch v-model="unique"></v-switch>
      </v-col>
      <v-col cols="1" offset="6">
        <v-btn block>
          <v-icon left>mdi-plus</v-icon>
          添加名单
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" offset="2">
        <v-expansion-panels>
          <v-expansion-panel v-for="(item, index) in namelists" :key="index">
            <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
            <v-expansion-panel-content></v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as dataParser from "@/dataParser";

export default {
  name: "ListView",
  data: () => ({
    unique: false,
    namelists: {},
  }),
  beforeMount() {
    dataParser.checkLSExists();
    this.unique = dataParser.loadSettings();
    this.namelists = dataParser.loadNameList();
  },
  methods: {},
  watch: {
    unique() {
      dataParser.writeSettings(this.unique);
    },
    namelists: {
      handler() {},
      deep: true,
    },
  },
};
</script>

<style scoped></style>
