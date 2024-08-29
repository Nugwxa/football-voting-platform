/*
  Warnings:

  - You are about to drop the column `candidates` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `isEnabled` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the `voteregigtration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pollId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedPlayerId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voterId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `voteregigtration` DROP FOREIGN KEY `VoteRegigtration_voteId_fkey`;

-- DropForeignKey
ALTER TABLE `voteregigtration` DROP FOREIGN KEY `VoteRegigtration_voterId_fkey`;

-- AlterTable
ALTER TABLE `vote` DROP COLUMN `candidates`,
    DROP COLUMN `expiryDate`,
    DROP COLUMN `isEnabled`,
    DROP COLUMN `startDate`,
    DROP COLUMN `title`,
    ADD COLUMN `pollId` VARCHAR(191) NOT NULL,
    ADD COLUMN `selectedPlayerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `voterId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `voteregigtration`;

-- CreateTable
CREATE TABLE `Poll` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closingDate` DATETIME(3) NOT NULL,
    `img` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PollPlayer` (
    `pollId` VARCHAR(191) NOT NULL,
    `playerId` VARCHAR(191) NOT NULL,

    INDEX `PollPlayer_pollId_idx`(`pollId`),
    INDEX `PollPlayer_playerId_idx`(`playerId`),
    PRIMARY KEY (`pollId`, `playerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_selectedPlayerId_fkey` FOREIGN KEY (`selectedPlayerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_voterId_fkey` FOREIGN KEY (`voterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollPlayer` ADD CONSTRAINT `PollPlayer_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PollPlayer` ADD CONSTRAINT `PollPlayer_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
