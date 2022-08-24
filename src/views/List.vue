<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="10" offset-md="1">
        <v-expansion-panels>
          <v-expansion-panel v-for="(values, index) in namelists" :key="index">
            <v-expansion-panel-header>{{ index }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="headers"
                :items="values"
                class="elevation-1"
              >
                <template v-slot:no-data> 名单为空 </template>
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
import store, { listNameList } from "@/store";

export default Vue.extend({
  name: "ListView",
  data: () => ({
    headers: [
      { text: "姓名", value: "name" },
      { text: "操作", value: "actions", sortable: false },
    ],
  }),
  computed: {
    namelists: {
      get: (): listNameList => store.getters.listGetNamelist,
      set: (newValue): void =>
        store.commit("updateListViewNamelists", newValue),
    },
    //去重
    unique: {
      get: (): boolean => store.state.unique,
      set: (newValue): void =>
        store.commit("updateSettingsBoolean", {
          key: "unique",
          value: newValue,
        }),
    },
  },
});
</script>
