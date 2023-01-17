export interface INewKey {
  name: string;
  public_key: string;
  secret_key: string;
}

export interface IKey {
  key_id: string;
  name: string;
  public_key: string;
}

export async function getBalance(id: Number): Promise<{}> {
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
