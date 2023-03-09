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
    <Line :data="volumeData" :options="options" id="line" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getMovements, getPrices, Timeframe } from "../api";
import { decimalRoundWrapper } from "../utils";
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
  InteractionMode,
} from "chart.js";
import { Line } from "vue-chartjs";
import { STABLECOINS } from "../coins";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  ArcElement,
  Tooltip,
  LineElement,
  Tooltip
);
const getOrCreateTooltip = (chart: ChartJS) => {
  let tooltipEl = chart.canvas.parentNode?.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = "1";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode?.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: any) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const indexInData = tooltip.dataPoints[0].dataIndex;

    const bodyLines = [] as Array<string>;
    if (movementsData.value) {
      for (let asset in movementsData.value[indexInData].assets) {
        bodyLines.push(asset);

        bodyLines.push(
          "+ : " +
            decimalRoundWrapper(
              movementsData.value[indexInData].assets[asset]["+"]
            )
        );

        bodyLines.push(
          "- : " +
            decimalRoundWrapper(
              -movementsData.value[indexInData].assets[asset]["-"]
            )
        );
      }
    }

    const tableHead = document.createElement("thead");

    titleLines.forEach((title: string) => {
      const tr = document.createElement("tr");

      const th = document.createElement("th");
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement("tbody");
    bodyLines.forEach((body: string, i: number) => {
      const span = document.createElement("span");
      span.style.borderWidth = "2px";
      span.style.marginRight = "10px";
      span.style.height = "10px";
      span.style.width = "10px";
      span.style.display = "inline-block";

      const tr = document.createElement("tr");
      tr.style.backgroundColor = "inherit";

      const td = document.createElement("td");

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot?.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot?.appendChild(tableHead);
    tableRoot?.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = "1";
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + 30 + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding =
    tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: "index" as InteractionMode,
  },
  plugins: {
    legend: { display: true },
    tooltip: {
      enabled: false,
      external: externalTooltipHandler,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Time",
      },
    },
    y: {
      title: {
        display: true,
        text: "Total Volume (USD Equivalent, current price)",
      },
    },
  },
};

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

<style>
.chart {
  height: 600px;
}
</style>
