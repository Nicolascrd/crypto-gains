<template>
  <div>UPLOAD</div>
  <input type="file" ref="file" />
  <button @click="upload()">upload</button>
  <div>{{ result }}</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { uploadCSV } from "../api";
import { useStore } from "./../store";
import { storeToRefs } from "pinia";

const result = ref("");
const file = ref<HTMLInputElement | null>(null);

const { id } = storeToRefs(useStore());

function upload() {
  console.log(file.value?.files?.item(0));
  if (file.value == null || file.value.files == null) {
    result.value = "Please select a csv file";
    return;
  }
  let f = file.value.files.item(0);
  if (f == null) {
    result.value = "Please select a csv file";
    return;
  }
  uploadCSV(id.value, f);
}
</script>
