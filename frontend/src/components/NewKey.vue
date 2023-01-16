<script setup lang="ts">
import { ref } from "vue";
import { newKey, INewKey } from "../api";

const name = ref<HTMLInputElement | null>(null);
const api_key = ref<HTMLInputElement | null>(null);
const secret_key = ref<HTMLInputElement | null>(null);
const errorMessage = ref<String>("");

function clickHandler() {
  if (name.value == undefined) {
    return;
  }
  if (api_key.value == undefined) {
    return;
  }
  if (secret_key.value == undefined) {
    return;
  }
  const data: INewKey = {
    name: name.value?.value,
    public_key: api_key.value?.value,
    secret_key: secret_key.value?.value,
  };
  newKey(data).catch((err) => {
    console.error("Insert failed: " + err);
    errorMessage.value = "Insert Failed: " + err;
  });
}
</script>

<template>
  <div>
    <label for="name">Name: </label>
    <input ref="name" id="name" name="name" type="text" /> <br />
    <label for="api_key">API Key (public): </label
    ><input ref="api_key" id="api_key" name="api_key" type="text" /><br />
    <label for="secret_key">Secret Key (private): </label
    ><input ref="secret_key" id="secret_key" name="secret_key" type="text" />
  </div>
  <div>
    <button @click="clickHandler">Submit</button>
  </div>
  <div class="error">
    {{ errorMessage }}
  </div>
</template>

<style scoped></style>
