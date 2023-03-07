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

export interface INewStatement {
  id: number;
  files: FileList;
}

export type Timeframe = "D" | "W" | "M" | "Y";

export interface IMovementsRequest {
  ids: number[];
  start: number;
  end: number;
  timeframe: Timeframe;
  crypto: boolean;
}

export interface IMovementsAggRequest {
  ids: number[];
  start: number;
  end: number;
  crypto: boolean;
}

export interface IPlusMinus {
  "+": number;
  "-": number;
}

export interface IdwFormatted {
  assets: Record<string, IPlusMinus>;
  start: number;
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

export async function getBalance(ids: number[]): Promise<IAccountBalance> {
  /*
  {
    prices: {
      "BNB": "xxx",
      "BTC": "xxx"
    },
    tickers: ["BTC", "BNB"]
  }
  */
  const params = defaultParamsPost;
  params.body = JSON.stringify(ids);
  const response = await fetch(BackendURL + "balance", params);
  if (!response.ok) {
    throw Error(
      "Cannot POST balance informations : " + String(await response.text())
    );
  }
  return response.json();
}

export async function getPrices(
  arr: Array<string> | undefined
): Promise<Record<string, number>> {
  if (arr === undefined) {
    throw Error("Array of tickers is undefined");
  }
  const params = defaultParamsPost;
  params.body = JSON.stringify(arr.filter((val) => !val.includes("USD")));
  const response = await fetch(BackendURL + "prices", params);
  if (!response.ok) {
    throw Error("Cannot POST prices: " + String(await response.text()));
  }
  return response.json();
}

export async function getName(id: number): Promise<string> {
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
  const params = defaultParamsPost;
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

export async function getMovements(
  data: IMovementsRequest
): Promise<IdwFormatted[]> {
  const params = defaultParamsPost;
  params.body = JSON.stringify(data);
  const response = await fetch(BackendURL + "movements", params);
  if (!response.ok) {
    throw Error("Cannot get movements : " + String(await response.text()));
  }
  return response.json();
}

export async function getMovementsAgg(
  data: IMovementsAggRequest
): Promise<Record<string, IPlusMinus>> {
  const params = defaultParamsPost;
  params.body = JSON.stringify(data);
  const response = await fetch(BackendURL + "movementsAgg", params);
  if (!response.ok) {
    throw Error("Cannot get movementsAgg : " + String(await response.text()));
  }
  return response.json();
}

export async function uploadCSV(s: INewStatement): Promise<null> {
  const params = defaultParamsPost;
  params.headers = {
    "Content-Type": "text/csv",
  };

  const promises = [];
  for (let i = 0; i < s.files.length; i++) {
    const f = s.files.item(i);
    if (f !== null) {
      params.body = await f.text();
    }
    promises.push(fetch(BackendURL + "upload?id=" + String(s.id), params));
  }
  await Promise.all(promises).then(
    (responses) => {
      responses.forEach(async (resp, index) => {
        if (!resp.ok) {
          throw Error(`Cannot upload file n°${index} : ${await resp.text()}`);
        }
      });
    },
    (reason) => {
      throw reason;
    }
  );
  return null;
}
