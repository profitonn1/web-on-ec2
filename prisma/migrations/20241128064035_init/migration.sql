/*
  Warnings:

  - You are about to drop the `ChallengeHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `lastActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `ChallengeHistory`;

-- CreateTable
CREATE TABLE `ChallangeHistory` (
    `id` VARCHAR(191) NOT NULL,
    `player1` VARCHAR(191) NOT NULL,
    `player2` VARCHAR(191) NOT NULL,
    `player1Bet` DOUBLE NOT NULL,
    `player2Bet` DOUBLE NOT NULL,
    `win` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChallangeHistory_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
