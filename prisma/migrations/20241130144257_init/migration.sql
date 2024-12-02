/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `UserAutomaticPairedDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `UserAutomaticPairedDetails` MODIFY `amount` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserAutomaticPairedDetails_authorId_key` ON `UserAutomaticPairedDetails`(`authorId`);
