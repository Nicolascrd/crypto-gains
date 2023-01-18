<template>
  <div class="sidebar">
    <div class="sidebar-element">
      <RouterLink :to="paths.home">HOME</RouterLink>
    </div>
    <div class="sidebar-element">
      <RouterLink :to="paths.balance">BALANCE</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { paths } from "../router";
</script>

<style scoped>
.sidebar {
  max-width: 200px;
}

.sidebar-element {
  width: 100%;
  height: 50px;
  padding: 15px;
}
</style>
