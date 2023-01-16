export interface INewKey {
  name: string;
  public_key: string;
  secret_key: string;
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
