<template>
  <h1 v-if="isLoadingName">Current Balance : Name Loading..."</h1>
  <h1 v-else-if="isErrorName">Current Balance : cannot get Name</h1>
  <h1 v-else-if="isSuccessName">Current Balance : {{ name }}</h1>
  <div>
    <label>
      Display Stablecoins:
      <input type="checkbox" v-model="displayStablecoins" />
    </label>
    <label>
      Display Fiat:
      <input type="checkbox" v-model="displayFiat" />
    </label>
  </div>
  <div v-if="oneFailure">Error</div>
  <div v-else-if="oneLoading">Loading...</div>
  <div v-else class="balance-container" v-if="totalSuccess && pricesData">
    <div>
      <table>
        <thead>
          <th>Asset</th>
          <th>Amount</th>
          <th>Value ($)</th>
        </thead>
        <tr v-for="(bal, asset) in allBalances.crypto" :key="asset">
          <td>{{ asset }}</td>
          <td>
            {{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}
          </td>
          <td>{{ decimalRound(pricesData[asset] * bal, 2) }}</td>
        </tr>
        <tr
          v-for="(bal, asset) in allBalances.stablecoins"
          v-if="displayStablecoins"
          :key="asset"
        >
          <td>{{ asset }}</td>
          <td>{{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}</td>
          <td>{{ decimalRound(bal, 2) }}</td>
        </tr>
        <tr
          v-for="(bal, asset) in allBalances.fiat"
          v-if="displayFiat"
          :key="asset"
        >
          <td>{{ asset }}</td>
          <td>{{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}</td>
          <td>{{ decimalRound(bal, 2) }}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>-</td>
          <td>{{ totalDollarValue }}</td>
        </tr>
      </table>
    </div>
    <div class="chart">
      <Pie :data="{ labels: labels, datasets: datasets }" :options="options" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getBalance, getName, getPrices } from "./../api";
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
const displayFiat = ref(true);
const store = useStore();
const { selectedIds } = storeToRefs(store);

const id = computed(() => {
  // TEMPORARY
  for (let id in selectedIds.value) {
    if (selectedIds.value[id]) {
      return parseInt(id);
    }
  }
  return 0;
});

const {
  isLoading: isLoadingBalance,
  isError: isErrorBalance,
  data: balanceData,
  error: errorBalance,
  isSuccess: isSuccessBalance,
} = useQuery(["balance", id.value], () => getBalance(id.value));

const balanceAvailable = computed(
  () => !isLoadingBalance.value && !isErrorBalance.value
);

const {
  isLoading: isLoadingPrices,
  data: pricesData,
  isSuccess: isSuccessPrices,
  isError: isErrorPrices,
} = useQuery(["prices"], () => getPrices(balanceData.value?.tickers), {
  enabled: balanceAvailable,
});

const {
  isLoading: isLoadingName,
  data: name,
  isSuccess: isSuccessName,
  isError: isErrorName,
} = useQuery(["name", id.value], () => getName(id.value), {
  enabled: balanceAvailable,
});

const oneFailure = computed(
  () => isErrorBalance.value || isErrorName.value || isErrorPrices.value
);

const oneLoading = computed(
  () => isLoadingBalance.value || isLoadingName.value || isLoadingPrices.value
);

const totalSuccess = computed(
  () => isSuccessBalance.value && isSuccessPrices.value && isSuccessName.value
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
      res.values.push(
        allBalances.value.stablecoins[asset]
      );
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
  return res;
});
</script>

<style scoped>
/* The switch - the box around the sl er */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--light-green);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--light-green);
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.balance-container {
  display: flex;
}
.chart {
  /*max-width: 500px;*/
  margin-left: 50px;
}
</style>
