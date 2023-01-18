import { defineStore } from "pinia";
import { ref } from "vue";

export const mainStore = defineStore("main", () => {
  const id = ref(0);

  function changeId(newId: number) {
    id.value = newId;
  }

  return { id, changeId };
});
