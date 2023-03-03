import { PrismaClient } from "@prisma/client";
import { params } from "../params/exchangeSpecifics.js";

const prisma = new PrismaClient();

export type Exchange = "Kraken" | "Binance";

export interface INewKey {
  exchange: Exchange;
  name: string;
  public_key: string;
  secret_key: string;
}

export interface IDepositRecord {
  key_id: number;
  utc_time: number;
  asset: string;
  change: number;
}
export interface IReadKey {
  key_id: number;
  exchange: string;
  name: string;
  public_key: string;
}
export const insertInto = async (newKey: INewKey) => {
  await prisma.keys.create({
    data: newKey,
  });
  console.log("New row inserted in DB, name = ", newKey.name);
};

export const getNameFromId = async (id: number) => {
  // const db = await newDbConnector();

  return prisma.keys
    .findUnique({
      where: {
        key_id: id,
      },
      select: {
        name: true,
      },
    })
    .catch((e) => {
      throw e;
    })
    .then((value) => {
      if (value == null) {
        throw Error("No key corresponding to key id " + String(id));
      } else {
        return value.name;
      }
    });
};

export const getExchange = async (id: number) => {
  return prisma.keys
    .findUnique({
      where: {
        key_id: id,
      },
      select: {
        exchange: true,
      },
    })
    .catch((e) => {
      throw e;
    })
    .then((value) => {
      if (value == null) {
        throw Error("No key corresponding to key id " + String(id));
      } else {
        return value.exchange;
      }
    });
};

export const allKeys = async () => {
  return await prisma.keys.findMany();
};

export interface IPublicAndSecretKey {
  public_key: string;
  secret_key: string;
}

export const publicAndSecretKey = async (id: number) => {
  return await prisma.keys
    .findUnique({
      where: {
        key_id: id,
      },
      select: {
        secret_key: true,
        public_key: true,
      },
    })
    .catch((reason) => {
      throw reason;
    })
    .then((value) => {
      if (value == null) {
        throw Error("no keys corresponding to key_id " + String(id));
      }
      return value;
    });
};

export const addRecords = async (recordsArr: IDepositRecord[]) => {
  // const db = await newDbConnector();

  const depositsArray = [];
  for (let i = 0; i < recordsArr.length; i++) {
    depositsArray.push(
      prisma.depositsWithdrawals.upsert({
        where: {
          account_utc_time_asset_change: {
            account: recordsArr[i].key_id,
            utc_time: recordsArr[i].utc_time,
            asset: recordsArr[i].asset,
            change: recordsArr[i].change,
          },
        },
        create: {
          account: recordsArr[i].key_id,
          utc_time: recordsArr[i].utc_time,
          asset: recordsArr[i].asset,
          change: recordsArr[i].change,
        },
        update: {},
      })
    );
  }

  await prisma.$transaction(depositsArray); // serializable by default
};

export interface ITransactionSelector {
  start: number; // UTC ms
  end: number; // UTC ms
  ids: number[];
}

export const getCryptoRecords = async (selector: ITransactionSelector) => {
  return prisma.depositsWithdrawals.findMany({
    where: {
      account: {
        in: selector.ids,
      },
      utc_time: {
        lte: selector.end,
        gte: selector.start,
      },
      asset: {
        notIn: params.fiat,
      },
    },
    select: {
      asset: true,
      utc_time: true,
      dw_id: true,
      change: true,
    },
    orderBy: {
      utc_time: "asc",
    },
  });
};

export const getFiatRecords = async (selector: ITransactionSelector) => {
  return prisma.depositsWithdrawals.findMany({
    where: {
      account: {
        in: selector.ids,
      },
      utc_time: {
        lte: selector.end,
        gte: selector.start,
      },
      asset: {
        in: params.fiat,
      },
    },
    select: {
      asset: true,
      utc_time: true,
      dw_id: true,
      change: true,
    },
    orderBy: {
      utc_time: "asc",
    },
  });
};
