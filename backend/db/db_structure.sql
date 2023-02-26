CREATE TABLE keys (
    key_id INTEGER PRIMARY KEY,
    exchange TEXT CHECK(exchange IN ('Binance', 'Kraken')) NOT NULL,
    name TEXT NOT NULL,
    public_key TEXT NOT NULL UNIQUE,
    secret_key TEXT NOT NULL
);

CREATE TABLE depositsWithdrawals (
    dw_id INTEGER PRIMARY KEY,
    account INTEGER NOT NULL,
    utc_time INTEGER NOT NULL,
    asset TEXT NOT NULL,
    change REAL NOT NULL,
    FOREIGN KEY(account) REFERENCES keys(key_id),
    UNIQUE(account, utc_time, asset, change)
);