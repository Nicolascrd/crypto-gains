<template>
  <div class="sidebar-container">
    <SideBar />
  </div>
  <div class="page-container">
    <Balance />
  </div>
</template>

<script setup lang="ts">
import SideBar from "../components/SideBar.vue";
import Balance from "../components/Balance.vue";
import { onMounted } from "vue";
import { useStore } from "../store";
import { router, paths } from "./../router";
import { storeToRefs } from "pinia";

const store = useStore();
const { numberOfSelectedIds } = storeToRefs(store);

if (numberOfSelectedIds.value == 0) {
  // no id selected
  router.push(paths.home);
}

</script>

<style></style>
