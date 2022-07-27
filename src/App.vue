<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>随机点名器</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            dark
            href="https://github.com/AkariRin/random-name"
            target="_blank"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>在GitHub查看源代码</span>
      </v-tooltip>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer>
      <v-col cols="12" class="text-center"><strong>random-name</strong> </v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
};
</script>
