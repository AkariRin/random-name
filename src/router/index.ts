import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  //主页
  {
    path: "/",
    name: "home",
    component: Home,
  },
  //名单管理
  {
    path: "/list",
    name: "list",
    component: () => import("../views/List.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
