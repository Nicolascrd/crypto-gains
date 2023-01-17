<script setup lang="ts">
import { onMounted, ref } from "vue";
import AllKeys from "./components/AllKeys.vue";
import Balance from "./components/Balance.vue";
import NewKey from "./components/NewKey.vue";

enum Status {
  Regular,
  NewKey,
}

const keyId = ref(0); // unset
const status = ref(Status.Regular);

function updateKeyId(id: number) {
  keyId.value = id;
}

function returnStart() {
  updateKeyId(0);
  status.value = Status.Regular;
}
</script>

<template>
  <div v-if="keyId > 0">
    <Balance :id="keyId" @return="returnStart()" />
  </div>
  <div v-else>
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

<style scoped></style>
