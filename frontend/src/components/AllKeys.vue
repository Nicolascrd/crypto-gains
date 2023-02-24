<template>
  <div v-if="isError">Error : make sure the backend is launched</div>
  <div v-else-if="isLoading">Loading...</div>
  <div v-else-if="allKeys?.length">
    <h1>Please Select the key(s) corresponding to your desired account.</h1>
    <div class="table-container">
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
            :class="{
              'v-theme--light': selectedIds[parseInt(row.key_id)],
              'bg-blue-darken-3': selectedIds[parseInt(row.key_id)],
            }"
          >
            <td>{{ row.key_id }}</td>
            <td>{{ row.exchange }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.public_key }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <v-alert
      color="warning"
      icon="mdi-information"
      v-if="!atLeastOneSelectedId"
    >
      You have to select at least one key to access the rest of the app
    </v-alert>
    <div v-if="status == Status.Regular" class="button-container">
      <v-btn
        @click="
          () => {
            status = Status.NewKey;
          }
        "
      >
        New Key
      </v-btn>
    </div>
    <div v-if="status == Status.NewKey" class="button-container">
      <v-btn
        @click="
          () => {
            status = Status.Regular;
          }
        "
      >
        Return
      </v-btn>
      <NewKey @new-key-refresh="() => invalidateKeysQuery()" />
    </div>
  </div>

  <div v-else>
    <v-alert color="warning" icon="mdi-information">
      Please Add a Key in order to use the app.
    </v-alert>
    <NewKey @new-key-refresh="() => invalidateKeysQuery()" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useStore } from "../store";
import { getAllKeys } from "./../api";
import NewKey from "./NewKey.vue";

const queryClient = useQueryClient();

const invalidateKeysQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["allKeys"] });
};

enum Status {
  Regular,
  NewKey,
}

const status = ref(Status.Regular);

const store = useStore();
const { toggle } = store;
const { selectedIds, atLeastOneSelectedId } = storeToRefs(store);

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

.table-container {
  margin-bottom: 1rem;
}
.button-container {
  margin-top: 1rem;
}
</style>
