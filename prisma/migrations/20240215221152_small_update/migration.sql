/*
  Warnings:

  - You are about to drop the column `outerBottomy` on the `StaveCurveConfigDetails` table. All the data in the column will be lost.
  - Added the required column `outerBottomY` to the `StaveCurveConfigDetails` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StaveCurveConfigDetails" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "posX" REAL NOT NULL,
    "posY" REAL NOT NULL,
    "innerTopX" REAL NOT NULL,
    "innerTopY" REAL NOT NULL,
    "outerTopX" REAL NOT NULL,
    "outerTopY" REAL NOT NULL,
    "innerBottomX" REAL NOT NULL,
    "innerBottomY" REAL NOT NULL,
    "outerBottomX" REAL NOT NULL,
    "outerBottomY" REAL NOT NULL,
    "rectX" REAL NOT NULL,
    "rectY" REAL NOT NULL,
    "rectWidth" REAL NOT NULL,
    "rectHeight" REAL NOT NULL,
    "staveCurveConfigId" TEXT NOT NULL,
    CONSTRAINT "StaveCurveConfigDetails_staveCurveConfigId_fkey" FOREIGN KEY ("staveCurveConfigId") REFERENCES "StaveCurveConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StaveCurveConfigDetails" ("id", "innerBottomX", "innerBottomY", "innerTopX", "innerTopY", "outerBottomX", "outerTopX", "outerTopY", "paperType", "posX", "posY", "rectHeight", "rectWidth", "rectX", "rectY", "rotatePaper", "staveCurveConfigId") SELECT "id", "innerBottomX", "innerBottomY", "innerTopX", "innerTopY", "outerBottomX", "outerTopX", "outerTopY", "paperType", "posX", "posY", "rectHeight", "rectWidth", "rectX", "rectY", "rotatePaper", "staveCurveConfigId" FROM "StaveCurveConfigDetails";
DROP TABLE "StaveCurveConfigDetails";
ALTER TABLE "new_StaveCurveConfigDetails" RENAME TO "StaveCurveConfigDetails";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
