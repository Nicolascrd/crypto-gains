import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { IKey } from "./api";

export const useStore = defineStore("main", () => {
  const selectedIds = ref({} as Record<number, boolean>);

  function toggle(id: number) {
    console.log("toggle id", id);
    selectedIds.value[id] = !selectedIds.value[id];
  }

  function updateIdsFromGet(res: IKey[]) {
    for (let i in res) {
      let key = res[i];
      let key_id = parseInt(key.key_id);
      if (!selectedIds.value.hasOwnProperty(key_id)) {
        selectedIds.value[key_id] = false;
      }
    }
  }

  const numberOfSelectedIds = computed(() => {
    let res = 0;
    for (let key in selectedIds.value) {
      if (selectedIds.value[key]) {
        res++;
      }
    }
    return res;
  });

  const atLeastOneSelectedId = computed(() => {
    return numberOfSelectedIds.value > 0;
  });

  return {
    selectedIds,
    toggle,
    numberOfSelectedIds,
    atLeastOneSelectedId,
    updateIdsFromGet,
  };
});
