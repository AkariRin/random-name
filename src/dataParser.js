/*
这个文件封装的函数均为ListView中的数据处理函数
由于Vuetify v-data-table的数据格式要求，需要对本地存储中的数据进行处理之后再加载
 */

import _ from "lodash";

//加载设置
export function loadSettings() {
  let _raw = JSON.parse(localStorage.getItem("data"));
  return _raw.settings.unique;
}

//写入设置
export function writeSettings(bool) {
  let _raw = JSON.parse(localStorage.getItem("data"));
  _raw.settings.unique = bool;
  localStorage.setItem("data", JSON.stringify(_raw));
}

//加载名单
export function loadNameList() {
  let _raw = JSON.parse(localStorage.getItem("data"));
  let _result = {};
  _.forIn(_raw.namelists, (value, key) => {
    _result[key] = _.map(value, (_arr) => {
      return { name: _arr };
    });
  });
  return _result;
}

//写入名单
//export function writeNameList(val) {}

//在组件挂载时检查Item是否存在，避免用户第一次直接打开/list路由导致没有默认数据生成的问题
export function checkLSExists() {
  if (localStorage.getItem("data") === null) {
    let _default = {
      settings: {
        mode: "0",
        batch_count: 0,
        selected: "ListA",
        allowRepeat: false,
        unique: true,
        sync_code: "",
      },
      namelists: {},
    };
    localStorage.setItem("data", JSON.stringify(_default));
  }
}
