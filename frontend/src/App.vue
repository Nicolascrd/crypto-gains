<script setup lang="ts">
import { useStore } from "./store";
import { storeToRefs } from "pinia";

const store = useStore();
const { id } = storeToRefs(store);
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped></style>
