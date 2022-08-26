<template>
  <v-container>
    <!--删除确认对话框-->
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
    <!--删除确认对话框 结束-->
    <!--添加姓名对话框-->
    <v-dialog v-model="batchAddNameDialog" max-width="600px">
      <v-card>
        <v-card-title>批量添加姓名</v-card-title>
        <v-card-subtitle>添加到：{{ targetList }}</v-card-subtitle>
        <v-card-text>
          <v-textarea
            v-model="batchAddNameContent"
            filled
            clearable
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="batchAddNameDialog = false" color="primary" dark>
            <v-icon left>mdi-plus</v-icon>关闭
          </v-btn>
          <v-btn color="blue" dark><v-icon left>mdi-plus</v-icon>添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--删除确认对话框 结束-->
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-expansion-panels>
          <v-expansion-panel v-for="(values, index) in namelists" :key="index">
            <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="values"
                sort-by="name"
                mobile-breakpoint="0"
                locale="zhHans"
                class="elevation-1"
                disable-filtering
              >
                <template v-slot:top>
                  <v-toolbar flat>
                    <v-toolbar-title>编辑名单：{{ index }}</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn @click="batchAddNameOpen(index)" color="purple" dark
                      ><v-icon left>mdi-plus</v-icon>添加姓名
                    </v-btn>
                    <v-btn
                      @click="deleteConfirm('list', index)"
                      color="primary"
                      dark
                      ><v-icon left>mdi-delete</v-icon>删除名单
                    </v-btn>
                  </v-toolbar>
                </template>
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
    deleteType: "list" as "name" | "list",
    batchAddNameDialog: false,
    batchAddNameContent: "",
    targetList: "",
    targetIndex: -1 as number,
  }),
  methods: {
    batchAddNameOpen(list: string): void {
      this.targetList = list;
      this.batchAddNameContent = "";
      this.batchAddNameDialog = true;
    },
    //batchAddNameExec(): void {},
    deleteConfirm(
      type: "name" | "list",
      targetList: string,
      target?: { name: string }
    ): void {
      this.targetList = targetList;
      this.deleteType = type;
      target !== undefined
        ? (this.targetIndex = _.indexOf(this.namelists[targetList], target))
        : (this.targetIndex = -1);
      this.deleteDialog = true;
    },
    deleteExec(action: "delete" | "cancel"): void {
      if (action === "delete" && this.deleteType === "name") {
        this.namelists[this.targetList].splice(this.targetIndex, 1);
      } else if (action === "delete" && this.deleteType === "list") {
        delete this.namelists[this.targetList];
      }
      //关闭时将数据初始化
      this.deleteType = "list";
      this.targetIndex = -1;
      this.deleteDialog = false;
    },
  },
  watch: {
    deleteDialog(val) {
      val || this.deleteExec("cancel");
    },
    namelists: {
      //删除名单无法同步到vuex，待解决
      handler(newValue) {
        store.commit("updateListViewNamelists", newValue);
      },
      deep: true,
    },
  },
  computed: {
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
        : `你确定要删除名单 ${this.targetList} 中的 ${
            this.namelists[this.targetList][this.targetIndex].name
          } 吗？`;
    },
  },
});
</script>
