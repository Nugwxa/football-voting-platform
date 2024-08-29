-- CreateTable
CREATE TABLE `Player` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `squadNumber` INTEGER NOT NULL,
    `position` ENUM('Goalkeeper', 'Defender', 'Midfielder', 'Forward') NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    UNIQUE INDEX `Player_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
