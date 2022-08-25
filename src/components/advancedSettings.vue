<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon dark @click="dialog = true" v-bind="attrs" v-on="on">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <span>高级设置</span>
    </v-tooltip>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>高级设置</v-card-title>
        <v-card-text>
          <v-tabs v-model="tab">
            <v-tab
              v-for="(tab, index) in tabs"
              :key="tab"
              :href="`#tab-${index}`"
              >{{ tab }}</v-tab
            >
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item value="tab-0"></v-tab-item>
            <v-tab-item value="tab-1"></v-tab-item>
            <v-tab-item value="tab-2">
              <v-container>
                <v-row></v-row>
                <v-row>
                  <v-spacer></v-spacer>
                </v-row>
              </v-container>
            </v-tab-item>
            <v-tab-item value="tab-3"></v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { Base64 } from "js-base64";

export default Vue.extend({
  name: "advancedSettings",
  data: () => ({
    dialog: false,
    tab: null,
    tabs: ["缓存设置", "导入数据", "导出数据", "关于"],
  }),
  computed: {
    //导出base64加密过的数据
    encodedDataExport: (): string => Base64.encode(JSON.stringify(store.state)),
  },
});
</script>

<style scoped></style>
