<template>
  <AllKeys />
  <div v-if="status == Status.Regular">
    <button
      @click="
        () => {
          status = Status.NewKey;
        }
      "
    >
      New Key
    </button>
  </div>
  <div v-if="status == Status.NewKey">
    <button
      @click="
        () => {
          status = Status.Regular;
        }
      "
    >
      Return
    </button>
    <NewKey @new-key-refresh="() => invalidateKeysQuery()" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import AllKeys from "../components/AllKeys.vue";
import NewKey from "../components/NewKey.vue";
const queryClient = useQueryClient();

const invalidateKeysQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["allKeys"] });
};
enum Status {
  Regular,
  NewKey,
}

const status = ref(Status.Regular);
</script>
