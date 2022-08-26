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
                <v-row>
                  <v-textarea
                    label="导出数据"
                    :value="encodedDataExport"
                    :hint="copiedText"
                    persistent-hint
                    filled
                    readonly
                  ></v-textarea>
                </v-row>
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn @click="copy" color="blue" dark>
                    <v-icon left>mdi-clipboard-text</v-icon>复制到剪贴板
                  </v-btn>
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
    copiedText: "",
  }),
  methods: {
    async copy(): Promise<void> {
      this.copiedText = "";
      await navigator.clipboard.writeText(this.encodedDataExport);
      this.copiedText = "已复制到剪贴板";
      await setTimeout(() => {
        this.copiedText = "";
      }, 3000);
    },
  },
  computed: {
    //导出base64加密过的数据
    encodedDataExport: (): string => Base64.encode(JSON.stringify(store.state)),
  },
});
</script>

<style scoped></style>
