/*
  Warnings:

  - You are about to drop the column `imgUrl` on the `player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `player` DROP COLUMN `imgUrl`,
    ADD COLUMN `img` JSON NULL;
