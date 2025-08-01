/*
  Warnings:

  - You are about to drop the column `planeType` on the `FlightStrip` table. All the data in the column will be lost.
  - Added the required column `aircraftType` to the `FlightStrip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `callsign` to the `FlightStrip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."FlightStrip" DROP COLUMN "planeType",
ADD COLUMN     "aircraftType" TEXT NOT NULL,
ADD COLUMN     "callsign" TEXT NOT NULL,
ADD COLUMN     "numberOfAircrafts" INTEGER NOT NULL DEFAULT 1;
