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
    "http://localhost:3000/balance?id=" + String(id),
    {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    }
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
  const response = await fetch("http://localhost:3000/prices", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(arr.filter((val) => !val.includes("USD"))),
  });
  if (!response.ok) {
    throw Error("Cannot POST prices: " + String(await response.text()));
  }
  return response.json();
}

export async function getName(id: Number): Promise<string> {
  const response = await fetch("http://localhost:3000/name?id=" + String(id), {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  if (!response.ok) {
    throw Error("Cannot GET name : " + String(await response.text()));
  }
  return response.text();
}

export async function newKey(data: INewKey): Promise<null> {
  const response = await fetch("http://localhost:3000/add_key", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  if (!response.ok) {
    throw Error("Cannot add new key : " + String(await response.text()));
  }
  return null;
}

export async function getAllKeys(): Promise<IKey[] | null> {
  const response = await fetch("http://localhost:3000/all_keys", {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  if (!response.ok) {
    throw Error("Cannot get all keys : " + String(await response.text()));
  }
  return response.json();
}

export async function uploadCSV(id: number, file: File): Promise<string> {
  const response = await fetch(
    "http://localhost:3000/upload?id=" + String(id),
    {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      redirect: "follow",
      headers: {
        "Content-Type": "text/csv",
      },
      referrerPolicy: "no-referrer",
      body: await file.text(), // body data type must match "Content-Type" header
    }
  );
  if (!response.ok) {
    throw Error("Cannot upload csv file: " + String(await response.text()));
  }
  return response.text();
}
