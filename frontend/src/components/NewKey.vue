<template>
  <div class="form-container">
    <div class="form-grid">
      <label>Exchange: </label>
      <div class="wrapper">
        <input ref="binance" id="binance" name="exchange" type="radio" />
        <input ref="kraken" id="kraken" name="exchange" type="radio" />
        <label for="binance" class="option binance">Binance</label>
        <label for="kraken" class="option kraken">Kraken</label>
      </div>
      <label for="name">Name: </label>
      <input ref="name" id="name" name="name" type="text" />
      <label for="api_key">API Key (public): </label>
      <input ref="api_key" id="api_key" name="api_key" type="text" />
      <label for="secret_key">Secret Key (private): </label>
      <input ref="secret_key" id="secret_key" name="secret_key" type="text" />
    </div>
    <button @click="clickHandler">Submit</button>
    <div class="error-container">
      <div v-if="isError" class="error">
        {{ error }}
      </div>
      <div v-else-if="isLoading">Loading ...</div>
      <div v-else-if="isSuccess">Success !</div>
      <div v-else-if="message != ''">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { newKey, INewKey, Exchange } from "../api";
import { useMutation } from "@tanstack/vue-query";

const name = ref<HTMLInputElement | null>(null);
const api_key = ref<HTMLInputElement | null>(null);
const secret_key = ref<HTMLInputElement | null>(null);
const binance = ref<HTMLInputElement | null>(null);
const kraken = ref<HTMLInputElement | null>(null);
const message = ref("");

const emits = defineEmits(["newKeyRefresh"]);

const {
  isLoading,
  isError,
  error,
  isSuccess,
  mutate: addNewKey,
} = useMutation({
  mutationFn: (k: INewKey) => newKey(k),
  onSuccess: (data, variables, context) => {
    // Boom baby!
    emits("newKeyRefresh");
  },
});

function clickHandler() {
  message.value = "";
  if (!name.value || name.value?.value == "") {
    message.value = "Please enter a name";
    return;
  }
  if (!api_key.value || api_key.value?.value == "") {
    message.value = "Please enter the API Key";
    return;
  }
  if (!secret_key.value || secret_key.value?.value == "") {
    message.value = "Please enter the secret Key";
    return;
  }
  if (!kraken.value?.checked && !binance.value?.checked) {
    message.value = "Please select an exchange";
    return;
  }
  let exchange: Exchange = "Binance";
  if (kraken.value?.checked) {
    exchange = "Kraken";
  }
  const data: INewKey = {
    name: name.value?.value,
    public_key: api_key.value?.value,
    secret_key: secret_key.value?.value,
    exchange: exchange,
  };
  addNewKey(data);
}
</script>

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

input[type="radio"] {
  display: none;
}
.wrapper {
  display: inline-flex;
  background: #fff;
  align-items: center;
  height: 80px;
  justify-content: space-evenly;
  border-radius: 5px;
  padding: 20px 15px;
}
.wrapper .option {
  background: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 0 10px;
  border-radius: 5px;
  cursor: pointer;
  padding: 0 10px;
  border: 2px solid lightgrey;
  transition: all 0.3s ease;
}

#binance:checked:checked ~ .binance {
  border-color: var(--binance-yellow);
  background: var(--binance-yellow);
}
#kraken:checked:checked ~ .kraken {
  border-color: var(--kraken-blue);
  background: var(--kraken-blue);
  color: white;
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
  text-align: center;
}
.error {
  color: darkred;
}
</style>
