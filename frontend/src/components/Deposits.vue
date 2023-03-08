<template>
  <h3>DEPOSITS</h3>
  <v-tabs v-model="tab" color="bg-blue-darken-3" align-tabs="center">
    <v-tab :value="1">FIAT</v-tab>
    <v-tab :value="2">CRYPTO</v-tab>
  </v-tabs>
  <div class="date-picker">
    <VueDatePicker
      v-model="date"
      range
      :partial-range="false"
      :enable-time-picker="false"
      :max-date="new Date()"
      utc="preserve"
    ></VueDatePicker>
  </div>
  <template v-if="unixdateRange">
    <ActivityGraph :crypto="tab == 2" :dateRange="unixdateRange"></ActivityGraph>
  </template>
  <template v-if="unixdateRange">
    <Movements :crypto="tab == 2" :dateRange="unixdateRange" />
  </template>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Movements from "./Movements.vue";
import ActivityGraph from "./ActivityGraph.vue"
import { dateStringToUTCDayStartEpoch } from "./../utils";
const date = ref<null | string[]>(null);

const unixdateRange = computed(() => {
  if (date.value == null) {
    return null;
  }
  return [
    dateStringToUTCDayStartEpoch(date.value[0]),
    dateStringToUTCDayStartEpoch(date.value[1]),
  ];
});

const tab = ref<number | null>(null);
</script>

<style>
.date-picker {
  max-width: 260px;
}
</style>
