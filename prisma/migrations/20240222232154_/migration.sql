-- DropIndex
DROP INDEX "BarrelDetails_name_key";

-- CreateTable
CREATE TABLE "StaveFrontConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultPaperType" TEXT NOT NULL,
    "barrelId" TEXT NOT NULL,
    CONSTRAINT "StaveFrontConfig_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaveFrontConfigDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "posX" REAL NOT NULL,
    "posY" REAL NOT NULL,
    "spacing" REAL NOT NULL,
    "staveFrontConfigId" TEXT,
    CONSTRAINT "StaveFrontConfigDetails_staveFrontConfigId_fkey" FOREIGN KEY ("staveFrontConfigId") REFERENCES "StaveFrontConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaveEndConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultPaperType" TEXT NOT NULL,
    "barrelId" TEXT NOT NULL,
    CONSTRAINT "StaveEndConfig_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaveEndConfigDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "posX" REAL NOT NULL,
    "posY" REAL NOT NULL,
    "spacing" REAL NOT NULL,
    "staveEndConfigId" TEXT,
    CONSTRAINT "StaveEndConfigDetails_staveEndConfigId_fkey" FOREIGN KEY ("staveEndConfigId") REFERENCES "StaveEndConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StaveFrontConfig_barrelId_key" ON "StaveFrontConfig"("barrelId");

-- CreateIndex
CREATE UNIQUE INDEX "StaveEndConfig_barrelId_key" ON "StaveEndConfig"("barrelId");
