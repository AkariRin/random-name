import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";

Vue.use(Vuex);

//vuex数据的类型
type settings = {
  mode: "0" | "1" | "2";
  batch_count: number;
  selected: string;
  allowRepeat: boolean;
  unique: boolean;
  sync_code: string;
  dark: boolean;
  darkWithOS: boolean;
};

type states = settings & {
  namelists: {
    [key: string]: Array<string>;
  };
};

//返回给ListView的数据的接口
type listNamelist = {
  [key: string]: { name: string }[];
};

export default new Vuex.Store({
  state: {
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
    //深色模式
    dark: false,
    //深色模式跟随系统
    darkWithOS: false,
    namelists: {
      ListA: ["PersonA", "PersonB", "PersonC"],
      ListB: ["PersonF", "PersonD", "PersonE"],
    },
  },
  getters: {
    homeGetNamelistById: (state: states) => (id: string) => state.namelists[id],
    listGetNamelist: (state: states) => {
      const _result: listNamelist = {};
      _.forIn(state.namelists, (value, key) => {
        _result[key] = _.map(value, (_arr) => {
          return { name: _arr };
        });
      });
      return _result;
    },
  },
  mutations: {
    updateSettingsString(
      state,
      payload: {
        key: "sync_code";
        value: string;
      }
    ) {
      state[payload.key] = payload.value;
    },
    updateSettingsBoolean(
      state,
      payload: {
        key: "allowRepeat" | "unique" | "dark" | "darkWithOS";
        value: boolean;
      }
    ) {
      state[payload.key] = payload.value;
    },
    updateSettingsNumber(
      state,
      payload: {
        key: "batch_count";
        value: number;
      }
    ) {
      state[payload.key] = payload.value;
    },
    updateSettingsMode(state, payload: "0" | "1" | "2") {
      state.mode = payload;
    },
  },
  actions: {},
  modules: {},
});
