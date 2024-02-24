/*
  Warnings:

  - You are about to drop the column `posX` on the `StaveEndConfigDetails` table. All the data in the column will be lost.
  - You are about to drop the column `posY` on the `StaveEndConfigDetails` table. All the data in the column will be lost.
  - You are about to drop the column `spacing` on the `StaveEndConfigDetails` table. All the data in the column will be lost.
  - Added the required column `bottomEndY` to the `StaveEndConfigDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topEndY` to the `StaveEndConfigDetails` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StaveEndConfigDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "topEndY" REAL NOT NULL,
    "bottomEndY" REAL NOT NULL,
    "staveEndConfigId" TEXT,
    CONSTRAINT "StaveEndConfigDetails_staveEndConfigId_fkey" FOREIGN KEY ("staveEndConfigId") REFERENCES "StaveEndConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StaveEndConfigDetails" ("id", "paperType", "rotatePaper", "staveEndConfigId") SELECT "id", "paperType", "rotatePaper", "staveEndConfigId" FROM "StaveEndConfigDetails";
DROP TABLE "StaveEndConfigDetails";
ALTER TABLE "new_StaveEndConfigDetails" RENAME TO "StaveEndConfigDetails";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
