const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],

  pwa: {
    name: "随机点名器",
  },
});
