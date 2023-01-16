<script setup lang="ts">
import { ref } from "vue";
import AllKeys from "./components/AllKeys.vue";
import Balance from "./components/Balance.vue";

const keyId = ref(0); // unset

function updateKeyId(id: number) {
  keyId.value = id;
  console.log("updateKeyId", id);
}
</script>

<template>
  <div v-if="keyId > 0">
    <Balance :id="keyId" />
  </div>
  <div v-else>
    <AllKeys @updateKeyId="updateKeyId" />
  </div>
</template>

<style scoped></style>
