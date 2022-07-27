<template>
  <v-container>
    <v-row>
      <v-col cols="4" offset="2">
        <v-select
          v-model="global.settings.selected"
          :items="list.list_selector"
          :value="global.settings.selected"
          label="选择名单"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="2">
        <v-radio-group v-model="global.settings.mode" row mandatory>
          <v-radio label="单抽" value="0"></v-radio>
          <v-radio label="滚动" value="1"></v-radio>
          <v-radio label="批量" value="2"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="2">
        <v-switch v-model="global.settings.repeat"></v-switch>
      </v-col>
      <v-col cols="4" v-if="global.settings.mode === '2'"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";

export default {
  name: "HomeView",
  data: () => ({
    //全局数据，与localstorage同步
    global: {
      settings: {
        //抽取模式,0为单抽,1为带滚动,2为批量
        mode: "0",
        batch_count: 0,
        selected: "ListA",
        repeat: false,
      },
      list: {
        ListA: ["PersonA", "PersonB", "PersonC"],
        ListB: ["PersonF", "PersonD", "PersonE"],
      },
    },
    list: {
      //当前列表内容
      current: Array,
      //列表选择器
      list_selector: [],
    },
    //组件控制器
    componentController: {},
    //点名结果
    result: "",
  }),
  methods: {
    random() {},
  },
  watch: {
    //与localstorage同步
    global: {
      handler(newValue) {
        localStorage.setItem("data", JSON.stringify(newValue));
      },
      deep: true,
    },
  },
  beforeMount() {
    //加载localstorage
    if (localStorage.getItem("data") !== null) {
      this.global = _.clone(JSON.parse(localStorage.getItem("data")));
    }
    //加载当前列表与列表选择器
    this.list.current = this.global.list[this.global.settings.selected];
    this.list.list_selector = _.keysIn(this.global.list);
  },
};
</script>

<style scoped></style>
