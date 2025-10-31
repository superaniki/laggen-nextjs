-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
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

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Barrel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barrel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarrelDetails" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "bottomDiameter" DOUBLE PRECISION NOT NULL,
    "topDiameter" DOUBLE PRECISION NOT NULL,
    "staveLength" DOUBLE PRECISION NOT NULL,
    "angle" DOUBLE PRECISION NOT NULL,
    "staveBottomThickness" DOUBLE PRECISION NOT NULL,
    "staveTopThickness" DOUBLE PRECISION NOT NULL,
    "bottomThickness" DOUBLE PRECISION NOT NULL,
    "bottomMargin" DOUBLE PRECISION NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isExample" BOOLEAN NOT NULL DEFAULT false,
    "barrelId" TEXT NOT NULL,

    CONSTRAINT "BarrelDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaveCurveConfig" (
    "id" TEXT NOT NULL,
    "defaultPaperType" TEXT NOT NULL,
    "barrelId" TEXT NOT NULL,

    CONSTRAINT "StaveCurveConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaveCurveConfigDetails" (
    "id" TEXT NOT NULL,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "posX" DOUBLE PRECISION NOT NULL,
    "posY" DOUBLE PRECISION NOT NULL,
    "innerTopX" DOUBLE PRECISION NOT NULL,
    "innerTopY" DOUBLE PRECISION NOT NULL,
    "outerTopX" DOUBLE PRECISION NOT NULL,
    "outerTopY" DOUBLE PRECISION NOT NULL,
    "innerBottomX" DOUBLE PRECISION NOT NULL,
    "innerBottomY" DOUBLE PRECISION NOT NULL,
    "outerBottomX" DOUBLE PRECISION NOT NULL,
    "outerBottomY" DOUBLE PRECISION NOT NULL,
    "rectX" DOUBLE PRECISION NOT NULL,
    "rectY" DOUBLE PRECISION NOT NULL,
    "rectWidth" DOUBLE PRECISION NOT NULL,
    "rectHeight" DOUBLE PRECISION NOT NULL,
    "staveCurveConfigId" TEXT NOT NULL,

    CONSTRAINT "StaveCurveConfigDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaveFrontConfig" (
    "id" TEXT NOT NULL,
    "defaultPaperType" TEXT NOT NULL,
    "barrelId" TEXT NOT NULL,

    CONSTRAINT "StaveFrontConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaveFrontConfigDetails" (
    "id" TEXT NOT NULL,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "posX" DOUBLE PRECISION NOT NULL,
    "posY" DOUBLE PRECISION NOT NULL,
    "spacing" DOUBLE PRECISION NOT NULL,
    "staveFrontConfigId" TEXT,

    CONSTRAINT "StaveFrontConfigDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaveEndConfig" (
    "id" TEXT NOT NULL,
    "defaultPaperType" TEXT NOT NULL,
    "barrelId" TEXT NOT NULL,

    CONSTRAINT "StaveEndConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaveEndConfigDetails" (
    "id" TEXT NOT NULL,
    "paperType" TEXT NOT NULL,
    "rotatePaper" BOOLEAN NOT NULL,
    "topEndY" DOUBLE PRECISION NOT NULL,
    "bottomEndY" DOUBLE PRECISION NOT NULL,
    "staveEndConfigId" TEXT,

    CONSTRAINT "StaveEndConfigDetails_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "BarrelDetails_barrelId_key" ON "BarrelDetails"("barrelId");

-- CreateIndex
CREATE UNIQUE INDEX "StaveCurveConfig_barrelId_key" ON "StaveCurveConfig"("barrelId");

-- CreateIndex
CREATE UNIQUE INDEX "StaveFrontConfig_barrelId_key" ON "StaveFrontConfig"("barrelId");

-- CreateIndex
CREATE UNIQUE INDEX "StaveEndConfig_barrelId_key" ON "StaveEndConfig"("barrelId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Barrel" ADD CONSTRAINT "Barrel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarrelDetails" ADD CONSTRAINT "BarrelDetails_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaveCurveConfig" ADD CONSTRAINT "StaveCurveConfig_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaveCurveConfigDetails" ADD CONSTRAINT "StaveCurveConfigDetails_staveCurveConfigId_fkey" FOREIGN KEY ("staveCurveConfigId") REFERENCES "StaveCurveConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaveFrontConfig" ADD CONSTRAINT "StaveFrontConfig_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaveFrontConfigDetails" ADD CONSTRAINT "StaveFrontConfigDetails_staveFrontConfigId_fkey" FOREIGN KEY ("staveFrontConfigId") REFERENCES "StaveFrontConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaveEndConfig" ADD CONSTRAINT "StaveEndConfig_barrelId_fkey" FOREIGN KEY ("barrelId") REFERENCES "Barrel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaveEndConfigDetails" ADD CONSTRAINT "StaveEndConfigDetails_staveEndConfigId_fkey" FOREIGN KEY ("staveEndConfigId") REFERENCES "StaveEndConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
