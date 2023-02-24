<template>
  <div class="sidebar">
    <v-list lines="one">
      <v-list-item
        title="HOME"
        class="sidebar-element v-theme-light"
        :active="router.currentRoute.value.path == paths.home"
        @click="router.push(paths.home)"
      >
      </v-list-item>
      <v-list-item
        title="BALANCE"
        class="sidebar-element v-theme-light"
        :active="router.currentRoute.value.path == paths.balance"
        :disabled="!atLeastOneSelectedId"
        @click="atLeastOneSelectedId && router.push(paths.balance)"
      >
      </v-list-item>
      <v-list-item
        title="DEPOSITS"
        class="sidebar-element v-theme-light"
        :active="router.currentRoute.value.path == paths.deposits"
        :disabled="!atLeastOneSelectedId"
        @click="atLeastOneSelectedId && router.push(paths.deposits)"
      >
      </v-list-item>
      <v-list-item
        title="UPLOAD"
        class="sidebar-element v-theme-light"
        :active="router.currentRoute.value.path == paths.upload"
        :disabled="!atLeastOneSelectedId"
        @click="atLeastOneSelectedId && router.push(paths.upload)"
      >
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "./../store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { paths } from "../router";

const router = useRouter();
const { atLeastOneSelectedId } = storeToRefs(useStore());
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
.sidebar-element.block {
  color: lightgray;
  cursor: not-allowed;
}
.sidebar-element.block:hover {
  font-weight: inherit;
  color: lightgray;
}
</style>
