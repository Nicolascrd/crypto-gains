<template>
  <div class="form-container">
    <h3>New Key :</h3>
    <v-form class="form" ref="form">
      <v-select
        v-model="exchangeName"
        label="Exchange"
        :items="['Binance', 'Kraken']"
        :rules="rulesSelectInput"
        @update:menu="
          () => {
            formHandlingMessage = '';
          }
        "
      ></v-select>
      <v-text-field
        ref="name"
        class="input-field"
        label="Key Name"
        :rules="rulesTextInput"
        hide-details="auto"
        hint="You can give any name to your key"
        variant="outlined"
        @update:focused="
          () => {
            formHandlingMessage = '';
          }
        "
      ></v-text-field>

      <v-text-field
        ref="api_key"
        class="input-field"
        label="API Key (public)"
        hint="Make sure your key has read-only rights"
        :rules="rulesTextInput"
        hide-details="auto"
        variant="outlined"
        @update:focused="
          () => {
            formHandlingMessage = '';
          }
        "
      ></v-text-field>

      <v-text-field
        ref="secret_key"
        class="input-field"
        label="Secret Key (private)"
        :rules="rulesTextInput"
        hide-details="auto"
        variant="outlined"
        type="password"
        @update:focused="
          () => {
            formHandlingMessage = '';
          }
        "
      ></v-text-field>
    </v-form>
    <div class="validation">
      <v-btn @click="clickHandler" color="grey-darken-4">Submit</v-btn>
      <v-alert v-if="isError" color="error" icon="mdi-alert-circle">
        {{ error }}
      </v-alert>
      <v-alert v-else-if="isLoading" color="info" icon="mdi-loading">
        Loading ...
      </v-alert>
      <v-alert v-else-if="isSuccess" color="success" icon="mdi-check-circle">
        Success !
      </v-alert>
      <v-alert
        v-else-if="formHandlingMessage != ''"
        color="error"
        icon="mdi-alert-circle"
      >
        {{ formHandlingMessage }}
      </v-alert>
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
const form = ref<any | null>(null);
const formHandlingMessage = ref("");
const exchangeName = ref("");

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
    emits("newKeyRefresh");
    form.value?.reset();
  },
});

const rulesTextInput = [(value: string) => (value.length ? true : "Required.")];
const rulesSelectInput = [
  (value: string) =>
    ["Kraken", "Binance"].includes(value) || "Must select one exchange",
];

function clickHandler() {
  formHandlingMessage.value = "";
  if (!exchangeName.value || exchangeName.value == "") {
    formHandlingMessage.value = "Please select an Exchange";
    return;
  }
  if (!name.value || name.value?.value == "") {
    formHandlingMessage.value = "Please enter a Key Name";
    return;
  }
  if (!api_key.value || api_key.value?.value == "") {
    formHandlingMessage.value = "Please enter the API Key";
    return;
  }
  if (!secret_key.value || secret_key.value?.value == "") {
    formHandlingMessage.value = "Please enter the Secret Key";
    return;
  }
  const data: INewKey = {
    name: name.value?.value,
    public_key: api_key.value?.value,
    secret_key: secret_key.value?.value,
    exchange: exchangeName.value as Exchange,
  };
  addNewKey(data);
}
</script>

<style scoped>
.form > .input-field {
  margin-bottom: 1rem;
}
.form-container {
  margin-top: 1rem;
  max-width: 800px;
}
.form-container > h3 {
  margin-bottom: 0.5rem;
}
.validation > * {
  margin-bottom: 1rem;
}
</style>
