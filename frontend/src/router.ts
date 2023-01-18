import HomePage from "./pages/HomePage.vue";
import BalancePage from "./pages/BalancePage.vue";
import { createRouter, createWebHashHistory } from "vue-router";

export const paths = {
  home: "/",
  balance: "/balance",
};

const routes = [
  { path: paths.home, component: HomePage },
  { path: paths.balance, component: BalancePage },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
