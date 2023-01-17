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
  <div class="form-container">
    <div class="form-grid">
      <label for="name">Name: </label>
      <input ref="name" id="name" name="name" type="text" />
      <label for="api_key">API Key (public): </label>
      <input ref="api_key" id="api_key" name="api_key" type="text" />
      <label for="secret_key">Secret Key (private): </label>
      <input ref="secret_key" id="secret_key" name="secret_key" type="text" />
    </div>
    <button @click="clickHandler">Submit</button>
    <div class="error-container">
      <div class="error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 20% auto;
  column-gap: 3%;
}
.form-container {
  max-width: 840px;
  position: relative;
  padding-bottom: 70px;
}
.form-container > button {
  position: absolute;
  bottom: 20px;
  right: 0;
}
label {
  font-size: 16px;
  font-weight: 600;
  padding-top: 16px;
  text-align: right;
}
input[type="text"] {
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid var(--light-green);
  border-radius: 4px;
  font-size: 16px;
}

input[type="text"]:focus {
  outline-color: var(--dark-green);
}

.error-container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
}
.error {
  text-align: center;
}
</style>
