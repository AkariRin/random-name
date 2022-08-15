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
      <v-dialog v-model="darkmode_dialog" max-width="500px">
        <v-card>
          <v-card-title>外观</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-radio-group v-model="$vuetify.theme.dark">
                  <v-radio value="false" label="浅色模式"></v-radio>
                  <v-radio value="true" label="深色模式"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <router-view />
    </v-main>
    <v-footer>
      <v-col cols="12" class="text-center"><strong>random-name</strong></v-col>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    darkmode_dialog: true,
  }),
};
</script>
