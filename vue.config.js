const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify", "vue-persist"],

  pwa: {
    name: "随机点名器",
    themeColor: "#FF0000",
  },
});
