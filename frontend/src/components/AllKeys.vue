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
table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
table thead th {
  background-color: #009879;
  color: #ffffff;
  text-align: left;
}
table th,
table td {
  padding: 12px 15px;
}
td {
  cursor: pointer;
}
tr:hover {
  background-color: #00987a8e;
}
</style>
