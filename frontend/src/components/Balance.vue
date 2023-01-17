<template>
  <button @click="$emit('return')">RETURN</button>
  <div>Current Balance : {{ accountName }}</div>
  <div>
    <div v-for="(bal, asset) in balance">{{ asset }} ---- {{ bal }}</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBalance, getName } from "./../api";

defineEmits(["return"]);

const balance = ref({});
const accountName = ref("");

const { id } = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
onMounted(async () => {
  const data = await getBalance(id);
  const name = await getName(id);

  if (data) {
    balance.value = data;
  }
  if (name) {
    accountName.value = name;
  }
});
</script>

<style scoped></style>
