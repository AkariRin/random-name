import Vue from "vue";
import Vuex from "vuex";
import _ from "lodash";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);
const vuexLocal = new VuexPersistence({
  key: "vuex",
  storage: window.localStorage,
});

//vuex数据的类型
type settings = {
  mode: "0" | "1" | "2";
  batchCount: number;
  selected: string;
  allowRepeat: boolean;
  unique: boolean;
  sync_code: string;
  themePreference: "light" | "dark" | "followOS";
};

type states = settings & {
  namelists: {
    [key: string]: Array<string>;
  };
};

//返回给ListView的数据的类型
type listNamelist = {
  [key: string]: { name: string }[];
};

export default new Vuex.Store<states>({
  state: {
    //抽取模式,0为单抽,1为带滚动,2为批量
    mode: "0",
    //批量抽取模式中的抽取数量
    batchCount: 0,
    //选定的列表
    selected: "ListA",
    //允许重复抽取
    allowRepeat: false,
    //自动去重
    unique: true,
    //同步码
    sync_code: "",
    //主题偏好
    themePreference: "light",
    namelists: {
      ListA: ["PersonA", "PersonB", "PersonC"],
      ListB: ["PersonF", "PersonD", "PersonE"],
    },
  },
  getters: {
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
        key: "allowRepeat" | "unique";
        value: boolean;
      }
    ) {
      state[payload.key] = payload.value;
    },
    updateSettingsNumber(
      state,
      payload: {
        key: "batchCount";
        value: number;
      }
    ) {
      state[payload.key] = payload.value;
    },
    updateSettingsMode(state, payload: "0" | "1" | "2") {
      state.mode = payload;
    },
    updateSettingsTheme(state, payload: "light" | "dark" | "followOS") {
      state.themePreference = payload;
    },
  },
  plugins: [vuexLocal.plugin],
});
