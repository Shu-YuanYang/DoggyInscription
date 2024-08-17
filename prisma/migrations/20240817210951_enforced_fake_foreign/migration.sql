/*
  Warnings:

  - You are about to drop the `FakeConnectedSites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FakeConnectedSites";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FakeConnectedSite" (
    "site" TEXT NOT NULL,
    "walletAddr" TEXT NOT NULL,

    PRIMARY KEY ("site", "walletAddr"),
    CONSTRAINT "FakeConnectedSite_walletAddr_fkey" FOREIGN KEY ("walletAddr") REFERENCES "FakeWallet" ("address") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FakeInscription" (
    "type" TEXT NOT NULL,
    "hash" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "walletAddr" TEXT NOT NULL,
    "gasFee" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "FakeInscription_walletAddr_fkey" FOREIGN KEY ("walletAddr") REFERENCES "FakeWallet" ("address") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FakeInscription" ("data", "gasFee", "hash", "timestamp", "type", "walletAddr") SELECT "data", "gasFee", "hash", "timestamp", "type", "walletAddr" FROM "FakeInscription";
DROP TABLE "FakeInscription";
ALTER TABLE "new_FakeInscription" RENAME TO "FakeInscription";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
