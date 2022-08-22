<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>随机点名器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            dark
            href="https://github.com/AkariRin/random-name"
            target="_blank"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>在GitHub查看源代码</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer>
      <v-col cols="12" class="text-center"><strong>random-name</strong></v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";

export default Vue.extend({
  name: "App",
  data: () => ({}),
  computed: {
    dark: {
      get: (): boolean => store.state.dark,
      set: (newValue) =>
        store.commit("updateSettingsBoolean", {
          key: "dark",
          value: newValue,
        }),
    },
    darkWithOS: {
      get: (): boolean => store.state.darkWithOS,
      set: (newValue) => {
        store.commit("updateSettingsBoolean", {
          key: "darkWithOS",
          value: newValue,
        });
        //待添加removeEventListener
      },
    },
  },
  created() {
    //深色模式跟随系统
    if (this.darkWithOS) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      this.$vuetify.theme.dark = mq.matches;
      store.commit("updateSettingsBoolean", { key: "dark", value: mq.matches });
      mq.addEventListener("change", (e) => {
        this.$vuetify.theme.dark = e.matches;
      });
    } else {
      this.$vuetify.theme.dark = store.state.dark;
    }
  },
  mounted() {
    //
  },
});
</script>
