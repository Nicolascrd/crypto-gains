import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { Exchange, IKey } from "./api";

export const useStore = defineStore("main", () => {
  const selectedIds = ref({} as Record<number, boolean>);
  const accountNames = ref({} as Map<number, string>);
  const accountExchange = ref({} as Map<number, Exchange>);

  function toggle(id: number) {
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

    const m = new Map<number, string>();
    const mEx = new Map<number, Exchange>();

    res.forEach((value: IKey) => {
      const id = parseInt(value.key_id);
      m.set(id, value.name);
      mEx.set(id, value.exchange);
    });

    accountNames.value = m;
    accountExchange.value = mEx;
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

  const arrayOfSelectedIds = computed(() => {
    let res = [] as number[];
    for (let key in selectedIds.value) {
      if (selectedIds.value[key]) {
        res.push(parseInt(key));
      }
    }
    return res;
  });

  const atLeastOneSelectedId = computed(() => {
    return numberOfSelectedIds.value > 0;
  });

  return {
    selectedIds,
    accountNames,
    accountExchange,
    arrayOfSelectedIds,
    toggle,
    numberOfSelectedIds,
    atLeastOneSelectedId,
    updateIdsFromGet,
  };
});
