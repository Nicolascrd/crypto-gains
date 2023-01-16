<template>
  <div>
    <div v-for="(bal, asset) in balance">{{ asset }} ---- {{ bal }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import { getBalance } from "./../api";

const balance = ref({});
const { id } = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
onMounted(async () => {
  const data = await getBalance(id);

  console.log("data: ", data);

  if (data) {
    balance.value = data;
  }
});
</script>

<style scoped></style>
