<template>
  <v-container>
    <current-list :list="list.current"></current-list>
    <v-row>
      <v-col cols="12">
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="2">
        <v-select
          v-model="global.settings.selected"
          :items="list.selector"
          :value="global.settings.selected"
          label="选择名单"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="2">
        <v-radio-group v-model="global.settings.mode" row mandatory>
          <template v-slot:append>
            <icon-tip text="a" location="top"></icon-tip>
          </template>
          <v-radio label="单抽" value="0"></v-radio>
          <v-radio label="滚动" value="1"></v-radio>
          <v-radio label="批量" value="2"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4" v-show="global.settings.mode === '2'"></v-col>
    </v-row>
    <v-row>
      <v-col cols="8" offset="2">
        <v-btn v-if="global.settings.mode === '0'" block>a</v-btn>
        <v-btn v-if="global.settings.mode === '1'" block>b</v-btn>
        <v-btn v-if="global.settings.mode === '2'" block>c</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <result-display></result-display>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import iconTip from "@/components/iconTip";
import currentList from "@/components/currentList";
import resultDisplay from "@/components/resultDisplay";

export default {
  name: "HomeView",
  components: {
    iconTip,
    currentList,
    resultDisplay,
  },
  data: () => ({
    //全局数据，与localstorage同步
    global: {
      settings: {
        //抽取模式,0为单抽,1为带滚动,2为批量
        mode: "0",
        batch_count: 0,
        selected: "ListA",
        repeat: false,
        //自动去重
        unique: true,
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
      selector: [],
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
    this.list.selector = _.keysIn(this.global.list);
  },
};
</script>

<style scoped></style>
