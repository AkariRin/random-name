<template>
  <v-container>
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
      <v-col cols="2">
        <current-list :list="list.current"></current-list>
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
        <info-panel></info-panel>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" offset="2">
        <v-btn
          v-if="global.settings.mode === '0'"
          color="blue"
          block
          @click="random()"
          >开始单抽</v-btn
        >
        <v-btn
          v-else-if="
            global.settings.mode === '1' &&
            componentController.isRunning === false
          "
          color="blue"
          block
          @click="startRunning()"
          >开始单抽</v-btn
        >
        <v-btn
          v-else-if="
            global.settings.mode === '1' &&
            componentController.isRunning === true
          "
          color="red"
          block
          @click="random()"
          >停止</v-btn
        >
        <v-btn
          v-else-if="global.settings.mode === '2'"
          color="blue"
          block
          @click="randomBatch()"
          >开始批量抽取</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <result-display
          :result="result"
          :list="list.current"
          :is-batch="componentController.isBatch"
          :is-running="componentController.isRunning"
        ></result-display>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import iconTip from "@/components/iconTip";
import currentList from "@/components/currentList";
import resultDisplay from "@/components/resultDisplay";
import infoPanel from "@/components/infoPanel";

export default {
  name: "HomeView",
  components: {
    iconTip,
    currentList,
    resultDisplay,
    infoPanel,
  },
  data: () => ({
    //全局数据，与localstorage同步
    global: {
      settings: {
        //抽取模式,0为单抽,1为带滚动,2为批量
        mode: "0",
        batch_count: 0,
        selected: "ListA",
        allowRepeat: false,
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
    componentController: {
      batchDialog: false,
      isBatch: false,
      isRunning: false,
    },
    //点名结果
    result: "?",
  }),
  methods: {
    random() {
      this.componentController.isBatch = false;
      this.result = _.sample(this.list.current);
      this.componentController.isRunning = false;
      if (!this.global.settings.allowRepeat) {
        _.pull(this.list.current, this.result);
      }
    },
    startRunning() {
      this.componentController.isBatch = false;
      this.componentController.isRunning = true;
    },
    randomBatch() {
      this.componentController.isBatch = true;
      this.componentController.isRunning = false;
      this.result = _.sampleSize(
        this.list.current,
        this.global.settings.batch_count
      );
      if (!this.global.settings.allowRepeat) {
        _.pullAll(this.list.current, this.result);
      }
    },
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
    //加载当前列表、列表选择器
    this.list.current = this.global.list[this.global.settings.selected];
    this.list.selector = _.keysIn(this.global.list);
  },
};
</script>

<style scoped></style>
