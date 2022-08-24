<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="3" offset-md="1">
        <v-select
          v-model="selected"
          :items="list_selector"
          :value="selected"
          single-line
        ></v-select>
      </v-col>
      <v-col cols="6" md="1">
        <current-list :list="currentList"></current-list>
      </v-col>
      <v-col cols="6" md="1">
        <v-btn @click="$router.push('/list')" block>
          <v-icon left>mdi-cog</v-icon>管理名单
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" offset-md="1">
        <v-radio-group v-model="mode" row mandatory>
          <v-radio label="单抽" value="0"></v-radio>
          <v-radio label="滚动" value="1"></v-radio>
          <v-radio label="批量" value="2"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12" v-show="mode === '2'"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" offset-md="1">
        <v-switch v-model="allowRepeat"></v-switch>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-btn v-if="mode === '0'" color="blue" block dark>开始单抽</v-btn>
        <v-btn
          v-if="mode === '1' && isRunning === false"
          @click="startRunning"
          color="blue"
          block
          dark
          >开始单抽</v-btn
        >
        <v-btn
          v-if="mode === '1' && isRunning === true"
          @click="random"
          color="primary"
          block
          dark
          >停止</v-btn
        >
        <v-btn v-if="mode === '2'" @click="randomBatch" color="blue" block dark>
          批量抽取
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <info-panel></info-panel>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <result-display
          :result="result"
          :list="currentList"
          :mode="mode"
          :is-running="isRunning"
        ></result-display>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import store from "@/store";
import infoPanel from "@/components/infoPanel.vue";
import resultDisplay from "@/components/resultDisplay.vue";
import currentList from "@/components/currentList.vue";

export default Vue.extend({
  name: "HomeView",
  components: { currentList, resultDisplay, infoPanel },
  data: () => ({
    result: "?" as string | Array<string> | undefined,
    currentList: store.state.namelists[store.state.selected],
    isRunning: false,
  }),
  methods: {
    startRunning(): void {
      this.isRunning = true;
    },
    random(): void {
      this.result = _.sample(this.currentList);
      if (!this.allowRepeat) {
        _.pull(this.currentList, this.result);
      }
      this.isRunning = false;
    },
    randomBatch(): void {
      this.result = _.sampleSize(this.currentList, this.batchCount);
      this.isRunning = false;
      if (!this.allowRepeat) {
        _.pullAll(this.currentList, this.result);
      }
    },
  },
  computed: {
    //列表选择器
    list_selector: function (): Array<string> {
      return _.keysIn(store.state.namelists);
    },
    //选中的名单
    selected: {
      get: (): string => store.state.selected,
      set: function (newValue): void {
        store.commit("updateSettingsString", {
          key: "selected",
          value: newValue,
        });
        this.currentList = store.state.namelists[store.state.selected];
      },
    },
    //抽取模式
    mode: {
      get: (): "0" | "1" | "2" => store.state.mode,
      set: (newValue): void => store.commit("updateSettingsMode", newValue),
    },
    //重复抽取
    allowRepeat: {
      get: (): boolean => store.state.allowRepeat,
      set: (newValue): void =>
        store.commit("updateSettingsBoolean", {
          key: "allowRepeat",
          value: newValue,
        }),
    },
    //批量抽取数量
    batchCount: {
      get: (): number => store.state.batchCount,
      set: (newValue): void =>
        store.commit("updateSettingsNumber", {
          key: "batchCount",
          value: newValue,
        }),
    },
  },
});
</script>
