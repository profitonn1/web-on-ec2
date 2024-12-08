/*
  Warnings:

  - The primary key for the `TotalAutomaticHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TotalAutomaticHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId]` on the table `TotalAutomaticHistory` will be added. If there are existing duplicate values, this will fail.
  - The required column `gameId` was added to the `TotalAutomaticHistory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX `TotalAutomaticHistory_id_key` ON `TotalAutomaticHistory`;

-- AlterTable
ALTER TABLE `TotalAutomaticHistory` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `gameId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`gameId`);

-- CreateIndex
CREATE UNIQUE INDEX `TotalAutomaticHistory_gameId_key` ON `TotalAutomaticHistory`(`gameId`);
