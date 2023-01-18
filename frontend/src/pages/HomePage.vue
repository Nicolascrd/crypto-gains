<template>
  <div>
    <AllKeys @updateKeyId="updateKeyId" />
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AllKeys from "../components/AllKeys.vue";
import Balance from "../components/Balance.vue";
import NewKey from "../components/NewKey.vue";
import { mainStore } from "../store";
import { router, paths } from "./../router";

enum Status {
  Regular,
  NewKey,
}

const status = ref(Status.Regular);

const { changeId, id } = mainStore();

function updateKeyId(id: number) {
  changeId(id);
  router.push(paths.balance);
}

</script>

<style>

</style>