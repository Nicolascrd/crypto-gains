CREATE TABLE keys (key_id INTEGER PRIMARY KEY, 
name TEXT NOT NULL,
public_key TEXT NOT NULL,
secret_key TEXT NOT NULL);

CREATE TABLE depositsWithdrawals(dw_id INTEGER PRIMARY KEY, 
account INTEGER NOT NULL, 
utc_time INTEGER, 
asset TEXT NOT NULL, 
change REAL NOT NULL, 
FOREIGN KEY(account) REFERENCES keys(key_id));
