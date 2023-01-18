<template>
  <div class="sidebar-container">
    <SideBar></SideBar>
  </div>
  <div>
    <Balance />
  </div>
</template>

<script setup lang="ts">
import SideBar from "../components/SideBar.vue";
import Balance from "../components/Balance.vue";
</script>

<style>
.sidebar-container {
}
</style>
