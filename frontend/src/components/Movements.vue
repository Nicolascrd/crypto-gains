<template>
  <div>Deposits</div>
  <v-table fixed-header density="compact">
    <thead>
      <tr>
        <th class="text-left">Asset</th>
        <th class="text-left">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(amount, ticker) in totalDepositedAndWithdrawn.deposit"
        :key="ticker"
      >
        <td>{{ ticker }}</td>
        <td>
          {{ amount > 1 ? decimalRound(amount, 2) : amount.toPrecision(3) }}
        </td>
      </tr>
    </tbody>
  </v-table>
  <div>Withdrawals</div>
  <v-table fixed-header density="compact">
    <thead>
      <tr>
        <th class="text-left">Asset</th>
        <th class="text-left">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(amount, ticker) in totalDepositedAndWithdrawn.withdrawn"
        :key="ticker"
      >
        <td>{{ ticker }}</td>
        <td>
          {{ amount > 1 ? decimalRound(amount, 2) : amount.toPrecision(3) }}
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getMovementsAgg, IPlusMinus } from "../api";
import { useStore } from "../store";
import { storeToRefs } from "pinia";
import { decimalRound } from "../utils";

const { arrayOfSelectedIds } = storeToRefs(useStore());

const queryClient = useQueryClient();

const invalidateDWQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["movementsAgg"] });
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

const {
  isLoading,
  data: aggMovementsData,
  isSuccess,
  isError,
} = useQuery(
  ["movementsAgg", props.crypto, props.dateRange, arrayOfSelectedIds.value],
  () =>
    getMovementsAgg({
      ids: arrayOfSelectedIds.value,
      start: props.dateRange[0],
      end: props.dateRange[1],
      crypto: props.crypto,
    })
);

const totalDepositedAndWithdrawn = computed(() => {
  const res = {
    deposit: {} as Record<string, number>,
    withdrawn: {} as Record<string, number>,
  };
  for (const t in aggMovementsData.value) {
    if (aggMovementsData.value[t]["+"] > 0) {
      res.deposit[t] = aggMovementsData.value[t]["+"];
    }
    if (aggMovementsData.value[t]["-"] < 0) {
      res.withdrawn[t] = -aggMovementsData.value[t]["-"];
    }
  }
  return res;
});
</script>
