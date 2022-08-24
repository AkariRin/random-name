<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>随机点名器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="dialogDark = true">
        <v-icon>mdi-weather-night</v-icon>
      </v-btn>
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
        v-model="snackbarCached"
        transition="slide-y-reverse-transition"
      >
        缓存完毕，可以离线使用了
      </v-snackbar>
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
      <v-dialog v-model="dialogDark" max-width="300">
        <v-card>
          <v-card-title>主题偏好</v-card-title>
          <v-card-text>
            <v-radio-group v-model="themePreference" column mandatory>
              <v-radio label="浅色模式" value="light"></v-radio>
              <v-radio label="深色模式" value="dark"></v-radio>
              <v-radio label="跟随系统设置" value="followOS"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="dialogDark = false" dark>
              <v-icon>mdi-close</v-icon>关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    snackbarCached: false,
    dialogDark: false,
  }),
  computed: {
    themePreference: {
      get: (): "light" | "dark" | "followOS" => store.state.themePreference,
      set: function (newValue: "light" | "dark" | "followOS"): void {
        store.commit("updateSettingsTheme", newValue);
        //当主题偏好不跟随系统时，同步到$vuetify
        newValue === "followOS"
          ? (this.$vuetify.theme.dark = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches)
          : newValue === "light"
          ? (this.$vuetify.theme.dark = false)
          : (this.$vuetify.theme.dark = true);
      },
    },
  },
  methods: {
    swRefresh(): void {
      this.snackbarUpdated = false;
      document.dispatchEvent(new CustomEvent("swSkipWaiting"));
    },
  },
  created(): void {
    //service worker提示
    document.addEventListener(
      "swCached",
      (): void => {
        this.snackbarCached = true;
      },
      {
        once: true,
      }
    );
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
      (event): void => {
        this.snackbarUpdated = true;
        let e = event as CustomEvent;
        let reg = e.detail;
        document.addEventListener(
          "swSkipWaiting",
          () => {
            if (!reg || !reg.waiting) return;
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
            console.log("skipped");
          },
          { once: true }
        );
      },
      {
        once: true,
      }
    );
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
    //主题偏好设置
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    this.themePreference === "followOS"
      ? (this.$vuetify.theme.dark = mq.matches)
      : this.themePreference === "dark"
      ? (this.$vuetify.theme.dark = true)
      : (this.$vuetify.theme.dark = false);
    mq.addEventListener("change", (e) => {
      if (this.themePreference === "followOS") {
        this.$vuetify.theme.dark = e.matches;
      }
    });
  },
});
</script>
