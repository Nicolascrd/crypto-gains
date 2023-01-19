<template>
  <h1>Current Balance : {{ accountName }}</h1>
  <div>
    Display Stablecoins:
    <label class="switch">
      <input type="checkbox" v-model="displayStablecoins" />
      <span class="slider round"></span>
    </label>
  </div>
  <div class="balance-container">
    <div>
      <table>
        <thead>
          <th>Asset</th>
          <th>Amount</th>
          <th>Value ($)</th>
        </thead>
        <tr v-for="(bal, asset) in balance">
          <td>{{ asset }}</td>
          <td>{{ bal > 1 ? decimalRound(bal, 2) : bal.toPrecision(3) }}</td>
          <td>{{ decimalRound(prices[asset] * bal, 2) }}</td>
        </tr>
        <tr
          v-for="(bal, asset) in stablecoinsBalance"
          v-if="displayStablecoins"
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
import { onMounted, ref, computed } from "vue";
import { getBalance, getName, getPrices } from "./../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";
import { options, colors } from "./chartConfig";
import { decimalRound } from "./../utils";
import { useStore } from "../store";
import { storeToRefs } from "pinia";

ChartJS.register(ArcElement, Tooltip, Legend);

const balance = ref({} as Record<string, number>);
const prices = ref({} as Record<string, number>);
const stablecoinsBalance = ref({} as Record<string, number>);
const accountName = ref("");
const displayStablecoins = ref(false);
const store = useStore();
const { id } = storeToRefs(store);

onMounted(async () => {
  const data = await getBalance(id.value);
  const stablecoins = {} as Record<string, number>;
  for (let am in data.amounts) {
    if (am.includes("USD")) {
      stablecoins[am] = data.amounts[am];
      delete data.amounts[am];
    }
  }

  const allPrices = await getPrices(data.tickers);
  const name = await getName(id.value);

  if (data) {
    balance.value = data.amounts;
  }
  if (name) {
    accountName.value = name;
  }
  if (allPrices) {
    prices.value = allPrices;
  }
  if (stablecoins) {
    stablecoinsBalance.value = stablecoins;
  }
});

const labels = computed(() => {
  const res = [] as string[];
  for (let asset in balance.value) {
    res.push(asset);
  }
  if (displayStablecoins.value) {
    for (let stable in stablecoinsBalance.value) {
      res.push(stable);
    }
  }
  return res;
});

const data = computed(() => {
  const res = {
    values: [] as number[],
    colors: [] as string[],
  };
  for (let asset in balance.value) {
    res.values.push(balance.value[asset] * prices.value[asset]);
    res.colors.push(colors[asset]);
  }
  if (displayStablecoins.value) {
    for (let stable in stablecoinsBalance.value) {
      res.values.push(stablecoinsBalance.value[stable]);
      res.colors.push(colors[stable]);
    }
  }
  return res;
});

const datasets = computed(() => {
  return [
    {
      backgroundColor: data.value.colors,
      data: data.value.values,
    },
  ];
});

const totalDollarValue = computed(() => {
  let res = 0;
  console.log("prices, balance", prices.value, balance.value);
  for (let bal in balance.value) {
    res += balance.value[bal] * prices.value[bal];
  }
  if (displayStablecoins.value) {
    for (let stable in stablecoinsBalance.value) {
      res += stablecoinsBalance.value[stable];
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
