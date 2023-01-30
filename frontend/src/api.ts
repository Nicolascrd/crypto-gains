import { storeToRefs } from "pinia";
import { useStore } from "./store";

export type Exchange = "Binance" | "Kraken";

export interface INewKey {
  name: string;
  public_key: string;
  secret_key: string;
  exchange: Exchange;
}

export interface IKey {
  key_id: string;
  name: string;
  public_key: string;
  exchange: Exchange;
}

export interface IAccountBalance {
  amounts: Record<string, number>;
  tickers: Array<string>;
}

const defaultParamsGet: RequestInit = {
  method: "GET",
  mode: "cors",
  cache: "no-cache",
  redirect: "follow",
  referrerPolicy: "no-referrer",
};

const defaultParamsPost: RequestInit = {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  redirect: "follow",
  referrerPolicy: "no-referrer",
  headers: {
    "Content-Type": "application/json",
  },
};

const BackendURL = "http://localhost:3000/";

export async function getBalance(id: Number): Promise<IAccountBalance> {
  /*
  {
    prices: {
      "BNB": "xxx",
      "BTC": "xxx"
    },
    tickers: ["BTC", "BNB"]
  }
  */
  const response = await fetch(
    BackendURL + "balance?id=" + String(id),
    defaultParamsGet
  );
  if (!response.ok) {
    throw Error(
      "Cannot GET balance informations : " + String(await response.text())
    );
  }
  return response.json();
}

export async function getPrices(
  arr: Array<string>
): Promise<Record<string, number>> {
  let params = defaultParamsPost;
  params.body = JSON.stringify(arr.filter((val) => !val.includes("USD")));
  const response = await fetch(BackendURL + "prices", params);
  if (!response.ok) {
    throw Error("Cannot POST prices: " + String(await response.text()));
  }
  return response.json();
}

export async function getName(id: Number): Promise<string> {
  const response = await fetch(
    BackendURL + "name?id=" + String(id),
    defaultParamsGet
  );
  if (!response.ok) {
    throw Error("Cannot GET name : " + String(await response.text()));
  }
  return response.text();
}

export async function newKey(data: INewKey): Promise<null> {
  let params = defaultParamsPost;
  params.body = JSON.stringify(data);
  const response = await fetch(BackendURL + "add_key", params);
  if (!response.ok) {
    throw Error("Cannot add new key : " + String(await response.text()));
  }
  return null;
}

async function getAllKeysWrapped(): Promise<IKey[] | null> {
  const response = await fetch(BackendURL + "all_keys", defaultParamsGet);
  if (!response.ok) {
    throw Error("Cannot get all keys : " + String(await response.text()));
  }
  return response.json();
}

export async function getAllKeys(): Promise<IKey[] | null> {
  const res = (await getAllKeysWrapped()) as IKey[] | null;
  if (!res) {
    return null;
  }

  const { updateIdsFromGet } = useStore();

  updateIdsFromGet(res);

  return res;
}

export async function uploadCSV(id: number, file: File): Promise<string> {
  let params = defaultParamsPost;
  params.headers = {
    "Content-Type": "text/csv",
  };
  params.body = await file.text(); // body data type must match "Content-Type" header

  const response = await fetch(BackendURL + "upload?id=" + String(id), params);
  if (!response.ok) {
    throw Error("Cannot upload csv file: " + String(await response.text()));
  }
  return response.text();
}
