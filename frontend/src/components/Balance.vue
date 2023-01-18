<template>
  <button @click="$emit('return')">RETURN</button>
  <div>Current Balance : {{ accountName }}</div>
  <div>
    <div v-for="(bal, asset) in balance">{{ asset }} ---- {{ bal }}</div>
  </div>
  <div class="chart">
    <Pie :data="{ labels: labels, datasets: datasets }" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { getBalance, getName, getPrices } from "./../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "vue-chartjs";
import { options, colors } from "./chartConfig";

ChartJS.register(ArcElement, Tooltip, Legend);

defineEmits(["return"]);

const balance = ref({} as Record<string, number>);
const prices = ref({} as Record<string, number>);
const stablecoinsBalance = ref({} as Record<string, number>);
const accountName = ref("");

const { id } = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  const data = await getBalance(id);
  const stablecoins = {} as Record<string, number>;
  for (let am in data.amounts) {
    if (am.includes("USD")) {
      stablecoins[am] = data.amounts[am];
      delete data.amounts[am];
    }
  }

  const allPrices = await getPrices(data.tickers);
  const name = await getName(id);

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
  for (let stable in stablecoinsBalance.value) {
    res.push(stable);
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
  for (let stable in stablecoinsBalance.value) {
    res.values.push(stablecoinsBalance.value[stable]);
    res.colors.push(colors[stable]);
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
</script>

<style scoped></style>
