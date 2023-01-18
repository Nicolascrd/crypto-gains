<template>
  <div v-if="allKeys.length">
    Please Select the key corresponding to your desired account.
    <table>
      <thead>
        <th>Key ID</th>
        <th>Key Name</th>
        <th>Public Key</th>
      </thead>
      <tr v-for="row of allKeys" @click="$emit('updateKeyId', row.key_id)">
        <td>{{ row.key_id }}</td>
        <td>{{ row.name }}</td>
        <td>{{ row.public_key }}</td>
      </tr>
    </table>
  </div>
  <div v-else>
    Please Add a Key in order to use the app.
    <NewKey />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IKey, getAllKeys } from "./../api";
import NewKey from "./NewKey.vue";

defineEmits(["updateKeyId"]);

const allKeys = ref([] as IKey[]);

onMounted(async () => {
  const data = await getAllKeys();

  console.log("data: ", data);

  if (data) {
    allKeys.value = data;
  }
});
</script>

<style scoped>
td {
  cursor: pointer;
}
</style>
