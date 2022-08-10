<template>
  <v-container fluid>
    <!--删除名字确认对话框-->
    <v-dialog v-model="componentCtl.deleteNameConfirm" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 text-center"
          >你确定要删除”{{ componentCtl.deleteName }}“吗？</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteNameConfirm(true)">取消</v-btn>
          <v-btn text @click="deleteName">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--删除名字确认对话框 结束-->
    <v-row>
      <v-col cols="1" offset="2">
        <v-btn @click="$router.push('/')">
          <v-icon left>mdi-arrow-left</v-icon>
          返回
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1" offset="2">
        <v-switch v-model="unique"></v-switch>
      </v-col>
      <v-col cols="1" offset="6">
        <v-btn block>
          <v-icon left>mdi-plus</v-icon>
          添加名单
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" offset="2">
        <v-expansion-panels>
          <v-expansion-panel v-for="(values, index) in namelists" :key="index">
            <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="10" offset="1">
                  <v-data-table :headers="headers" :items="values">
                    <template v-slot:no-data> No data </template>
                    <template #[`item.actions`]="{ item }">
                      <v-btn icon>
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn @click="deleteNameConfirm(false, item.name)" icon>
                        <v-icon small>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as dataParser from "@/dataParser";

export default {
  name: "ListView",
  data: () => ({
    unique: false,
    namelists: {},
    headers: [
      { text: "姓名", value: "name" },
      { text: "操作", value: "actions", sortable: false },
    ],
    componentCtl: {
      deleteNameConfirm: false,
      deleteName: "",
    },
  }),
  beforeMount() {
    dataParser.checkLSExists();
    this.unique = dataParser.loadSettings();
    this.namelists = dataParser.loadNameList();
  },
  methods: {
    addName() {},
    deleteName(item) {
      console.log(item);
      this.componentCtl.deleteNameConfirm = false;
    },
    deleteNameConfirm(close, item) {
      if (close) {
        this.componentCtl.deleteNameConfirm = false;
        return;
      }
      this.componentCtl.deleteName = item;
      this.componentCtl.deleteNameConfirm = true;
    },
    addList() {},
    deleteList() {},
  },
  watch: {
    unique() {
      dataParser.writeSettings(this.unique);
    },
    namelists: {
      handler() {
        dataParser.writeNameList(this.namelists);
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
