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
      <v-snackbar
        v-model="snackbarUpdFound"
        transition="slide-y-reverse-transition"
      >
        发现更新，下载中
      </v-snackbar>
      <v-snackbar
        v-model="snackbarUpdated"
        transition="slide-y-reverse-transition"
        timeout="-1"
      >
        更新已完成，请刷新页面以使用新版本
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="swRefresh">
            刷新
          </v-btn>
        </template>
      </v-snackbar>
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
  data: () => ({
    snackbarUpdFound: false,
    snackbarUpdated: false,
    reg: CustomEvent,
  }),
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
      },
    },
  },
  methods: {
    swRefresh(): void {
      this.snackbarUpdated = false;
      document.dispatchEvent(new CustomEvent("swSkipWaiting"));
      console.log("refreshed");
    },
  },
  created(): void {
    //service worker提示
    document.addEventListener(
      "swUpdateFound",
      (): void => {
        this.snackbarUpdFound = true;
      },
      {
        once: true,
      }
    );
    document.addEventListener(
      "swUpdated",
      (): void => {
        this.snackbarUpdated = true;
      },
      {
        once: true,
      }
    );
    //深色模式跟随系统
    if (this.darkWithOS) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      this.$vuetify.theme.dark = mq.matches;
      store.commit("updateSettingsBoolean", { key: "dark", value: mq.matches });
      mq.addEventListener("change", (e) => {
        if (this.darkWithOS) {
          this.$vuetify.theme.dark = e.matches;
        }
      });
    } else {
      this.$vuetify.theme.dark = store.state.dark;
    }
  },
});
</script>
