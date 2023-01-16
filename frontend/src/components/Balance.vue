<template>
  <div>
    <div v-for="(bal, asset) in balance">{{ asset }} ---- {{ bal }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBalance } from "./../api";

const balance = ref({});

onMounted(async () => {
  const data = await getBalance(1);

  console.log("data: ", data);

  if (data) {
    balance.value = data;
  }
});
</script>

<style scoped></style>
