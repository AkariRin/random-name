import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
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
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
