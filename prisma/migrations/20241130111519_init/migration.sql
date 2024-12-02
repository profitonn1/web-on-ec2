/*
  Warnings:

  - You are about to drop the `UserCurrentPairedDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserCurrentPairedDetails` DROP FOREIGN KEY `UserCurrentPairedDetails_authorId_fkey`;

-- DropTable
DROP TABLE `UserCurrentPairedDetails`;

-- CreateTable
CREATE TABLE `UserAutomaticPairedDetails` (
    `id` VARCHAR(191) NOT NULL,
    `authorId` VARCHAR(191) NOT NULL,
    `isPaired` BOOLEAN NOT NULL DEFAULT false,
    `opponentId` VARCHAR(191) NULL,
    `amount` DOUBLE NULL,
    `category` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserAutomaticPairedDetails_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserAutomaticPairedDetails` ADD CONSTRAINT `UserAutomaticPairedDetails_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
