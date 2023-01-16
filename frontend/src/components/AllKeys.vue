<template>
  <div>
    <div v-for="row of allKeys">
      {{ row.key_id }} ---- {{ row.name }} ---- {{ row.public_key }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IKey, getAllKeys } from "./../api";

const allKeys = ref([] as IKey[]);

onMounted(async () => {
  const data = await getAllKeys();

  console.log("data: ", data);

  if (data) {
    allKeys.value = data;
  }
});
</script>

<style scoped></style>
