<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>随机点名器</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-footer></v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
};
</script>
