<template>
  <v-dialog v-model="dialog" max-width="1000" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">查看当前名单</v-btn>
    </template>
    <v-card tile>
      <v-card-title>当前名单</v-card-title>
      <v-card-text>
        <v-chip v-for="c in chips" :key="c">{{ c }}</v-chip>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" color="red" dark
          ><v-icon>mdi-close</v-icon>关闭</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "currentList",
  props: ["list"],
  data: () => ({
    chips: Array,
    dialog: false,
  }),
  beforeMount() {
    this.chips = this.list;
  },
  watch: {
    list: {
      handler(newValue) {
        this.chips = newValue;
      },
    },
  },
};
</script>

<style scoped></style>
