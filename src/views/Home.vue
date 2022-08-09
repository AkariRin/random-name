<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3" offset="2">
        <v-select
          v-model="global.settings.selected"
          :items="list.selector"
          :value="global.settings.selected"
          label="选择名单"
        ></v-select>
      </v-col>
      <v-col cols="2">
        <current-list :list="list.current"></current-list>
        <v-btn @click="$router.push('/list')" class="ma-4">
          <v-icon left>mdi-cog</v-icon>
          管理名单
        </v-btn>
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
      <v-col cols="4" v-show="global.settings.mode === '2'"></v-col>
    </v-row>
    <v-row>
      <v-col cols="1" offset="2">
        <v-switch v-model="global.settings.allowRepeat"></v-switch>
      </v-col>
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
          dark
          >开始单抽</v-btn
        >
        <v-btn
          v-else-if="
            global.settings.mode === '1' && componentCtl.isRunning === false
          "
          color="blue"
          block
          @click="startRunning()"
          dark
          >开始单抽</v-btn
        >
        <v-btn
          v-else-if="
            global.settings.mode === '1' && componentCtl.isRunning === true
          "
          color="red"
          block
          @click="random()"
          dark
          >停止</v-btn
        >
        <v-btn
          v-else-if="global.settings.mode === '2'"
          color="blue"
          block
          @click="randomBatch()"
          dark
          >开始批量抽取</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" offset="2">
        <result-display
          :result="result"
          :list="list.current"
          :is-batch="componentCtl.isBatch"
          :is-running="componentCtl.isRunning"
        ></result-display>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import _ from "lodash";
import currentList from "@/components/currentList";
import resultDisplay from "@/components/resultDisplay";
import infoPanel from "@/components/infoPanel";

export default {
  name: "HomeView",
  components: {
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
        //批量抽取模式中的抽取数量
        batch_count: 0,
        //选定的列表
        selected: "ListA",
        //允许重复抽取
        allowRepeat: false,
        //自动去重
        unique: true,
        //同步码
        sync_code: "",
      },
      namelists: {
        ListA: ["PersonA", "PersonB", "PersonC"],
        ListB: ["PersonF", "PersonD", "PersonE"],
      },
    },
    list: {
      //当前列表内容
      current: [],
      //列表选择器
      selector: [],
    },
    //组件控制器
    componentCtl: {
      isBatch: false,
      isRunning: false,
      cacheSelectedList: "",
    },
    //点名结果
    result: "?",
  }),
  methods: {
    random() {
      this.componentCtl.isBatch = false;
      this.result = _.sample(this.list.current);
      this.componentCtl.isRunning = false;
      if (!this.global.settings.allowRepeat) {
        _.pull(this.list.current, this.result);
      }
    },
    startRunning() {
      this.componentCtl.isBatch = false;
      this.componentCtl.isRunning = true;
    },
    randomBatch() {
      this.componentCtl.isBatch = true;
      this.componentCtl.isRunning = false;
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
        //todo
        if (
          !_.isEqual(
            newValue.settings.selected,
            this.componentCtl.cacheSelectedList
          )
        ) {
          this.list.current = this.global.namelists[newValue.settings.selected];
        }
        this.componentCtl.cacheSelectedList = newValue.settings.selected;
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
    this.list.current = this.global.namelists[this.global.settings.selected];
    this.list.selector = _.keysIn(this.global.namelists);
  },
};
</script>

<style scoped></style>
