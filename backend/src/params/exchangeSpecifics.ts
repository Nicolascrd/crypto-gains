export const params = {
  exchanges: ["Binance", "Kraken"],
  fiat: [
    "GBP",
    "TRY",
    "EUR",
    "KZT",
    "AUD",
    "BRL",
    "RUB",
    "UAH",
    "VND",
    "GHS",
    "PHP",
    "ZAR",
    "NZD",
    "BHD",
    "RON",
    "HUF",
    "CZK",
    "PLN",
    "KWD",
    "SAR",
    "QAR",
    "OMR",
    "PKR",
    "UZS",
    "NGN",
    "AED",
    "ARS",
    "CHF",
    "CAD",
    "JPY",
    "USD"
  ],
  binanceDeposits: ["Deposit", "Withdraw"],
  krakenDeposits: ["deposit", "withdrawal"],
  krakenAssets: {
    XBT: "BTC",
    XXBT: "BTC",
    XETH: "ETH",
    XXRP: "XRP",
    XXLM: "XLM",
    XLTC: "LTC",
    LUNA: "LUNC",
    LUNA2: "LUNA",
    UST: "USTC",
    ZUSD: "USD",
    ZEUR: "EUR",
    "XTZ.S": "XTZ",
    "DOT.S": "DOT",
  } as Record<string, string>,
  krakenUSDPairs: [
    "1INCH",
    "AAVE",
    "ACA",
    "ACH",
    "ADA",
    "ADX",
    "AGLD",
    "AIR",
    "AKT",
    "ALCX",
    "ALGO",
    "ALICE",
    "ALPHA",
    "ANKR",
    "ANT",
    "APE",
    "API3",
    "APT",
    "ARPA",
    "ASTR",
    "ATLAS",
    "ATOM",
    "AUDIO",
    "AUD",
    "AVAX",
    "AXS",
    "BADGER",
    "BAL",
    "BAND",
    "BAT",
    "BCH",
    "BICO",
    "BIT",
    "BNC",
    "BNT",
    "BOBA",
    "BOND",
    "BSX",
    "BTT",
    "C98",
    "CELR",
    "CFG",
    "CHR",
    "COMP",
    "COTI",
    "CQT",
    "CRV",
    "CSM",
    "CTSI",
    "CVC",
    "CVX",
    "DAI",
    "DASH",
    "DENT",
    "DOT",
    "DYDX",
    "EGLD",
    "ENJ",
    "ENS",
    "EOS",
    "ETHW",
    "EUL",
    "EWT",
    "FARM",
    "FET",
    "FIDA",
    "FIL",
    "FIS",
    "FLOW",
    "FLR",
    "FORTH",
    "FTM",
    "FXS",
    "GALA",
    "GAL",
    "GARI",
    "GHST",
    "GLMR",
    "GMT",
    "GNO",
    "GRT",
    "GST",
    "GTC",
    "HDX",
    "HFT",
    "ICP",
    "ICX",
    "IDEX",
    "IMX",
    "INJ",
    "INTR",
    "JASMY",
    "JUNO",
    "KAR",
    "KAVA",
    "KEEP",
    "KEY",
    "KILT",
    "KINT",
    "KIN",
    "KNC",
    "KP3R",
    "KSM",
    "LCX",
    "LDO",
    "LINK",
    "LPT",
    "LRC",
    "LSK",
    "LUNA2",
    "LUNA",
    "MANA",
    "MASK",
    "MATIC",
    "MC",
    "MINA",
    "MIR",
    "MKR",
    "MNGO",
    "MOVR",
    "MSOL",
    "MULTI",
    "MV",
    "MXC",
    "NANO",
    "NEAR",
    "NMR",
    "NODL",
    "NYM",
    "OCEAN",
    "OGN",
    "OMG",
    "ORCA",
    "OXT",
    "OXY",
    "PARA",
    "PAXG",
    "PERP",
    "PHA",
    "PLA",
    "POLIS",
    "POLS",
    "POND",
    "POWR",
    "PSTAKE",
    "QNT",
    "QTUM",
    "RAD",
    "RARE",
    "RARI",
    "RAY",
    "RBC",
    "REN",
    "REPV2",
    "REQ",
    "RLC",
    "RNDR",
    "ROOK",
    "RPL",
    "RUNE",
    "SAMO",
    "SAND",
    "SBR",
    "SCRT",
    "SC",
    "SDN",
    "SGB",
    "SHIB",
    "SNX",
    "SOL",
    "SPELL",
    "SRM",
    "STEP",
    "STG",
    "STORJ",
    "STX",
    "SUPER",
    "SUSHI",
    "SYN",
    "TBTC",
    "TEER",
    "TLM",
    "TOKE",
    "TRIBE",
    "TRU",
    "TRX",
    "T",
    "TVK",
    "UMA",
    "UNFI",
    "UNI",
    "USDC",
    "UST",
    "WAVES",
    "WAXL",
    "WBTC",
    "WOO",
    "XCN",
    "XDG",
    "XRT",
    "YFI",
    "YGG",
    "ZRX",
    // FIAT BEHAVE LIKE CRYPTO ON KRAKEN API, However some fiat currencies are unavailable
    "EUR",
    "GBP",
    "AUD",
  ],
  binanceUSDTPairs: [
    "BTC",
    "ETH",
    "BNB",
    "NEO",
    "LTC",
    "QTUM",
    "ADA",
    "XRP",
    "EOS",
    "IOTA",
    "XLM",
    "ONT",
    "TRX",
    "ETC",
    "ICX",
    "NULS",
    "VET",
    "LINK",
    "WAVES",
    "ONG",
    "HOT",
    "ZIL",
    "ZRX",
    "FET",
    "BAT",
    "XMR",
    "ZEC",
    "IOST",
    "CELR",
    "DASH",
    "OMG",
    "THETA",
    "ENJ",
    "MITH",
    "MATIC",
    "ATOM",
    "TFUEL",
    "ONE",
    "FTM",
    "ALGO",
    "DOGE",
    "DUSK",
    "ANKR",
    "WIN",
    "COS",
    "COCOS",
    "MTL",
    "TOMO",
    "PERL",
    "DENT",
    "MFT",
    "KEY",
    "DOCK",
    "WAN",
    "FUN",
    "CHZ",
    "BAND",
    "BUSD",
    "BEAM",
    "XTZ",
    "REN",
    "RVN",
    "HBAR",
    "NKN",
    "STX",
    "KAVA",
    "ARPA",
    "IOTX",
    "RLC",
    "CTXC",
    "BCH",
    "TROY",
    "VITE",
    "EUR",
    "OGN",
    "DREP",
    "WRX",
    "BTS",
    "LSK",
    "BNT",
    "LTO",
    "AION",
    "MBL",
    "COTI",
    "STPT",
    "WTC",
    "DATA",
    "SOL",
    "CTSI",
    "HIVE",
    "CHR",
    "ARDR",
    "MDT",
    "LUNC",
    "STMX",
    "KNC",
    "REP",
    "LRC",
    "PNT",
    "COMP",
    "SC",
    "ZEN",
    "SNX",
    "VTHO",
    "DGB",
    "GBP",
    "SXP",
    "MKR",
    "DCR",
    "STORJ",
    "MANA",
    "AUD",
    "YFI",
    "BAL",
    "BLZ",
    "IRIS",
    "KMD",
    "JST",
    "ANT",
    "CRV",
    "SAND",
    "OCEAN",
    "NMR",
    "DOT",
    "LUNA",
    "RSR",
    "PAXG",
    "WNXM",
    "TRB",
    "SUSHI",
    "YFII",
    "KSM",
    "EGLD",
    "DIA",
    "RUNE",
    "FIO",
    "UMA",
    "BEL",
    "WING",
    "UNI",
    "OXT",
    "SUN",
    "AVAX",
    "FLM",
    "ORN",
    "UTK",
    "XVS",
    "ALPHA",
    "AAVE",
    "NEAR",
    "FIL",
    "INJ",
    "AUDIO",
    "CTK",
    "AKRO",
    "AXS",
    "HARD",
    "STRAX",
    "UNFI",
    "ROSE",
    "AVA",
    "XEM",
    "SKL",
    "GRT",
    "JUV",
    "PSG",
    "1INCH",
    "REEF",
    "OG",
    "ATM",
    "ASR",
    "CELO",
    "RIF",
    "TRU",
    "CKB",
    "TWT",
    "FIRO",
    "LIT",
    "SFP",
    "DODO",
    "CAKE",
    "ACM",
    "BADGER",
    "FIS",
    "OM",
    "POND",
    "DEGO",
    "ALICE",
    "LINA",
    "PERP",
    "SUPER",
    "CFX",
    "AUTO",
    "TKO",
    "PUNDIX",
    "TLM",
    "MIR",
    "BAR",
    "FORTH",
    "BAKE",
    "BURGER",
    "SLP",
    "SHIB",
    "ICP",
    "AR",
    "POLS",
    "MDX",
    "MASK",
    "LPT",
    "XVG",
    "ATA",
    "GTC",
    "TORN",
    "ERN",
    "KLAY",
    "PHA",
    "BOND",
    "MLN",
    "DEXE",
    "CLV",
    "QNT",
    "FLOW",
    "TVK",
    "MINA",
    "RAY",
    "FARM",
    "ALPACA",
    "QUICK",
    "MBOX",
    "FOR",
    "REQ",
    "GHST",
    "WAXP",
    "GNO",
    "XEC",
    "ELF",
    "DYDX",
    "IDEX",
    "VIDT",
    "GALA",
    "ILV",
    "YGG",
    "SYS",
    "DF",
    "FIDA",
    "FRONT",
    "CVP",
    "AGLD",
    "RAD",
    "BETA",
    "RARE",
    "LAZIO",
    "CHESS",
    "ADX",
    "AUCTION",
    "DAR",
    "BNX",
    "MOVR",
    "CITY",
    "ENS",
    "QI",
    "PORTO",
    "POWR",
    "VGX",
    "JASMY",
    "AMP",
    "PLA",
    "PYR",
    "RNDR",
    "ALCX",
    "SANTOS",
    "MC",
    "BICO",
    "FLUX",
    "FXS",
    "VOXEL",
    "HIGH",
    "CVX",
    "PEOPLE",
    "OOKI",
    "SPELL",
    "JOE",
    "ACH",
    "IMX",
    "GLMR",
    "LOKA",
    "SCRT",
    "API3USDT",
    "BTTC",
    "ACA",
    "ANC",
    "XNO",
    "WOO",
    "ALPINE",
    "ASTR",
    "GMT",
    "KDA",
    "APE",
    "BSW",
    "BIFI",
    "MULTI",
    "STEEM",
    "MOB",
    "NEXO",
    "REI",
    "GAL",
    "LDO",
    "EPX",
    "OP",
    "LEVER",
    "STG",
    "LUNC",
    "GMX",
    "NEBL",
    "POLYX",
    "APT",
    "OSMO",
    "HFT",
    "PHB",
    "HOOK",
    "MAGIC",
  ],
  binanceBUSDpairs: ["USTC"],
};
