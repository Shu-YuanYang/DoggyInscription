-- CreateTable
CREATE TABLE "FakeWallet" (
    "addressType" TEXT NOT NULL,
    "address" TEXT NOT NULL PRIMARY KEY,
    "customHdPath" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "network" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FakeConnectedSites" (
    "site" TEXT NOT NULL,
    "walletAddr" TEXT NOT NULL,

    PRIMARY KEY ("site", "walletAddr"),
    CONSTRAINT "FakeConnectedSites_walletAddr_fkey" FOREIGN KEY ("walletAddr") REFERENCES "FakeWallet" ("address") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FakeInscription" (
    "type" TEXT NOT NULL,
    "hash" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "walletAddr" TEXT NOT NULL,
    "gasFee" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL
);
