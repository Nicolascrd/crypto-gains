import HomePage from "./pages/HomePage.vue";
import BalancePage from "./pages/BalancePage.vue";
import DepositsPage from "./pages/DepositsPage.vue";

import { createRouter, createWebHashHistory } from "vue-router";

export const paths = {
  home: "/",
  balance: "/balance",
  deposits: "/deposits",
};

const routes = [
  { path: paths.home, component: HomePage },
  { path: paths.balance, component: BalancePage },
  { path: paths.deposits, component: DepositsPage },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
