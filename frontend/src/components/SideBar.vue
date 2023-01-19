<template>
  <div class="sidebar">
    <div class="sidebar-element" @click="router.push(paths.home)">
      <div>HOME</div>
    </div>
    <div
      class="sidebar-element"
      :class="{
        selected: router.currentRoute.value.path == paths.balance,
      }"
      @click="router.push(paths.balance)"
    >
      <div>BALANCE</div>
    </div>
    <div
      class="sidebar-element"
      :class="{
        selected: router.currentRoute.value.path == paths.deposits,
      }"
      @click="router.push(paths.deposits)"
    >
      <div>DEPOSITS</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { paths } from "../router";

const router = useRouter();
</script>

<style scoped>
.sidebar {
  max-width: 200px;
  -moz-box-shadow: -3px 0 5px 0 #555;
  -webkit-box-shadow: -3px 0 5px 0 #555;
  box-shadow: -3px 0 5px 0 #555;
  height: 100%;
}

.sidebar-element {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 0.5em;
  border-radius: 0.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.sidebar-element.selected {
  font-weight: 600;
  color: var(--light-green);
}
.sidebar-element.selected:before {
  content: "";
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px; /* or 100px */
  border-right: 3px solid var(--light-green);
}
.sidebar-element:hover {
  font-weight: 600;
  color: var(--light-green);
}
</style>
