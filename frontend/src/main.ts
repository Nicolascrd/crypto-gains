import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(VueQueryPlugin).mount("#app");
