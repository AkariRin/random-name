<template>
  <v-container>
    <!--删除名字确认对话框-->
    <v-dialog v-model="deleteDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 text-center">
          {{ deleteDialogText }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteExec('cancel')" text>取消</v-btn>
          <v-btn @click="deleteExec('delete')" text>确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--删除名字确认对话框 结束-->
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-expansion-panels>
          <v-expansion-panel v-for="(values, index) in namelists" :key="index">
            <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="values"
                mobile-breakpoint="0"
                locale="zhHans"
                class="elevation-1"
              >
                <template v-slot:no-data> 名单为空 </template>
                <template #[`item.actions`]="{ item }">
                  <v-btn icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn @click="deleteConfirm('name', index, item)" icon>
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";
import store, { listNameList } from "@/store";

export default Vue.extend({
  name: "ListView",
  data: () => ({
    namelists: store.getters.listGetNamelist as listNameList,
    headers: [
      { text: "姓名", value: "name" },
      { text: "操作", value: "actions", sortable: false },
    ],
    deleteDialog: false,
    deleteType: "name" as "name" | "list",
    targetList: "",
    targetIndex: -1 as number,
  }),
  methods: {
    deleteConfirm(
      type: "name" | "list",
      targetList: string,
      target?: { name: string }
    ): void {
      this.deleteType = type;
      this.targetList = targetList;
      target !== undefined
        ? (this.targetIndex = _.indexOf(this.namelists[targetList], target))
        : (this.targetIndex = -1);
      this.deleteDialog = true;
    },
    deleteExec(action: "delete" | "cancel"): void {
      if (action === "delete") {
        this.namelists[this.targetList].splice(this.targetIndex, 1);
      }
      this.deleteDialog = false;
    },
  },
  watch: {
    deleteDialog(val) {
      val || this.deleteExec("cancel");
    },
    namelists: {
      handler(newValue) {
        store.commit("updateListViewNamelists", newValue);
      },
      deep: true,
    },
  },
  computed: {
    /*
    namelists: {
      get: (): listNameList => store.getters.listGetNamelist,
      set: function (newValue): void {
        this.$nextTick(() => {
          store.commit("updateListViewNamelists", newValue);
        });
      },
    },
    */
    //去重
    unique: {
      get: (): boolean => store.state.unique,
      set: (newValue): void =>
        store.commit("updateSettingsBoolean", {
          key: "unique",
          value: newValue,
        }),
    },
    deleteDialogText: function (): string {
      return this.deleteType === "list"
        ? `你确定要删除名单 ${this.targetList} 吗？`
        : `你确定要删除名单 ${this.targetList} 中的 ${this.targetIndex} 吗？`;
    },
  },
});
</script>
