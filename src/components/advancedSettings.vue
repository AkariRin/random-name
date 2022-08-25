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
        <v-card-text></v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
//import { Base64 } from "js-base64";

export default Vue.extend({
  name: "advancedSettings",
  data: () => ({
    dialog: false,
  }),
});
</script>

<style scoped></style>
