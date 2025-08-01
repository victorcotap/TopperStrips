-- CreateTable
CREATE TABLE "public"."FlightStrip" (
    "id" TEXT NOT NULL,
    "planeType" TEXT NOT NULL,
    "missionType" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "altitude" INTEGER NOT NULL,
    "column" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlightStrip_pkey" PRIMARY KEY ("id")
);
