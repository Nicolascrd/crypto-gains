<template>
  <h3>Activity</h3>
  <v-select
    label="Timeframe"
    :items="availableTimeframes"
    v-model="timeframe"
    item-title="complete"
    item-value="abv"
    return-object
  ></v-select>
  <div class="chart" v-if="volumeData">
    <Line :data="volumeData" :option="options" id="line" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getMovements, getPrices, Timeframe } from "../api";
import { useStore } from "../store";
import { storeToRefs } from "pinia";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "vue-chartjs";
import { options } from "./chartConfig";
import { STABLECOINS } from "../coins";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  ArcElement,
  Tooltip,
  LineElement
);

const { arrayOfSelectedIds } = storeToRefs(useStore());

const queryClient = useQueryClient();

const invalidateDWQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["movements"] });
};
const invalidatePricesQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["prices"] });
};

const props = defineProps({
  crypto: {
    required: true,
    type: Boolean,
  },
  dateRange: {
    required: true,
    type: Array<number>, // UNIX time
  },
});

const timeframe = ref({
  complete: "Monthly",
  abv: "M",
} as { complete: String; abv: Timeframe });

const availableTimeframes = ref([
  {
    complete: "Daily",
    abv: "D",
  },
  {
    complete: "Weekly",
    abv: "W",
  },
  {
    complete: "Monthly",
    abv: "M",
  },
  {
    complete: "Yearly",
    abv: "Y",
  },
] as Array<{ complete: String; abv: Timeframe }>);

watch(
  () => props.crypto,
  () => {
    invalidateDWQuery();
  }
);
watch(
  () => props.dateRange[0],
  () => {
    invalidateDWQuery();
  }
);
watch(
  () => props.dateRange[1],
  () => {
    invalidateDWQuery();
  }
);

watch(
  () => timeframe.value.abv,
  () => {
    invalidateDWQuery();
  }
);

const {
  isLoading,
  data: movementsData,
  isSuccess,
  isError,
} = useQuery(
  ["movements", props.crypto, props.dateRange, arrayOfSelectedIds.value],
  () =>
    getMovements({
      ids: arrayOfSelectedIds.value,
      start: props.dateRange[0],
      end: props.dateRange[1],
      crypto: props.crypto,
      timeframe: timeframe.value.abv,
    })
);
const arrayOfTickers = computed(() => {
  const res: Array<string> = [];
  if (movementsData.value == null) {
    return res;
  }
  const s = new Set<String>();
  for (let i = 0; i < movementsData.value.length; i++) {
    let keys = Object.keys(movementsData.value[i].assets);
    for (let k of keys) {
      if (!s.has(k)) {
        res.push(k);
        s.add(k);
      }
    }
  }
  return res;
});
watch(arrayOfTickers, () => {
  invalidatePricesQuery();
});
const tickersAvailable = computed(() => {
  return isSuccess && arrayOfTickers.value.length > 0;
});

const {
  isLoading: isLoadingPrices,
  data: pricesData,
  isSuccess: isSuccessPrices,
  isError: isErrorPrices,
} = useQuery(
  ["prices", arrayOfTickers.value],
  () => getPrices(arrayOfTickers.value),
  {
    enabled: tickersAvailable,
  }
);

const labels = computed(() => {
  if (movementsData.value == null) {
    return [];
  }
  return movementsData.value.map((value) => {
    switch (timeframe.value.abv) {
      case "D":
        return new Date(value.start).toDateString();
      case "W":
        return new Date(value.start).toDateString();
      case "M":
        let d = new Date(value.start);
        return (
          d.getUTCFullYear() +
          "-" +
          (d.getUTCMonth() + 1 < 10
            ? "0" + (d.getUTCMonth() + 1)
            : d.getUTCMonth() + 1)
        );
      case "Y":
        return new Date(value.start).getUTCFullYear();
    }
    return "";
  });
});

const volumeData = computed(() => {
  // compute data
  if (!movementsData.value || !pricesData.value) {
    return null;
  }
  let volumeDeposit = [];
  let volumeWithdrawal = [];
  for (let i = 0; i < movementsData.value?.length; i++) {
    let usdDepositVolume = 0;
    let usdWithdrawalVolume = 0;
    for (let asset in movementsData.value[i].assets) {
      if (STABLECOINS.has(asset)) {
        usdDepositVolume += movementsData.value[i].assets[asset]["+"];
        usdWithdrawalVolume -= movementsData.value[i].assets[asset]["-"];
        continue;
      }
      usdDepositVolume +=
        movementsData.value[i].assets[asset]["+"] * pricesData.value[asset];
      usdWithdrawalVolume -=
        movementsData.value[i].assets[asset]["-"] * pricesData.value[asset];
    }
    volumeDeposit.push(usdDepositVolume);
    volumeWithdrawal.push(usdWithdrawalVolume);
  }
  return {
    labels: labels.value,
    datasets: [
      {
        label: "Deposits",
        data: volumeDeposit,
        fill: false,
        borderColor: "rgb(21, 158, 44)",
        tension: 0.1,
      },
      {
        label: "Withdrawals",
        data: volumeWithdrawal,
        fill: false,
        borderColor: "rgb(192,75,90)",
        tension: 0.1,
      },
    ],
  };
});
</script>
