/*
  Warnings:

  - You are about to drop the column `price` on the `ProductInstances` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ProductInstances` DROP COLUMN `price`,
    ADD COLUMN `distributorPrice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `manufacturerPrice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `retailerPrice` DOUBLE NOT NULL DEFAULT 0;
