<template>
  <div v-if="allKeys.length">
    Please Select the key(s) corresponding to your desired account.<br />
    You have to select at least one key to access the rest of the app
    <table>
      <thead class="thead">
        <th>Key ID</th>
        <th>Exchange</th>
        <th>Key Name</th>
        <th>Public Key</th>
      </thead>
      <tr
        v-for="row of allKeys"
        @click="toggle(parseInt(row.key_id))"
        :class="{ selected: selectedIds[parseInt(row.key_id)] }"
      >
        <td>{{ row.key_id }}</td>
        <td>{{ row.exchange }}</td>
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
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useStore } from "../store";
import { IKey, getAllKeys } from "./../api";
import NewKey from "./NewKey.vue";

const allKeys = ref([] as IKey[]);
const store = useStore();
const { toggle } = store;
const { selectedIds } = storeToRefs(store);

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
tr {
  box-sizing: border-box;
  border: 1px solid var(--light-green);
}
.thead {
  border: 1px solid var(--light-green);
}
tr:hover {
  border: 1px solid var(--dark-green);
}
tr.selected {
  background-color: var(--dark-green);
  color: white;
}
</style>
