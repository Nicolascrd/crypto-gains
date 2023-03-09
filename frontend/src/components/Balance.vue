<template>
  <h1>Balance</h1>
  <div v-if="isLoadingBalance">Current Balance loading..."</div>
  <div v-else-if="isErrorBalance">Error</div>
  <div>
    <v-chip-group filter multiple v-model="selectedAccounts">
      <v-chip v-for="id of arrayOfSelectedIds" :key="id">{{
        accountNames.get(id)
      }}</v-chip>
    </v-chip-group>
  </div>
  <div class="checkboxes">
    <v-checkbox
      v-model="displayStablecoins"
      label="Display Stablecoins"
    ></v-checkbox>
    <v-checkbox v-model="displayFiat" label="Display Fiat"></v-checkbox>
    <v-checkbox
      v-model="displaySmallAmounts"
      label="Display Small Amounts"
    ></v-checkbox>
  </div>
  <div v-if="selectedAccounts.length == 0">
    Please select at least one account
  </div>
  <div v-else-if="oneFailure">Error</div>
  <div v-else-if="oneLoading">Fetching latest prices...</div>
  <div v-else class="balance-container" v-if="totalSuccess && pricesData">
    <div>
      <v-table height="600" fixed-header fixed-footer density="compact">
        <thead>
          <tr>
            <th class="text-left">Asset</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Value ($)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bal, asset) in allBalances.crypto" :key="asset">
            <template v-if="displaySmallAmounts || pricesData[asset] * bal > 1">
              <td>{{ asset }}</td>
              <td>
                {{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}
              </td>
              <td>{{ decimalRound(pricesData[asset] * bal, 2) }}</td>
            </template>
          </tr>
          <tr
            v-for="(bal, asset) in allBalances.stablecoins"
            v-if="displayStablecoins"
            :key="asset"
          >
            <template v-if="displaySmallAmounts || bal > 1">
              <td>{{ asset }}</td>
              <td>{{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}</td>
              <td>{{ decimalRound(bal, 2) }}</td>
            </template>
          </tr>
          <tr
            v-for="(bal, asset) in allBalances.fiat"
            v-if="displayFiat"
            :key="asset"
          >
            <template v-if="displaySmallAmounts || bal > 1">
              <td>{{ asset }}</td>
              <td>{{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}</td>
              <td>{{ decimalRound(bal, 2) }}</td>
            </template>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>&nbsp;-</td>
            <td>{{ totalDollarValue }}</td>
          </tr>
        </tfoot>
      </v-table>
    </div>
    <div class="chart">
      <Pie :data="{ labels: labels, datasets: datasets }" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getBalance, getPrices } from "./../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";
import { options, colors } from "./chartConfig";
import { decimalRound } from "./../utils";
import { useStore } from "../store";
import { storeToRefs } from "pinia";
import { STABLECOINS, FIAT } from "./../coins";
import { useQuery } from "@tanstack/vue-query";

ChartJS.register(ArcElement, Tooltip, Legend);

const displayStablecoins = ref(false);
const displayFiat = ref(false);
const displaySmallAmounts = ref(false);
const store = useStore();
const { accountNames, arrayOfSelectedIds } = storeToRefs(store);
const __initSelectedAccounts = [];
for (let i = 0; i < arrayOfSelectedIds.value.length; i++) {
  __initSelectedAccounts.push(i);
}
const selectedAccounts = ref(__initSelectedAccounts as number[]); // 0 1 2..., NOT IDS

const {
  isLoading: isLoadingBalance,
  isError: isErrorBalance,
  data: balanceData,
  error: errorBalance,
  isSuccess: isSuccessBalance,
} = useQuery(["balance", selectedAccounts], () =>
  getBalance(selectedAccounts.value.map((val) => arrayOfSelectedIds.value[val]))
);

const balanceAvailable = computed(
  () => !isLoadingBalance.value && !isErrorBalance.value
);

const {
  isLoading: isLoadingPrices,
  data: pricesData,
  isSuccess: isSuccessPrices,
  isError: isErrorPrices,
} = useQuery(
  ["prices", balanceData],
  () => getPrices(balanceData.value?.tickers),
  {
    enabled: balanceAvailable,
  }
);

const oneFailure = computed(() => isErrorBalance.value || isErrorPrices.value);

const oneLoading = computed(
  () => isLoadingBalance.value || isLoadingPrices.value
);

const totalSuccess = computed(
  () => isSuccessBalance.value && isSuccessPrices.value
);

const allBalances = computed(() => {
  const res = {
    stablecoins: {} as Record<string, number>,
    fiat: {} as Record<string, number>,
    crypto: {} as Record<string, number>,
  };
  if (balanceData.value === undefined) {
    return res;
  }
  for (let am in balanceData.value.amounts) {
    if (FIAT.has(am)) {
      res.fiat[am] = balanceData.value.amounts[am];
    } else if (STABLECOINS.has(am)) {
      res.stablecoins[am] = balanceData.value.amounts[am];
    } else {
      res.crypto[am] = balanceData.value.amounts[am];
    }
  }
  return res;
});

const labels = computed(() => {
  const res = [] as string[];
  for (let asset in allBalances.value.crypto) {
    res.push(asset);
  }
  if (displayStablecoins.value) {
    for (let stable in allBalances.value.stablecoins) {
      res.push(stable);
    }
  }
  if (displayFiat.value) {
    for (let fiat in allBalances.value.fiat) {
      res.push(fiat);
    }
  }
  return res;
});

const graphData = computed(() => {
  const res = {
    values: [] as number[],
    colors: [] as string[],
  };
  if (pricesData.value === undefined) {
    return res;
  }
  for (let asset in allBalances.value.crypto) {
    res.values.push(allBalances.value.crypto[asset] * pricesData.value[asset]);
    res.colors.push(colors[asset]);
  }
  if (displayStablecoins.value) {
    for (let asset in allBalances.value.stablecoins) {
      res.values.push(allBalances.value.stablecoins[asset]);
      res.colors.push(colors[asset]);
    }
  }
  if (displayFiat.value) {
    for (let asset in allBalances.value.fiat) {
      res.values.push(allBalances.value.fiat[asset] * pricesData.value[asset]);
      res.colors.push(colors[asset]);
    }
  }
  return res;
});

const datasets = computed(() => {
  return [
    {
      backgroundColor: graphData.value.colors,
      data: graphData.value.values,
    },
  ];
});

const totalDollarValue = computed(() => {
  if (pricesData.value === undefined) {
    return 0;
  }
  let res = 0;
  for (let bal in allBalances.value.crypto) {
    res += allBalances.value.crypto[bal] * pricesData.value[bal];
  }
  if (displayStablecoins.value) {
    for (let stable in allBalances.value.stablecoins) {
      res += allBalances.value.stablecoins[stable];
    }
  }
  if (displayFiat.value) {
    for (let fiat in allBalances.value.fiat) {
      res += allBalances.value.fiat[fiat] * pricesData.value[fiat];
    }
  }
  return res > 1 ? decimalRound(res, 2) : res.toPrecision(3);
});
</script>

<style scoped>
.chart {
  margin-left: 50px;
  max-width: 400px;
  max-height: 500px;
}
.checkboxes {
  display: flex;
  justify-content: flex-start;
  --v-hover-opacity: 0.05;
  /* should be set but is not for some reason */
}
.balance-container {
  display: grid;
  grid-template-columns: 1fr 33%;
}
</style>
