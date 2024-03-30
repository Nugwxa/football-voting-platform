-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `candidates` JSON NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `isEnabled` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VoteRegigtration` (
    `id` VARCHAR(191) NOT NULL,
    `voteId` VARCHAR(191) NOT NULL,
    `voterId` VARCHAR(191) NOT NULL,
    `selectedCandidate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteRegigtration` ADD CONSTRAINT `VoteRegigtration_voteId_fkey` FOREIGN KEY (`voteId`) REFERENCES `Vote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoteRegigtration` ADD CONSTRAINT `VoteRegigtration_voterId_fkey` FOREIGN KEY (`voterId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
