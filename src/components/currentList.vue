<template>
  <v-dialog v-model="dialog" max-width="1000" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" block>查看当前名单</v-btn>
    </template>
    <v-card tile>
      <v-card-title>当前名单</v-card-title>
      <v-card-subtitle>人数：{{ count }}人</v-card-subtitle>
      <v-card-text>
        <v-chip v-for="chip in chips" :key="chip" class="ma-1">{{
          chip
        }}</v-chip>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" color="primary" dark>
          <v-icon>mdi-close</v-icon>关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import _ from "lodash";

export default Vue.extend({
  name: "currentList",
  props: ["list"],
  data: () => ({
    dialog: false,
  }),
  computed: {
    count: function (): number {
      return _.size(this.list);
    },
    chips: function (): Array<string> {
      return this.list;
    },
  },
});
</script>

<style scoped></style>
