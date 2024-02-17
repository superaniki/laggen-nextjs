-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Barrel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
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
    "userId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Barrel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaveCurveConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "defaultPaperType" TEXT NOT NULL,
    "barrelId" TEXT NOT NULL,
    CONSTRAINT "StaveCurveConfig_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StaveCurveConfigDetails" (
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
    "outerBottomy" REAL NOT NULL,
    "rectX" REAL NOT NULL,
    "rectY" REAL NOT NULL,
    "rectWidth" REAL NOT NULL,
    "rectHeight" REAL NOT NULL,
    "staveCurveConfigId" TEXT NOT NULL,
    CONSTRAINT "StaveCurveConfigDetails_staveCurveConfigId_fkey" FOREIGN KEY ("staveCurveConfigId") REFERENCES "StaveCurveConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Barrel_slug_key" ON "Barrel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Barrel_name_key" ON "Barrel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StaveCurveConfig_barrelId_key" ON "StaveCurveConfig"("barrelId");
