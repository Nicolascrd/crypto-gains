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
    <NewKey />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AllKeys from "../components/AllKeys.vue";
import NewKey from "../components/NewKey.vue";

enum Status {
  Regular,
  NewKey,
}

const status = ref(Status.Regular);
</script>
