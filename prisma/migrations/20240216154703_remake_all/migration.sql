/*
  Warnings:

  - You are about to drop the column `angle` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `bottomDiameter` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `bottomMargin` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `bottomThickness` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `isExample` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `staveBottomThickness` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `staveLength` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `staveTopThickness` on the `Barrel` table. All the data in the column will be lost.
  - You are about to drop the column `topDiameter` on the `Barrel` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BarrelDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "bottomDiameter" REAL NOT NULL,
    "topDiameter" REAL NOT NULL,
    "staveLength" REAL NOT NULL,
    "angle" REAL NOT NULL,
    "staveBottomThickness" REAL NOT NULL,
    "staveTopThickness" REAL NOT NULL,
    "bottomThickness" REAL NOT NULL,
    "bottomMargin" REAL NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "barrelId" TEXT NOT NULL,
    CONSTRAINT "BarrelDetails_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Barrel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Barrel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Barrel" ("createdAt", "id", "slug", "updatedAt", "userId") SELECT "createdAt", "id", "slug", "updatedAt", "userId" FROM "Barrel";
DROP TABLE "Barrel";
ALTER TABLE "new_Barrel" RENAME TO "Barrel";
CREATE UNIQUE INDEX "Barrel_slug_key" ON "Barrel"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "BarrelDetails_name_key" ON "BarrelDetails"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BarrelDetails_barrelId_key" ON "BarrelDetails"("barrelId");
