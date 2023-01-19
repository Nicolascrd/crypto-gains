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
import { ref, onMounted } from "vue";
import AllKeys from "../components/AllKeys.vue";
import NewKey from "../components/NewKey.vue";
import { useStore } from "../store";
import { router, paths } from "./../router";

enum Status {
  Regular,
  NewKey,
}

const status = ref(Status.Regular);

const store = useStore();
const { changeId } = store;

onMounted(() => {
  changeId(0);
});

function updateKeyId(num: number) {
  changeId(num);
  router.push(paths.balance);
}
</script>

<style></style>
