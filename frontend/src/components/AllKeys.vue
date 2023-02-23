<template>
  <div v-if="isError">Error : make sure the backend is launched</div>
  <div v-else-if="isLoading">Loading...</div>
  <div v-else-if="allKeys?.length">
    Please Select the key(s) corresponding to your desired account.<br />
    You have to select at least one key to access the rest of the app
    <v-table>
      <thead class="thead">
        <tr>
          <th>Key ID</th>
          <th>Exchange</th>
          <th>Key Name</th>
          <th>Public Key</th>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
    </v-table>
  </div>
  <div v-else>
    Please Add a Key in order to use the app.
    <NewKey @new-key-refresh="() => invalidateKeysQuery()" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useStore } from "../store";
import { getAllKeys } from "./../api";
import NewKey from "./NewKey.vue";

const queryClient = useQueryClient();

const invalidateKeysQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["allKeys"] });
};

const store = useStore();
const { toggle } = store;
const { selectedIds } = storeToRefs(store);

const {
  data: allKeys,
  isLoading,
  isError,
} = useQuery(["allKeys"], () => getAllKeys());
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
.thead > th {
  text-align: left;
}
tr:hover {
  border: 1px solid var(--dark-green);
}
tr.selected {
  background-color: var(--dark-green);
  color: white;
}
</style>
