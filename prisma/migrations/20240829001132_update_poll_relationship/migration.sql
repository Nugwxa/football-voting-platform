/*
  Warnings:

  - You are about to drop the `pollplayer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pollplayer` DROP FOREIGN KEY `PollPlayer_playerId_fkey`;

-- DropForeignKey
ALTER TABLE `pollplayer` DROP FOREIGN KEY `PollPlayer_pollId_fkey`;

-- DropTable
DROP TABLE `pollplayer`;

-- CreateTable
CREATE TABLE `_PlayerToPoll` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PlayerToPoll_AB_unique`(`A`, `B`),
    INDEX `_PlayerToPoll_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PlayerToPoll` ADD CONSTRAINT `_PlayerToPoll_A_fkey` FOREIGN KEY (`A`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PlayerToPoll` ADD CONSTRAINT `_PlayerToPoll_B_fkey` FOREIGN KEY (`B`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
