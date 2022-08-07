<template>
  <div>
    {{ list }}{{ result }} {{ isBatch }} {{ isRunning }}
    <div
      class="text-h1 text-center"
      v-if="!isBatch && !isRunning"
      v-text="result"
    ></div>
    <div
      class="text-h1 text-center"
      v-if="!isBatch && isRunning"
      v-text="text"
    ></div>
  </div>
</template>

<script>
//import _ from "lodash";

export default {
  name: "resultDisplay",
  props: ["list", "result", "isBatch", "isRunning"],
  data: () => ({
    text: "",
  }),
  /*
  滚动函数的实现暂时搁置
  watch: {
    isRunning: function () {
      new Promise(() => {
        while (!this.isRunning) {
          let _i = 0;
          console.log(_i);
          if (!this.isRunning) {
            return 0;
          }
          if (_i >= _.size(this.list)) {
            _i = 0;
          }
          this.text = this.list[_i];
          _i += 1;
          setTimeout(() => {}, 500);
        }
      });
    },
  },
  */
};
</script>

<style scoped></style>
