/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteNumber" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "tankerCapacity" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Generator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serialNumber" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacityKVA" REAL NOT NULL,
    "stdConsumption" REAL NOT NULL,
    "currentRunningHour" REAL NOT NULL DEFAULT 0,
    "siteId" TEXT NOT NULL,
    CONSTRAINT "Generator_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workOrderNumber" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'ROUTINE',
    "status" TEXT NOT NULL DEFAULT 'PENDING_SUPERVISOR',
    "requestedBy" TEXT NOT NULL,
    "requesterEmail" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "begRunningHour" REAL,
    "endRunningHour" REAL,
    "totalRunningHour" REAL,
    "actualRefueled" REAL,
    "fuelBeforeRefuel" REAL,
    "unitPrice" REAL,
    "guardName" TEXT,
    "guardSource" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkRequest_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Site_siteNumber_key" ON "Site"("siteNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Generator_serialNumber_key" ON "Generator"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WorkRequest_workOrderNumber_key" ON "WorkRequest"("workOrderNumber");
