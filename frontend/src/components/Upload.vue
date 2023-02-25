<template>
  <div class="upload-container">
    <h1>Upload Deposit / Withdrawal statements</h1>
    <v-form ref="form">
      <div class="section">
        <v-select
          v-model="account"
          label="Select an Account"
          :items="arrayOfAccounts"
          item-title="name"
          item-value="id"
          return-object
          @update:menu="updateAccountSelection()"
        ></v-select>
      </div>
      <div v-if="status >= Estatus.fileSelection && account">
        <v-alert color="info" icon="mdi-information">
          Hint : visit
          <a
            v-if="accountExchange.get(account.id) == 'Binance'"
            href="https://www.binance.com/en/my/wallet/history/deposit-crypto"
            >Binance</a
          >
          <a v-else href="https://www.kraken.com/u/history/export">Kraken</a>
          to download your withdrawal / deposits statement
        </v-alert>
      </div>
      <div v-if="status >= Estatus.fileSelection && account" class="section">
        <v-file-input
          label="Select statements"
          ref="files"
          multiple
          chips
          @update:model-value="
            (files) => files && updateFileInput(files.length)
          "
        ></v-file-input>
      </div>
      <div class="section" v-if="status >= Estatus.selected">
        <v-btn @click="upload()"
          ><v-icon icon="mdi-rocket-launch"></v-icon>&nbsp;upload</v-btn
        >
      </div>
      <div class="section" v-if="isLoading || isError || isSuccess">
        <v-alert v-if="isLoading" color="info" icon="mdi-information">
          Uploading Statements ...
        </v-alert>
        <v-alert v-else-if="isError" color="error" icon="mdi-alert-circle">
          Statement upload failed : {{ error }}
        </v-alert>
        <v-alert v-else-if="isSuccess" color="success" icon="mdi-check-circle">
          Upload Successful
        </v-alert>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Exchange, uploadCSV, INewStatement } from "../api";
import { useStore } from "./../store";
import { storeToRefs } from "pinia";
import { useMutation } from "@tanstack/vue-query";

interface IAccountSelection {
  name: string;
  id: number;
  exchange: Exchange;
}

enum Estatus {
  exchangeSelection,
  fileSelection,
  selected,
}

const form = ref<any | null>(null);
const result = ref("");
const files = ref<HTMLInputElement | null>(null);
const account = ref<{ name: string; id: number } | null>(null);
const status = ref(Estatus.exchangeSelection);
const { accountExchange, accountNames, arrayOfSelectedIds } = storeToRefs(
  useStore()
);

const {
  isLoading,
  isError,
  error,
  isSuccess,
  mutate: uploadTSQ,
} = useMutation({
  mutationFn: (s: INewStatement) => uploadCSV(s),
  onSuccess: () => {
    form.value?.reset();
    status.value = Estatus.exchangeSelection;
  },
});

const arrayOfAccounts = computed(() => {
  const res: IAccountSelection[] = [];
  arrayOfSelectedIds.value.forEach((id) => {
    const name = accountNames.value.get(id);
    const exchange = accountExchange.value.get(id);
    if (name !== undefined && exchange != undefined) {
      res.push({
        name,
        id,
        exchange,
      });
    }
  });
  return res;
});

const updateFileInput = (fileLength: number | undefined) => {
  if (fileLength == undefined) {
    return;
  }
  status.value = fileLength > 0 ? Estatus.selected : Estatus.fileSelection;
};

const updateAccountSelection = () => {
  if (account.value != null) {
    status.value = Estatus.fileSelection;
  } else {
    status.value = Estatus.exchangeSelection;
  }
  updateFileInput(files.value?.files?.length);
};

const upload = async () => {
  if (files.value == null) {
    return;
  }
  const f = files.value.files;
  if (!account.value || account.value.id == 0 || f == null) {
    return;
  }
  uploadTSQ({ id: account.value.id, files: f });
};
</script>

<style>
.upload-container {
  max-width: 800px;
}
.section {
  margin-top: 1rem;
}
</style>
