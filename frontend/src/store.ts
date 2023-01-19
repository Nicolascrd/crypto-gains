import { defineStore } from "pinia";
import { ref } from "vue";

export const useStore = defineStore("main", () => {
  const id = ref(0);

  function changeId(newId: number) {
    console.log("change id", newId);
    id.value = newId;
  }

  return { id, changeId };
});
